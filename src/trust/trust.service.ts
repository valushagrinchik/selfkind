import { Injectable } from '@nestjs/common';

import { CreateTrustMomentInput } from './trust.types';
import { PrismaService } from 'src/database/prisma.service';


@Injectable()
export class TrustService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    // создать запись
    async createMoment(
        input: CreateTrustMomentInput,
    ) {
        return this.prisma.selfTrustMoment.create({
            data: {
                userId: input.userId,
                situation: input.situation,
                selfSignal: input.selfSignal,
                chosenAction: input.chosenAction,
                feelingsAfter: input.feelingsAfter,
                difficulty: input.difficulty,
            },
        });
    }

    // последние записи пользователя
    async getRecentMoments(
        userId: string,
        limit = 10,
    ) {
        return this.prisma.selfTrustMoment.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        });
    }

    // одна запись
    async getMomentById(
        id: string,
        userId: string,
    ) {
        return this.prisma.selfTrustMoment.findFirst({
            where: {
                id,
                userId,
            },
        });
    }

    // количество записей
    async getMomentsCount(userId: string) {
        return this.prisma.selfTrustMoment.count({
            where: {
                userId,
            },
        });
    }

    // удалить запись
    async deleteMoment(
        id: string,
        userId: string,
    ) {
        return this.prisma.selfTrustMoment.deleteMany({
            where: {
                id,
                userId,
            },
        });
    }

    // статистика
    async getStats(userId: string) {
        const total = await this.prisma.selfTrustMoment.count({
            where: {
                userId,
            },
        });

        const recent = await this.prisma.selfTrustMoment.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 5,
        });

        return {
            total,
            recent,
        };
    }
}