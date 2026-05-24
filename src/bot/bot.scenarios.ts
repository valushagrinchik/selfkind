export const ScenarioType = {
    thankfulness: 'thankfulness',
    selfTrust: 'self_trust',
}

export const ScenarioButtons = {
    thankfulness: 'THANKFULNESS',
    thankfulnessStart: 'THANKFULNESS_START',
    thankfulnessTimeline: 'THANKFULNESS_TIMELINE',
    selfTrust: 'SELF_TRUST',
    selfTrustStart: 'SELF_TRUST_START',
    selfTrustTimeline: 'SELF_TRUST_TIMELINE',
}

export const selfTrustFlow = {
    name: ScenarioType.selfTrust,
    startMessage: '',
    steps: [
        {
            name: 'situation',
            message: '🤍 Впереди тебя ждет серия вопросов чтобы зафиксировать момент, где ты выбрал себя, услышал себя или не предал свои ощущения. \n 🖊 Коротко опиши ситуацию.',
        },
        {
            name: 'selfSignal',
            message: '🫂 Как ты понял(а), что хочешь поступить именно так? С какими чувствами ты встретил/ся(ась)?',
        },
        {
            name: 'chosenAction',
            message: '✨ Что ты выбрал(а) сделать?',
        },
        {
            name: 'feelingsAfter',
            message: '🌱 Что ты почувствовал(а) после?',
        },
        {
            name: 'difficulty',
            message: '⚡️ Насколько было сложно поступить так, а не по-другому? Оцени от 1 до 10, где 1 — совсем не сложно, а 10 — очень сложно.',
        }
    ],
    finishMessage: '🤍 Ты зафиксировал(а) момент, где не проигнорировал(а) себя.\n\nЭто важно.',
}

export const thankfulnessFlow = {
    name: ScenarioType.thankfulness,
    startMessage: '',
    steps: [
        {
            name: 'situation',
            message: '✨ Благодарность - чувство, которое рождается в тишине. Остановись на мгновение и вспомни что-то приятное за день. \n 🖊 Коротко опиши ситуацию.',
        },
        {
            name: 'person',
            message: '🫂 Кому или чему направлено твое чувство?',
        },
        {
            name: 'action',
            message: '✨ Что ты сделал(а)?',
        },
        {
            name: 'feelings',
            message: '🌱 Опиши свои теплые чувства',
        },
    ],
    finishMessage: '🤍 Спасибо что поделил/ся(ась) .\n\nЭто ценно.',
}