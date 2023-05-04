export interface IData {
    [key: string]: unknown;
}

export interface IRoomState {
    paused: boolean;
    pendingData: unknown[];
}