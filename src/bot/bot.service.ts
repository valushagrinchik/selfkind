import { Injectable, OnModuleInit } from '@nestjs/common';
import { Telegraf, Markup, } from 'telegraf';
import { InlineKeyboardMarkup } from 'telegraf/types';
import { SelfTrustHandler } from './handlers/self-trust.handler';
import { StateManager } from '../state/state.manager';
import { ThankfulnessHandler } from './handlers/thankfulness.handler';
import { ScenarioButtons, ScenarioType } from './bot.scenarios';
@Injectable()
export class BotService {
    private bot: Telegraf;
    mainMenu: Markup.Markup<InlineKeyboardMarkup>;

    constructor(
        private readonly selfTrustHandler: SelfTrustHandler,
        private readonly thankfulnessHandler: ThankfulnessHandler,
        private readonly stateManager: StateManager
    ) {
        this.bot = new Telegraf(process.env.BOT_TOKEN!);
        this.mainMenu = Markup.inlineKeyboard([
            [Markup.button.callback('🤍 Контакт с собой', ScenarioButtons.selfTrust)],
            [Markup.button.callback('🤍 Благодарность', ScenarioButtons.thankfulness)],
        ])
    }

    async launch() {
        console.log('Starting Telegram bot...');
        // START MENU
        this.bot.start(async (ctx) => {
            await ctx.reply(
                'Привет! Я — Помощник твоего здорового внутреннего диалога. Выбери раздел, который тебя интересует:',
                this.mainMenu
            );
        });

        this.bot.action(ScenarioButtons.selfTrust, async (ctx) => {
            await this.selfTrustHandler.init(ctx);
        });

        this.bot.action(ScenarioButtons.selfTrustStart, async (ctx) => {
            await this.selfTrustHandler.start(ctx);
        });

        this.bot.action(ScenarioButtons.selfTrustTimeline, async (ctx) => {
            await this.selfTrustHandler.timeline(ctx);
        });

        this.bot.action(ScenarioButtons.thankfulness, async (ctx) => {
            await this.thankfulnessHandler.init(ctx);
        });
        this.bot.action(ScenarioButtons.thankfulnessStart, async (ctx) => {
            await this.thankfulnessHandler.start(ctx);
        });

        this.bot.action(ScenarioButtons.thankfulnessTimeline, async (ctx) => {
            await this.thankfulnessHandler.timeline(ctx);
        });

        this.bot.on('text', async (ctx) => {
            const userId = String(ctx.from.id);
            const state = await this.stateManager.get(userId);
            if (!state) return;

            if (state.flow === ScenarioType.selfTrust) {
                return this.selfTrustHandler.handleText(ctx);
            }
            if (state.flow === ScenarioType.thankfulness) {
                return this.thankfulnessHandler.handleText(ctx);
            }
        });

        // BACK
        this.bot.action('BACK', async (ctx) => {
            await ctx.answerCbQuery();

            await ctx.reply(
                '🤍 Главное меню:',
                this.mainMenu
            );
        });

        await this.bot.launch(() => {
            console.log('Telegram bot started');
        });
    }
}