import { Server, Socket } from 'socket.io';
import RoomSocketService from './RoomSocketService';

export class ServerMultiRoom<Room extends RoomSocketService = RoomSocketService>{
    rooms: Record<string, Room> = {};

    constructor(ioServer: Server, protected roomFactory: (roomCode: string) => Room, protected roomCode: (socket: Socket) => string){
        ioServer.on('connection', this.addNewClient.bind(this));
    };

    addNewClient(clientSocket: Socket){
        const roomCode = this.roomCode(clientSocket);
        if (!this.rooms[roomCode]) {
            this.newRoom(roomCode, clientSocket)
        } else {
            this.rooms[roomCode].addNewClient(clientSocket)
        }
    }

    newRoom(roomCode: string, ...clientSockets: Socket[]): Room {
        if (this.rooms[roomCode]) {
            this.rooms[roomCode].emit("destroy", undefined);
        }

        const room = this.roomFactory(roomCode);
        room.addEventListener("destroy", ()=>{
            delete this.rooms[roomCode];
        });
        clientSockets.forEach(socket=>room.addNewClient(socket))
        return this.rooms[roomCode] = room;
    }
}