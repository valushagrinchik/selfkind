export type FlowType =
    | 'idle'
    | 'self_trust'
    | 'self_criticism'
    | 'anxiety_test'
    | 'bass_durkee_test';

export interface UserState {
    flow: FlowType;
    step: string;
    data: Record<string, any>;
    createdAt: number;
}