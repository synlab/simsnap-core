import { Socket } from "socket.io";
import ClientSocketService from "../VirtualRoom/ClientSocketService";
import Scene3D from "../../entities/Scene3D/Scene3D";
import User from "../../entities/VirtualRoom/User";

export class Scene3DClientSocketService extends ClientSocketService {
    private timeInterval: NodeJS.Timeout | undefined;

    constructor(clientSocket: Socket, override readonly virtualRoom: Scene3D, user?: User)
    {
        super(clientSocket, virtualRoom, user);
    
        this.timeInterval = setInterval(() => {
            this.clientSocket.emit('updateScene', virtualRoom.updateSceneObjects());
        }, 50)
    }

    override disconnected() {
        clearInterval(this.timeInterval);
    }
}

export default Scene3DClientSocketService;