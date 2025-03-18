import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

export const setIO = (ioInstance: SocketIOServer) => {
  io = ioInstance;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.IO instance not initialized.');
  }
  return io;
};
