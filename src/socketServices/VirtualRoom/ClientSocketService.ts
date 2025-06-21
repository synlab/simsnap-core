import { Socket } from "socket.io";
import { Device } from "../../entities/VirtualRoom/Device";
import { VirtualRoom } from "../../entities/VirtualRoom/VirtualRoom";
import { EventDispatcher } from "../../entities/VirtualRoom/EventDispatcher";

export type ClientSocketServiceEvents = {
  destroy: undefined;
};

/**
 * WebSocket service for using virtualRoom from the server side
 *
 * @param clientSocket - the socket of the client
 * @param virtualRoom - the object representation of the virtual room
 * @param device - the device representative object attribuated to the client
 */
export class ClientSocketService<Events extends ClientSocketServiceEvents = ClientSocketServiceEvents> {
    protected dispatcher = new EventDispatcher<Events>();

    constructor(
        public readonly clientSocket: Socket,
        public virtualRoom: VirtualRoom,
        public device: Device = new Device()
    ) {
        console.log('✅ New client connected')
        this.virtualRoom.emit('addDevice', this.device);
        
        clientSocket.on('clientSize', (data: {width: number, height: number}) => {
            this.handleClientSizeChange(data)
        })

        clientSocket.on('devicePress', (data: {x: number, y: number}) => {
            this.virtualRoom.emit('devicePress', {device: this.device, ...data});
        })
    
        clientSocket.on('deviceMove', (data: {x: number, y: number}) => {
            this.virtualRoom.emit('deviceMove', {device: this.device, ...data});
        })

        clientSocket.on('deviceRelease', (data: {x: number, y: number}) => {
            this.virtualRoom.emit('deviceRelease', {device: this.device, ...data});
        })

        clientSocket.on('deviceOrientationChange', (data: {alpha: number, beta: number, gamma: number}) => {
            this.virtualRoom.emit('deviceOrientationChange', {device: this.device, ...data})
        })
    
        clientSocket.on('disconnect', () => {
            this.virtualRoom.emit('removeDevice', this.device);
            this.emit('destroy', undefined);
            console.log('❌ Client disconnected')
        })

        this.linkListener();
    }

    /*== Dispatcher deleguate ==*/
    public addEventListener = this.dispatcher.addEventListener.bind(this.dispatcher);
    public removeEventListener = this.dispatcher.removeEventListener.bind(this.dispatcher);
    public emit = this.dispatcher.emit.bind(this.dispatcher);
    /*== ==================== ==*/

    /**
     * Link the different listener to the right ws emit message
     * @virtual
     */
    protected linkListener() { }
    
    /*============================================================================================*/
    /*                                          handlers                                          */
    /*============================================================================================*/

    /**
     * Change the size of the current device instance
     *
     * @param data - The WebSocketTransmited data
     */
    private handleClientSizeChange(data: {width: number, height: number}) {
        this.device.size = data;
    }
}

export default ClientSocketService;