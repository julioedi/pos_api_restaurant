import { clientsSockets, connections } from "./connections";
import { ioSocket } from "./socket";

const emitToUser = (userID: number, event: string, data: any) => {
    const socketIds = clientsSockets[userID];
    if (!socketIds) return;
    socketIds.forEach(socketId => {
        const socket = ioSocket.sockets.sockets.get(socketId);
        if (socket) {
            socket.emit(event, data);
        }
    });
}

export { emitToUser };