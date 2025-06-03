import { Socket } from "socket.io";
import { Device } from "../../entities/VirtualRoom/Device";
import { VirtualRoom } from "../../entities/VirtualRoom/VirtualRoom";

/**
 * WebSocket service for using virtualRoom from the server side
 *
 * @param clientSocket - the socket of the client
 * @param virtualRoom - the object representation of the virtual room
 * @param device - the device representative object attribuated to the client
 */
export class ClientSocketService {

    constructor(
        public readonly clientSocket: Socket,
        public virtualRoom: VirtualRoom,
        public device: Device = new Device()
    ) {
        console.log('✅ New client connected')

        this.handleAddDevice(this.device);
        
        clientSocket.on('clientSize', (data: {width: number, height: number}) => {
            this.handleClientSizeChange(data)
        })

        clientSocket.on('devicePress', (data: {x: number, y: number}) => {
            this.handleDevicePress(data);
        })
    
        clientSocket.on('deviceMove', (data: {x: number, y: number}) => {
            this.handleDeviceMove(data);
        })

        clientSocket.on('deviceRelease', (data: {x: number, y: number}) => {
            this.handleDeviceRelease(data);
        })

        clientSocket.on('deviceOrientationChange', (data: {alpha: number, beta: number, gamma: number}) => {
            this.handleDeviceOrientationChange(data)
        })
    
        clientSocket.on('disconnect', () => {
            this.handleDisconnect();
        })
    }

    
    /*============================================================================================*/
    /*                                          handlers                                          */
    /*============================================================================================*/

    /**
     * Change the size of the current device instance
     * @virtual
     *
     * @param data - The WebSocketTransmited data
     */
    handleClientSizeChange(data: {width: number, height: number}) {
        this.device.size = data;
    }

    /**
     * Add a new device in the room, and trigger the {@link VirtualRoom.onAddDevice} event
     * @virtual
     * 
     * @param device - The Device to add
     */
    handleAddDevice(device: Device) {
        this.virtualRoom.handleAddDevice(device);
    }

    /**
     * Hanlde a disconection by remove device from the room, and trigger the {@link ClientSocketService.onDisconnect} and {@link VirtualRoom.onRemoveDevice} event
     * @virtual
     */
    handleDisconnect() {
        this.virtualRoom.handleRemoveDevice(this.device);
        this.onDisconnect?.();
        console.log('❌ Client disconnected')
    }

    /**
     * Handle a press pointer by a device, and trigger the {@link VirtualRoom.onDevicePress} event
     * @virtual
     *
     * @param data - The WebSocketTransmited data
     */
    handleDevicePress(data: {x: number, y: number}) {
        this.virtualRoom.handleDevicePress({device : this.device, x: data.x, y: data.y});
    }

    /**
     * Handle a move pointer by a device, and trigger the {@link VirtualRoom.onDeviceMove} event
     * @virtual
     *
     * @param data - The WebSocketTransmited data
     */
    handleDeviceMove(data: {x: number, y: number}) {
        this.virtualRoom.handleDeviceMove({device : this.device, x: data.x, y: data.y})
    }

    /**
     * Handle a release pointer by a device, and trigger the {@link VirtualRoom.onDeviceRelease} event
     * @virtual
     *
     * @param data - The WebSocketTransmited data
     */
    handleDeviceRelease(data: {x: number, y: number}) {
        this.virtualRoom.handleDeviceRelease({device : this.device, x: data.x, y: data.y});
    }

    /**
     * Handle a change of the device orientation, and trigger the {@link VirtualRoom.onDeviceOrientationChange} event
     * @virtual
     *
     * @param data - The WebSocketTransmited data
     */
    handleDeviceOrientationChange(data: {alpha: number, beta: number, gamma: number}) {
        this.virtualRoom.handleDeviceOrientationChange({device : this.device, alpha: data.alpha, beta: data.beta, gamma: data.gamma});
    }


    /*=============================================================================================*/
    /*                                      event listenner                                        */
    /*=============================================================================================*/

    /**
     * CallBack triggered when a Client is disconnected
     * @eventProperty
     */
    onDisconnect?: () => void;
}

export default ClientSocketService;