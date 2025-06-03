import { Socket } from "socket.io";
import ClientSocketService from "../VirtualRoom/ClientSocketService";
import { InfiniteCanvas } from "../../entities/InfiniteCanvas/InfiniteCanvas";
import CanvasDevice from "../../entities/InfiniteCanvas/CanvasDevice";
import { DeviceInteractionPointerEventOnCanvas } from "../../entities/InfiniteCanvas/types";

/**
 * WebSocket service for using a InfiniteCanvas virtualRoom from the server side
 *
 * @param clientSocket - the socket of the client
 * @param virtualRoom - the object representation of the InfiniteCanvas virtual room
 * @param device - the device representative object attribuated to the client
 */
export class CanvasClientSocketService extends ClientSocketService {
    private timeInterval: NodeJS.Timeout | undefined;

    constructor(
        clientSocket: Socket,
        override virtualRoom: InfiniteCanvas,
        override device: CanvasDevice = new CanvasDevice())
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
        if (this.device) {
            this.clientSocket.emit('updateScene', this.virtualRoom.updateSceneObjects(this.device));
        }
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

    /**
     * Handle a press pointer by a device, and trigger the {@link VirtualRoom.onDevicePress} event
     * @override
     *
     * @param data - The WebSocketTransmited data
     * 
     * @see {@link ClientSocketService.handleDevicePress}
     */
    override handleDevicePress(data: {x: number, y: number}) {
        this.virtualRoom.handleDevicePress(new DeviceInteractionPointerEventOnCanvas(this.device, data.x, data.y));
    }

    /**
     * Handle a move pointer by a device, and trigger the {@link VirtualRoom.onDeviceMove} event
     * @override
     *
     * @see {@link ClientSocketService.handleDeviceMove}
     */
    override handleDeviceMove(data: {x: number, y: number}) {
        this.virtualRoom.handleDeviceMove(new DeviceInteractionPointerEventOnCanvas(this.device, data.x, data.y))
    }

    /**
     * Handle a release pointer by a device, and trigger the {@link VirtualRoom.onDeviceRelease} event
     * @override
     *
     * @param data - The WebSocketTransmited data
     * 
     * @see {@link ClientSocketService.handleDeviceRelease}
     */
    override handleDeviceRelease(data: {x: number, y: number}) {
        this.virtualRoom.handleDeviceRelease(new DeviceInteractionPointerEventOnCanvas(this.device, data.x, data.y));
    }
}

export default CanvasClientSocketService;