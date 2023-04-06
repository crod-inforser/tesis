export interface IData {
    [key: string]: any;
}

export interface IRoomState {
    paused: boolean;
    pendingData: any[];
}
