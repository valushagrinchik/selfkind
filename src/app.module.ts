import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { RedisModule } from './redis/redis.module';
import { TrustModule } from './trust/trust.module';
import { ThankfulnessModule } from './thankfulness/thankfulness.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    RedisModule,

    BotModule,
    TrustModule,
    ThankfulnessModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
