import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { SelfTrustHandler } from './handlers/self-trust.handler';
import { StateModule } from 'src/state/state.module';
import { TrustModule } from 'src/trust/trust.module';
import { ThankfulnessHandler } from './handlers/thankfulness.handler';
import { ThankfulnessModule } from 'src/thankfulness/thankfulness.module';

@Module({
    imports: [StateModule, TrustModule, ThankfulnessModule],
    providers: [SelfTrustHandler, ThankfulnessHandler, BotService],
})
export class BotModule { }