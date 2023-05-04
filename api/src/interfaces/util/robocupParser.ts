export interface BallI {
    x: number;
    y: number;
    vx: number;
    vy: number;
}

export interface InitI {
    [key: string]: number;
}

export enum SideE {
    Left = 'l',
    Right = 'r',
}

export interface PositionI {
    x: number;
    y: number;
    vx: number;
    vy: number;
    bodyAngle: number;
    neckAngle: number;
}

export interface PlayerI {
    side: SideE;
    number: number;
    isGoalkeeper: boolean;
    position: PositionI;
    stamina: number | null;
    actions: string[];
}

export interface InfoI {
    state: string;
    time: number;
    score: {
        team1: number;
        team2: number;
    };
    ball: BallI;
    players: PlayerI[];
}

export interface ResultI {
    team1: string;
    team2: string;
    score1: number;
    score2: number;
}
