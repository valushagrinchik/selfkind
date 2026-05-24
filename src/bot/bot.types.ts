export type BotFlow = {
    name: string;
    startMessage: string;
    steps: {
        name: string;
        message: string;
    }[];
    finishMessage: string;
}