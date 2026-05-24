import { Injectable } from '@nestjs/common';

import { CreateThankfulnessMomentInput } from './thankfulness.types';
import { PrismaService } from 'src/database/prisma.service';


@Injectable()
export class ThankfulnessService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    // создать запись
    async createMoment(
        input: CreateThankfulnessMomentInput,
    ) {
        return this.prisma.thankfulnessMoment.create({
            data: {
                userId: input.userId,
                situation: input.situation,
                person: input.person,
                action: input.action,
                feelings: input.feelings,
            },
        });
    }

    // последние записи пользователя
    async getRecentMoments(
        userId: string,
        limit = 10,
    ) {
        return this.prisma.thankfulnessMoment.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        });
    }

    async getTimeline(userId: string) {
        return this.prisma.thankfulnessMoment.findMany({
            where: {
                userId,
            },

            orderBy: {
                createdAt: 'desc',
            },

            take: 50,
        });
    }

    // одна запись
    async getMomentById(
        id: string,
        userId: string,
    ) {
        return this.prisma.thankfulnessMoment.findFirst({
            where: {
                id,
                userId,
            },
        });
    }

    // количество записей
    async getMomentsCount(userId: string) {
        return this.prisma.thankfulnessMoment.count({
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
        return this.prisma.thankfulnessMoment.deleteMany({
            where: {
                id,
                userId,
            },
        });
    }

    // статистика
    async getStats(userId: string) {
        const total = await this.prisma.thankfulnessMoment.count({
            where: {
                userId,
            },
        });

        const recent = await this.prisma.thankfulnessMoment.findMany({
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