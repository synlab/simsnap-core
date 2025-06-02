import { Socket } from "socket.io";
import ClientSocketService from "../VirtualRoom/ClientSocketService";
import Scene3D from "../../entities/Scene3D/Scene3D";
import Device from "../../entities/VirtualRoom/Device";

/**
 * WebSocket Singleton service for using Scene3D virtualRoom from the client side
 *
 * @remarks
 * need to be initialize with {@link ServerSocketService.InitConnection}
 */
export class Scene3DClientSocketService extends ClientSocketService {
    private timeInterval: NodeJS.Timeout | undefined;

    constructor(clientSocket: Socket, override readonly virtualRoom: Scene3D, device?: Device)
    {
        super(clientSocket, virtualRoom, device);
    
        this.timeInterval = setInterval(() => {
            this.handleUpdateScene();
        }, 50)
    }
    

    /*============================================================================================*/
    /*                                          handlers                                          */
    /*============================================================================================*/


    /**
     * Hanlde a update of the scene
     * @virtual
     */
    handleUpdateScene() {
        this.clientSocket.emit('updateScene', this.virtualRoom.updateSceneObjects());
    }

    /**
     * Hanlde a disconection by remove device from the room
     * @override
     * 
     * @see {@link ClientSocketService.handleDisconnect}
     */
    override handleDisconnect() {
        clearInterval(this.timeInterval);
        super.handleDisconnect();
    }
}

export default Scene3DClientSocketService;