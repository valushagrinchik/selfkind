import { Injectable } from '@nestjs/common';

import { RedisService } from '../redis/redis.service';

import {
    FlowType,
    UserState,
} from './state.types';

@Injectable()
export class StateManager {
    private readonly TTL = 60 * 60 * 24; // 24h

    constructor(
        private readonly redis: RedisService,
    ) { }

    // ключ Redis
    private buildKey(userId: string) {
        return `state:${userId}`;
    }

    // получить state
    async get(userId: string): Promise<UserState | null> {
        const key = this.buildKey(userId);

        const raw = await this.redis.get(key);

        if (!raw) {
            return null;
        }

        return JSON.parse(raw);
    }

    // сохранить state
    async set(
        userId: string,
        state: UserState,
    ): Promise<void> {
        const key = this.buildKey(userId);

        await this.redis.set(
            key,
            JSON.stringify(state),
            this.TTL,
        );
    }

    // удалить state
    async reset(userId: string): Promise<void> {
        const key = this.buildKey(userId);

        await this.redis.del(key);
    }

    // начать новый flow
    async startFlow(
        userId: string,
        flow: FlowType,
        initialStep = 'start',
    ): Promise<UserState> {
        const state: UserState = {
            flow,
            step: initialStep,
            data: {},
            createdAt: Date.now(),
        };

        await this.set(userId, state);

        return state;
    }

    // обновить step
    async setStep(
        userId: string,
        step: string,
    ): Promise<UserState | null> {
        const state = await this.get(userId);

        if (!state) {
            return null;
        }

        const updated: UserState = {
            ...state,
            step,
        };

        await this.set(userId, updated);

        return updated;
    }

    // merge data
    async patchData(
        userId: string,
        data: Record<string, any>,
    ): Promise<UserState | null> {
        const state = await this.get(userId);

        if (!state) {
            return null;
        }

        const updated: UserState = {
            ...state,
            data: {
                ...state.data,
                ...data,
            },
        };

        await this.set(userId, updated);

        return updated;
    }

    // update step + data
    async update(
        userId: string,
        payload: {
            step?: string;
            data?: Record<string, any>;
        },
    ): Promise<UserState | null> {
        const state = await this.get(userId);

        if (!state) {
            return null;
        }

        const updated: UserState = {
            ...state,

            step: payload.step || state.step,

            data: {
                ...state.data,
                ...(payload.data || {}),
            },
        };

        await this.set(userId, updated);

        return updated;
    }

    // проверить flow
    async isInFlow(
        userId: string,
        flow: FlowType,
    ): Promise<boolean> {
        const state = await this.get(userId);

        if (!state) {
            return false;
        }

        return state.flow === flow;
    }
}