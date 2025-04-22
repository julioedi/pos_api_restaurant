import { clientsSockets, connections } from "./connections";
import { ioSocket } from "./socket";




ioSocket.on('connection', (socket) => {
    const { id } = socket;
    let canActions = false;
    socket.on("user:login", data => {
        if (typeof data?.userID != "number") {
            return;
        }
        const { userID } = data;
        connections[id] = userID;
        canActions = true;

        if (!(userID in clientsSockets)) {
            clientsSockets[userID] = [id];
        } else {
            clientsSockets[userID].push(id);
        }

    })


    socket.on('disconnect', () => {
        if (!canActions) {
            return;
        }
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});