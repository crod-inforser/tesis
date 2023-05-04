import { Server as SocketIOServer } from 'socket.io';
import logger from 'jet-logger';
import { Server } from 'http';

export function initializeSocket(server: Server) {
  const io = new SocketIOServer(
    server, { cors: { origin: '*', methods: '*' } });

  io.on('connection', (socket) => {
    logger.info('User connected to sockets');
    // Escuchar evento 'joinRoom'
    socket.on('joinRoom', (room: string) => {
      logger.info(`User joined to socket room ${room}`);
      socket.join(room);
    });

    // Escuchar evento 'disconnect'
    socket.on('disconnect', () => {
      logger.info('User disconnected');
    });
  });

  return io;
}

export default { initializeSocket } as const;