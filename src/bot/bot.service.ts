import { Injectable, OnModuleInit } from '@nestjs/common';
import { Telegraf, Markup } from 'telegraf';
import { TestsHandler } from './handlers/tests.handler';
import { SelfTrustHandler } from './handlers/self-trust.handler';
import { StateManager } from '../state/state.manager';
@Injectable()
export class BotService implements OnModuleInit {
    private bot: Telegraf;
    mainMenu: Markup.Markup<import("telegraf/types").InlineKeyboardMarkup>;

    constructor(
        private readonly testsHandler: TestsHandler,
        private readonly selfTrustHandler: SelfTrustHandler,
        private readonly stateManager: StateManager
    ) {
        this.bot = new Telegraf(process.env.BOT_TOKEN!);
        this.mainMenu = Markup.inlineKeyboard([
            [Markup.button.callback('🤍 Доверие себе', 'SELF_TRUST')],
        ])
    }


    async onModuleInit() {
        console.log('Starting Telegram bot...');
        // START MENU
        this.bot.start(async (ctx) => {
            await ctx.reply(
                'Привет! Я — бот для поддержки твоего психического здоровья. Выбери раздел, который тебя интересует:',
                this.mainMenu
            );
        });

        this.bot.action('SELF_TRUST', async (ctx) => {
            await this.selfTrustHandler.start(ctx);
        });

        this.bot.on('text', async (ctx) => {
            const userId = String(ctx.from.id);
            const state = await this.stateManager.get(userId);
            if (!state) return;
            if (state.flow === 'self_trust') {
                return this.selfTrustHandler.handleText(ctx);
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