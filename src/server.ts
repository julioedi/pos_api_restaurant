import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app'; // Importamos la configuración de la aplicación
import initTables from './config/setup/initTables';
import dotenv from 'dotenv';
import { checkDb, runQuery, baseData } from './config/db';
import { hashPassword } from './utils/auth';
import { RegisterUser } from './controllers/user.controller';
dotenv.config();
import { ioSocket,server } from './sockets/socket';


// Crear servidor HTTP a partir de la aplicación Express
// const server = http.createServer(app);

// Crear instancia de Socket.IO y asociarlo al servidor
// const io = new SocketIOServer(server, {
//   path: '/ws',
//   cors: {
//     origin: '*', // Ajusta esto según tu necesidad de seguridad
//     methods: ['GET', 'POST', "DELETE", "UPDATE"]
//   }
// });

// // Configurar WebSockets
// io.on('connection', (socket) => {
//   console.log('A user connected');

//   // Ejemplo de emitir un evento WebSocket
//   socket.emit('message', 'Welcome to the WebSocket server');

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });

// Puerto de ejecución
const port = process.env.PORT || 3000;
(async () => {
  //init the db direct from start
  await checkDb();

  //set de existing tables
  const tables: Record<string, string>[] = await runQuery("SELECT name FROM sqlite_master WHERE type='table';");
  baseData.existTables = tables.filter(item => item.name != "sqlite_sequence").map(item => item.name);

  await initTables();

  const isDev: boolean = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development');

  //delete this one on production 
  if (isDev) {
    const users = await runQuery("SELECT * from `users`");
    if (users.length == 0) {
      const user = await RegisterUser({
        slug: "julio",
        title: "Julio",
        password: "@Test123456",
        email: "info@julioedi.com",
        role: [0]
      })
    }
  }
  //
  server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
})();
