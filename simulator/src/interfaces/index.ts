export interface IPosition {
    x: number;
    y: number;
}

interface IScore {
    team1: number;
    team2: number;
}

export enum ESide {
    Left = "l",
    Right = "r",
}

export interface IData {
    ball: IPosition;
    state: string;
    score?: IScore;
    players?: IPlayer[];
}

// Define the IPlayer interface
export interface IPlayer {
    position: IPosition;
    side: ESide
    number: number;
    isGoalkeeper: boolean;
    stamina: number;
    actions?: (EActions.KICK | EActions.TACKLE)[];
}

export enum EActions {
    KICK = 'kick',
    TACKLE = 'tackle',
}

// Define the IBallProps interface for the Ball component's props
export interface IBallProps {
    scaleX: (x: number) => number;
    scaleY: (y: number) => number;
    data: IData;
    ballRadius: number;
    info?: boolean;
}

// Define the IPlayerProps interface for the Player component's props
export interface IPlayerProps {
    player?: IPlayer;
    scaleX: (x: number) => number;
    scaleY: (y: number) => number;
    playerRadius: number;
    info?: boolean;
    data?: IData;
}

// Define the IScoreProps interface for the Score component's props
export interface IScoreProps {
    viewBoxWidth: number;
    viewBoxHeight: number;
    data: IData;
}

// Define the ISoccerFieldProps interface for the SoccerField component's props
export interface ISoccerFieldProps {
    data: IData;
    info?: boolean;
}
