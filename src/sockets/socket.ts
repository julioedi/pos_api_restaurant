import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from '../app';
import { clientsSockets, connections } from './connections';



// Crear servidor HTTP a partir de la aplicación Express
const server = http.createServer(app);

const ioSocket = new SocketIOServer(server, {
  path: '/ws',
  cors: {
    origin: '*', // Ajusta esto según tu necesidad de seguridad
    methods: ['GET', 'POST', "DELETE", "UPDATE"]
  }
});




ioSocket.on('connection', (socket) => {
  const { id } = socket;
  let canActions = false;
  let AuthID: number | undefined;
  socket.on("user:login", data => {
    if (typeof data?.userID != "number" || !id) {
      return;
    }
    const { userID } = data;
    AuthID = userID;
    if (!(id in connections)) {
      connections[id] = userID;
    }
    canActions = true;

    if (!(userID in clientsSockets)) {
      clientsSockets[userID] = [id];
    } else {
      clientsSockets[userID].push(id);
    }
  })


  socket.on('disconnect', () => {
    //check if actions did setted
    if (!canActions || !AuthID || !id) {
      return;
    }

    //check if socket id is active if exists, will delete it
    if (connections[id]) {
      delete connections[id];
    }

    //
    if (AuthID in clientsSockets) {
      clientsSockets[AuthID] = clientsSockets[AuthID].filter(item => item != id);
    }

  });
});

export { ioSocket, server }