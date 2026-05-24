export type FlowType =
    | 'self_trust'
    | 'thankfulness';


export interface UserState {
    flow: FlowType;
    step: string;
    data: Record<string, any>;
    createdAt: number;
}