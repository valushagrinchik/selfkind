import {
    Injectable,
    OnModuleInit,
    OnModuleDestroy
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    constructor() {
        // 1. Initialize standard PG pool
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL
        });

        // 2. Wrap it with Prisma's driver adapter
        const adapter = new PrismaPg(pool);

        // 3. Pass the valid options object required by Prisma 7
        super({ adapter });
    }
    async onModuleInit() {
        await this.$connect();
        console.log('✅ PostgreSQL connected');
    }
    async onModuleDestroy() {
        await this.$disconnect();
        console.log('✅ PostgreSQL disconnected');
    }
}