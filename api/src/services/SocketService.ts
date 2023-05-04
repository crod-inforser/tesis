import { gzipSync } from 'zlib';
import { io } from '@src/server';
import { IRoomState } from '@interfaces/services/socketService';

const roomStates: Map<string, IRoomState> = new Map();

// Enviar datos a través de un socket
export function sendToIO(room: string, data: object): void {
  const currentState = roomStates.get(room);
  if (!currentState || !currentState.paused) {
    const jsonData = JSON.stringify(data);
    const bufferData = Buffer.from(jsonData, 'utf8');
    io.to(room).emit('data', gzipSync(bufferData));
  } else {
    currentState.pendingData.push(data);
  }
}

export function handlePause(room: string): void {
  const currentState = roomStates.get(room);
  if (currentState) {
    currentState.paused = true;
  } else {
    roomStates.set(room, { paused: true, pendingData: [] });
  }
}

export function handleResume(room: string): void {
  const currentState = roomStates.get(room);
  if (currentState) {
    currentState.paused = false;
    /* eslint-disable-next-line */
    currentState.pendingData.forEach((data: any) => {
      /* eslint-disable-next-line */
      sendToIO(room, data);
    });
    currentState.pendingData = [];
  } else {
    roomStates.set(room, { paused: false, pendingData: [] });
  }
}

export default {
  sendToIO,
  handlePause,
  handleResume,
};
