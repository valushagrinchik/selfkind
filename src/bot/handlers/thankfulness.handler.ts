import { Injectable } from '@nestjs/common';
import { StateManager } from '../../state/state.manager';
import { Context, Markup } from 'telegraf';
import { BaseHandler } from './base.handler';
import { ThankfulnessService } from 'src/thankfulness/thankfulness.service';
import { CreateThankfulnessMomentInput } from 'src/thankfulness/thankfulness.types';
import { formatTimeline } from './timeline.formatter';
import { ScenarioButtons, thankfulnessFlow } from '../bot.scenarios';


@Injectable()
export class ThankfulnessHandler extends BaseHandler {

    constructor(
        protected readonly stateManager: StateManager,
        private readonly thankfulnessService: ThankfulnessService

    ) {
        super(stateManager, thankfulnessFlow);
        this.startMenu = Markup.inlineKeyboard([
            [Markup.button.callback('🤝 Добавить', ScenarioButtons.thankfulnessStart)],
            [Markup.button.callback('📚 История', ScenarioButtons.thankfulnessTimeline)],
        ])
    }

    async finish(ctx: Context, data?: Record<string, any>): Promise<void> {
        await this.thankfulnessService.createMoment({
            userId: String(ctx.from!.id),
            ...data,

        } as CreateThankfulnessMomentInput);
    }

    async timeline(ctx: Context) {
        const userId = String(ctx.from?.id);

        if (!userId) {
            return;
        }

        const moments =
            await this.thankfulnessService.getTimeline(userId);

        const message = formatTimeline(moments, (moment) =>
            `✨ ${moment.situation} \nБлагодаря: ${moment.person} \nЯ: ${moment.action} \nМои чувства: ${moment.feelings}`);

        await ctx.reply(message, this.endMenu);
    }
}