import { Socket } from "socket.io";
import { Device } from "../../entities/VirtualRoom/Device";
import { VirtualRoom } from "../../entities/VirtualRoom/VirtualRoom";

export class ClientSocketService {

    constructor(public readonly clientSocket: Socket, public readonly virtualRoom: VirtualRoom, public readonly device: Device = new Device()) {
        console.log('✅ New client connected')

        virtualRoom.handleAddDevice(device);
        
        clientSocket.on('clientSize', (data: {width: number, height: number}) => {
            this.device.size = data;
        })

        clientSocket.on('devicePress', (data: {x: number, y: number}) => {
            this.virtualRoom.handleDevicePress({device : this.device, x: data.x, y: data.y});
        })
    
        clientSocket.on('deviceMove', (data: {x: number, y: number}) => {
            this.virtualRoom.handleDeviceMove({device : this.device, x: data.x, y: data.y});
        })

        clientSocket.on('deviceRelease', (data: {x: number, y: number}) => {
            this.virtualRoom.handleDeviceRelease({device : this.device, x: data.x, y: data.y});
        })

        clientSocket.on('deviceOrientationChange', (data: {alpha: number, beta: number, gamma: number}) => {
            this.virtualRoom.handleDeviceOrientationChange({device : this.device, alpha: data.alpha, beta: data.beta, gamma: data.gamma});
        })
    
        clientSocket.on('disconnect', () => {
            this.virtualRoom.handleRemoveDevice(this.device);
            this.disconnected();
            this.onDisconnect?.();
            console.log('❌ Client disconnected')
        })
    }

    /* for overriding */
    disconnected() {}

    /*== event listenner ==*/

    onDisconnect?: () => void;

    /*== =============== ==*/
}

export default ClientSocketService;