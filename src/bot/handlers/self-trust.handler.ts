import { Injectable } from '@nestjs/common';
import { StateManager } from '../../state/state.manager';
import { Context, Markup } from 'telegraf';
import { TrustService } from '../../trust/trust.service';
import { CreateTrustMomentInput } from '../../trust/trust.types';
import { BaseHandler } from './base.handler';
import { formatTimeline } from './timeline.formatter';
import { ScenarioButtons, selfTrustFlow } from '../bot.scenarios';


@Injectable()
export class SelfTrustHandler extends BaseHandler {

    constructor(
        protected readonly stateManager: StateManager,
        private readonly trustService: TrustService
    ) {
        super(stateManager, selfTrustFlow);
        this.startMenu = Markup.inlineKeyboard([
            [Markup.button.callback('🤝 Добавить', ScenarioButtons.selfTrustStart)],
            [Markup.button.callback('📚 История', ScenarioButtons.selfTrustTimeline)],
        ])
    }

    async finish(ctx: Context, data?: Record<string, any>): Promise<void> {
        await this.trustService.createMoment({
            userId: String(ctx.from!.id),
            ...data,

        } as CreateTrustMomentInput);
    }


    async timeline(ctx: Context) {
        const userId = String(ctx.from?.id);

        if (!userId) {
            return;
        }

        const moments =
            await this.trustService.getTimeline(userId);

        const message = formatTimeline(moments, (moment) =>
            `${moment.situation} \n 🚫 почувствовала: ${moment.selfSignal} \n 🚀 выбрала: ${moment.chosenAction} \n 💪 в итоге: ${moment.feelingsAfter}`);

        await ctx.reply(message, this.endMenu);
    }
}