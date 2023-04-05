import { createReadStream } from "fs";
import { createInterface } from "readline";
import { gzipSync } from 'zlib';

import { tick } from './misc'
import { io } from "@src/server";
import { BallI, InfoI, InitI, PlayerI, PositionI, ResultI, SideE } from '@src/interfaces/util/robocupParser'

// Envia datos a una sala específica a través de un socket IO
function sendToIO(room: string, data: any): void {
    const jsonData = JSON.stringify(data);
    const bufferData = Buffer.from(jsonData, 'utf8');
    io.to(room).emit('data', gzipSync(bufferData));
}

// Funciones de análisis
// Aquí hay muchas funciones de análisis como parseInfoLine, parsePlayerLine, etc.
// Estas funciones toman una línea de entrada y devuelven un objeto con los datos extraídos.
// Por ejemplo, parseInfoLine toma una línea que comienza con "(Info" y devuelve un objeto Info.
// Estas funciones utilizan expresiones regulares para extraer datos de las líneas de entrada.


function parseSide(side: string): SideE {
    if (side === "l") {
        return SideE.Left;
    } else if (side === "r") {
        return SideE.Right;
    } else {
        throw new Error(`Invalid side ${side}`);
    }
}

function parsePositionLine(line: string): PositionI {
    const positionMatches = line.match(/\(position ([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)\)/);
    if (!positionMatches) {
        throw new Error(`Invalid position line format: ${line}`);
    }
    return {
        x: parseFloat(positionMatches[1]),
        y: parseFloat(positionMatches[2]),
        vx: parseFloat(positionMatches[3]),
        vy: parseFloat(positionMatches[4]),
        bodyAngle: parseFloat(positionMatches[5]),
        neckAngle: parseFloat(positionMatches[6]),
    };
}

function parseInfoLine(line: string): InfoI {
    const infoMatches = line.match(/\(state (\d+) ([^ ]+) (\d+) (\d+)\)/);
    const time = parseInt(infoMatches[1]);
    const state = infoMatches[2];
    const scoreTeam1 = parseInt(infoMatches[3]);
    const scoreTeam2 = parseInt(infoMatches[4]);
    const ballMatches = line.match(/\(ball ([^)]+)\)/);
    const ball = parseBallLine(ballMatches[0]);
    const playerMatches = line.match(/\(player[^()]*\((?:[^()]+(?:\([^()]*\)[^()]*)*)\)\s*(?:\([^()]*\)\s*)*\)/g);
    const players = playerMatches.map((playerLine) => parsePlayerLine(playerLine));
    return {
        state,
        time,
        score: {
            team1: scoreTeam1,
            team2: scoreTeam2
        },
        ball,
        players,
    };
}

function parsePlayerLine(line: string): PlayerI | null {
    const sideRegex = /\(player\s+([lr])\s+/;
    const numberRegex = /([0-9]+)\s+/;
    const goalkeeperRegex = /g\s+/;
    const positionRegex = /\(position\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\)/;
    const staminaRegex = /\(stamina\s+(\d+(?:\.\d+)?)\)/;
    const actionsRegex = /\(([a-z_]+)\)/g;
    const sideMatches = line.match(sideRegex);
    const numberMatches = line.match(numberRegex);
    const goalkeeperMatches = line.match(goalkeeperRegex);
    const positionMatches = line.match(positionRegex);
    const staminaMatches = line.match(staminaRegex);
    const actionsMatches = [...line.matchAll(actionsRegex)];
    if (!sideMatches || !numberMatches || !positionMatches) return null;
    const side = parseSide(sideMatches[1]);
    const number = parseInt(numberMatches[0], 10);
    const isGoalkeeper = goalkeeperMatches !== null;
    const position = parsePositionLine(positionMatches[0]);
    const stamina = staminaMatches !== null ? parseFloat(staminaMatches[1]) : null;
    const actions = actionsMatches.map((actionsMatch) => actionsMatch[1]);
    return {
        side,
        number,
        isGoalkeeper,
        position,
        stamina,
        actions,
    };
}


function parseInitLine(line: string): InitI {
    const regex = /\(Init(.+)\)/;
    const matches = line.match(regex);
    if (!matches) throw new Error("Invalid Init line format");
    const properties = matches[1].trim().split(")(");
    const init: InitI = {};
    properties.forEach((property) => {
        const [key, value] = property.split(" ");
        init[key] = parseFloat(value);
    });
    return init;
}

function parseBallLine(line: string): BallI {
    const ballMatches = line.match(/\(ball ([^)]+)\)/);
    const ballData = ballMatches[1].split(" ");
    const x = parseFloat(ballData[0]);
    const y = parseFloat(ballData[1]);
    const vx = parseFloat(ballData[2]);
    const vy = parseFloat(ballData[3]);
    return {
        x,
        y,
        vx,
        vy,
    };
}

function parseResultLine(line: string): ResultI {
    const resultMatches = line.match(/\(Result "([^"]+)" "([^"]+)" (\d+) (\d+)\)/);
    const team1 = resultMatches[1];
    const team2 = resultMatches[2];
    const score1 = parseInt(resultMatches[3]);
    const score2 = parseInt(resultMatches[4]);
    return {
        team1,
        team2,
        score1,
        score2,
    };
}

// Función principal para generar y enviar datos JSON
// a través de un socket IO
export async function generateAndSendJSON({ path, room }: { path: string, room: string }): Promise<void> {
    try {
        const rl = createInterface({
            input: createReadStream(path),
            crlfDelay: Infinity
        });

        for await (const line of rl) {
            if (line.startsWith("(Init")) {
                const init: InitI | null = parseInitLine(line);
                if (!init) throw new Error("No se encontró la línea 'Init' en el archivo");
                sendToIO(room, init);
            } else if (line.startsWith("(Info")) {
                const info: InfoI = parseInfoLine(line)
                sendToIO(room, info);
            } else if (line.startsWith("(Result")) {
                const result: ResultI | null = parseResultLine(line);
                if (!result) throw new Error("No se encontró la línea 'Result' en el archivo");
                sendToIO(room, result);
            }
            await tick(100);
        }
    } catch (e) {
        console.error("Error al obtener el JSON", e);
    }
}