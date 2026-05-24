import { Injectable } from '@nestjs/common';
import { StateManager } from 'src/state/state.manager';
import { FlowType } from 'src/state/state.types';
import { Context, Markup } from 'telegraf';
import { BotFlow } from '../bot.types';
import { InlineKeyboardMarkup, Message } from 'telegraf/types';

export class BaseHandler {
    startMenu: Markup.Markup<InlineKeyboardMarkup>;
    endMenu: Markup.Markup<InlineKeyboardMarkup>;

    constructor(
        protected readonly stateManager: StateManager,
        protected readonly flow: BotFlow
    ) {
        this.startMenu = Markup.inlineKeyboard([
            [Markup.button.callback('⬅️ Назад', 'BACK')],
        ])
        this.endMenu = Markup.inlineKeyboard([
            [Markup.button.callback('⬅️ Назад', 'BACK')],
        ])
    }

    async init(ctx: Context) {
        await ctx.reply(
            this.flow.startMessage || '✨ Давай начнем!',
            this.startMenu
        );
    }

    async start(ctx: Context) {
        const userId = String(ctx.from!.id);

        await this.stateManager.set(userId, {
            flow: this.flow.name as FlowType,
            step: this.flow.steps[0].name,
            data: {},
            createdAt: Date.now(),
        });

        await ctx.reply(
            this.flow.steps[0].message
        );
    }

    async handleText(ctx: Context): Promise<Message.TextMessage | undefined> {
        const userId = String(ctx.from!.id);

        if (!ctx.message || !('text' in ctx.message)) {
            return;
        }

        const text = ctx.message.text;
        const state = await this.stateManager.get(userId);

        if (!state) return;

        for (let i = 0; i < this.flow.steps.length; i++) {
            const step = this.flow.steps[i];

            if (state.step === step.name) {
                const nextStep = this.flow.steps[i + 1];
                if (nextStep) {
                    await this.stateManager.set(userId, {
                        ...state,
                        step: nextStep.name,
                        data: {
                            ...state.data,
                            [step.name]: text,
                        },
                    });
                    return ctx.reply(nextStep.message);
                } else {
                    await this.finish(ctx, {
                        ...state.data,
                        [step.name]: text,
                    });
                    await this.stateManager.reset(userId);
                    return ctx.reply(
                        this.flow.finishMessage || '✨ Flow completed!',
                        this.endMenu
                    );
                }
            }
        }
    }

    async finish(ctx: Context, data?: Record<string, any>): Promise<void> {
        // can be overridden in child handlers for custom finish logic
    }
}