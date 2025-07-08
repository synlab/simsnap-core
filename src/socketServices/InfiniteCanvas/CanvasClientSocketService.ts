import { Socket } from "socket.io";
import ClientSocketService, { ClientSocketServiceEvents } from "../VirtualRoom/ClientSocketService";
import { InfiniteCanvas } from "../../entities/InfiniteCanvas/InfiniteCanvas";
import CanvasDevice from "../../entities/InfiniteCanvas/CanvasDevice";
import ViewBoxObject from "../../entities/InfiniteCanvas/ViewBoxObject";

/**
 * WebSocket service for using a InfiniteCanvas virtualRoom from the server side
 *
 * @param clientSocket - the socket of the client
 * @param virtualRoom - the object representation of the InfiniteCanvas virtual room
 * @param device - the device representative object attribuated to the client
 */
export class CanvasClientSocketService<Events extends ClientSocketServiceEvents = ClientSocketServiceEvents> extends ClientSocketService<Events> {
    constructor(
        clientSocket: Socket,
        override virtualRoom: InfiniteCanvas,
        override device: CanvasDevice = new CanvasDevice())
    {
        super(clientSocket, virtualRoom, device);
        this.device.addEventListener('sceneUpdate', (sceneObjects: ViewBoxObject[])=>{
            this.clientSocket.emit('updateScene', sceneObjects);
        });
    }
}

export default CanvasClientSocketService;