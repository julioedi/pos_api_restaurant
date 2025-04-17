import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import userRoutes from './routes/user.routes';
import dynamicRoutes from './routes/dynamic.routes';

const app = express();
const server = http.createServer(app); // Crear el servidor HTTP
const io = new socketIo.Server(server, {
  cors: {
    origin: "*", // Permite conexiones de cualquier origen, ajusta según tus necesidades
    methods: ["GET", "POST"]
  }
});

app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);
app.use('/api', dynamicRoutes);

// WebSocket: Enviar un mensaje a todos los clientes conectados cuando haya una inserción
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Ejemplo de emitir un mensaje cuando se recibe un evento
  socket.on('new-record', (message: string) => {
    io.emit('new-record', message); // Enviar a todos los clientes conectados
    console.log('Mensaje recibido y emitido a todos los clientes:', message);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Iniciar el servidor en el puerto 3000
server.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
