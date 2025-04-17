import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

export const setupWebSocket = (server: HttpServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    socket.on('chat:message', (msg) => {
      console.log('Mensaje recibido:', msg);
      io.emit('chat:message', msg);
    });

    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });
};
