import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { StateManager } from './state.manager';

@Module({
    imports: [RedisModule],
    providers: [StateManager],
    exports: [StateManager],
})
export class StateModule { }