import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import { setIO } from './socket'; // Adjust the path as needed

async function main() {
  try {
    await connectDatabase();

    // 1) Create an HTTP server from your Express app
    const server = http.createServer(app);

    // 2) Attach Socket.IO to that server
    const io = new SocketIOServer(server, {
      cors: { origin: '*' },
    });

    // 3) Listen for connections
    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      socket.on('joinRoom', (room: string) => {
        socket.join(room);
        console.log(`Socket ${socket.id} joined room ${room}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    // 4) Save the io instance for use in other modules
    setIO(io);

    // 5) Start the server
    server.listen(config.port, () => {
      console.log(`Server is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

const connectDatabase = async () => {
  const MONGO_URI = config.database_url as string;
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connection established successfully.');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

main();
