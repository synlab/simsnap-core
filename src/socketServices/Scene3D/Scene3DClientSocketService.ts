import { Socket } from "socket.io";
import ClientSocketService from "../VirtualRoom/ClientSocketService";
import Scene3D from "../../entities/Scene3D/Scene3D";
import Device from "../../entities/VirtualRoom/Device";

export class Scene3DClientSocketService extends ClientSocketService {
    private timeInterval: NodeJS.Timeout | undefined;

    constructor(clientSocket: Socket, override readonly virtualRoom: Scene3D, device?: Device)
    {
        super(clientSocket, virtualRoom, device);
    
        this.timeInterval = setInterval(() => {
            this.clientSocket.emit('updateScene', virtualRoom.updateSceneObjects());
        }, 50)
    }

    override disconnected() {
        clearInterval(this.timeInterval);
    }
}

export default Scene3DClientSocketService;