import { Injectable } from '@nestjs/common';
import { Context, Markup } from 'telegraf';

@Injectable()
export class TestsHandler {
    // Главное меню тестов
    async showMenu(ctx: Context) {
        await ctx.reply(
            '🧠 Тесты\n\nВыбери, что хочешь пройти:',
            Markup.inlineKeyboard([
                [Markup.button.callback('😰 Тревожность', 'TEST_ANXIETY')],
                [Markup.button.callback('🔥 Выгорание', 'TEST_BURNOUT')],
                [Markup.button.callback('🤍 Самооценка', 'TEST_SELF_ESTEEM')],
                [Markup.button.callback('⬅️ Назад', 'MAIN_MENU')],
            ]),
        );
    }

    // ===== ТЕСТ: ТРЕВОЖНОСТЬ =====
    async startAnxietyTest(ctx: Context) {
        await ctx.answerCbQuery();

        await ctx.reply(
            `😰 Тест тревожности

Вопрос 1/3:
Как часто ты чувствуешь внутреннее напряжение?`,
            Markup.inlineKeyboard([
                [Markup.button.callback('Редко', 'ANXIETY_Q1_LOW')],
                [Markup.button.callback('Иногда', 'ANXIETY_Q1_MED')],
                [Markup.button.callback('Часто', 'ANXIETY_Q1_HIGH')],
            ]),
        );
    }

    // ===== ТЕСТ: ВЫГОРАНИЕ =====
    async startBurnoutTest(ctx: Context) {
        await ctx.answerCbQuery();

        await ctx.reply(
            `🔥 Тест выгорания

Вопрос 1/3:
Есть ли у тебя ощущение усталости даже после отдыха?`,
            Markup.inlineKeyboard([
                [Markup.button.callback('Нет', 'BURNOUT_Q1_LOW')],
                [Markup.button.callback('Иногда', 'BURNOUT_Q1_MED')],
                [Markup.button.callback('Да', 'BURNOUT_Q1_HIGH')],
            ]),
        );
    }

    // ===== ТЕСТ: САМООЦЕНКА =====
    async startSelfEsteemTest(ctx: Context) {
        await ctx.answerCbQuery();

        await ctx.reply(
            `🤍 Самооценка

Вопрос 1/3:
Ты часто критикуешь себя за ошибки?`,
            Markup.inlineKeyboard([
                [Markup.button.callback('Редко', 'SELFESTEEM_Q1_LOW')],
                [Markup.button.callback('Иногда', 'SELFESTEEM_Q1_MED')],
                [Markup.button.callback('Часто', 'SELFESTEEM_Q1_HIGH')],
            ]),
        );
    }

    // ===== РЕЗУЛЬТАТЫ (заглушка) =====
    async showResult(ctx: Context, type: string) {
        await ctx.answerCbQuery();

        let message = '';

        switch (type) {
            case 'anxiety':
                message =
                    '😰 Похоже, у тебя есть признаки тревожности. Я могу помочь тебе с практиками снижения напряжения.';
                break;

            case 'burnout':
                message =
                    '🔥 Есть признаки выгорания. Похоже, ты долго был(а) в перегрузе.';
                break;

            case 'self_esteem':
                message =
                    '🤍 Есть склонность к самокритике. Мы можем поработать над более мягким внутренним диалогом.';
                break;
        }

        await ctx.reply(
            message,
            Markup.inlineKeyboard([
                [Markup.button.callback('↩️ К тестам', 'TESTS')],
                [Markup.button.callback('🏠 Главное меню', 'MAIN_MENU')],
            ]),
        );
    }
}