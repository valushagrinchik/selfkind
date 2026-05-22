import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { TestsHandler } from './handlers/tests.handler';
import { SelfTrustHandler } from './handlers/self-trust.handler';
import { StateModule } from 'src/state/state.module';
import { TrustModule } from 'src/trust/trust.module';

@Module({
    imports: [StateModule, TrustModule],
    providers: [SelfTrustHandler, TestsHandler, BotService],
})
export class BotModule { }