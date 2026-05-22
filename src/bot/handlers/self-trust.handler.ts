import { Injectable } from '@nestjs/common';
import { StateManager } from '../../state/state.manager';
import { Context, Markup } from 'telegraf';
import { TrustService } from '../../trust/trust.service';
import { CreateTrustMomentInput } from '../../trust/trust.types';
import { Message } from 'telegraf/types';
@Injectable()
export class SelfTrustHandler {

    constructor(
        private readonly stateManager: StateManager,
        private readonly trustService: TrustService
    ) { }

    async start(ctx: Context) {
        const userId = String(ctx.from!.id);

        await this.stateManager.set(userId, {
            flow: 'self_trust',
            step: 'situation',
            data: {},
            createdAt: Date.now(),
        });

        await ctx.reply(
            '🤍 Опиши коротко ситуацию, где ты осознанно выбрал(а) себя, например "Отказал(ся/ась) от встречи"',
        );
    }
    // обработка текстов
    async handleText(ctx: Context): Promise<Message.TextMessage | undefined> {
        const userId = String(ctx.from!.id);

        if (!ctx.message || !('text' in ctx.message)) {
            return;
        }

        const text = ctx.message.text;
        const state = await this.stateManager.get(userId);

        if (!state) return;

        // STEP 1
        if (state.step === 'situation') {
            await this.stateManager.set(userId, {
                ...state,
                step: 'signal',
                data: {
                    ...state.data,
                    situation: text,
                },
            });

            return ctx.reply(
                '🫂 С какими чувствами ты встретил(ся/ась)?',
            );
        }

        // STEP 2
        if (state.step === 'signal') {
            await this.stateManager.set(userId, {
                ...state,
                step: 'action',
                data: {
                    ...state.data,
                    selfSignal: text,
                },
            });

            return ctx.reply(
                '✨ Что ты выбрал(а) сделать?',
            );
        }

        // STEP 3
        if (state.step === 'action') {
            await this.stateManager.set(userId, {
                ...state,
                step: 'feelings',
                data: {
                    ...state.data,
                    chosenAction: text,
                },
            });

            return ctx.reply(
                '🌱 Что ты чувствуешь сейчас?',
            );
        }

        // FINAL STEP
        if (state.step === 'feelings') {
            const finalData = {
                ...state.data,
                feelingsAfter: text,
            };

            await this.trustService.createMoment({
                userId,
                ...finalData,

            } as CreateTrustMomentInput);

            await this.stateManager.reset(userId);

            return ctx.reply(
                `🤍 Ты зафиксировал(а) момент, где не проигнорировал(а) себя.\n\nЭто важно.`,
                Markup.inlineKeyboard([
                    [Markup.button.callback('⬅️ Назад', 'BACK')],
                ]),
            );
        }
    }
}