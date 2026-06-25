import { Socket } from 'socket.io';
import { Device } from '../../entities/VirtualRoom/Device';
import { VirtualRoom } from '../../entities/VirtualRoom/VirtualRoom';
import { EventDispatcher } from '../../entities/Utils';

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
    private dispatcher = new EventDispatcher<Events>();

    constructor(
        public readonly clientSocket: Socket,
        public virtualRoom: VirtualRoom,
        public device: Device = new Device(),
    ) {
        console.log('✅ New client connected');
        this.virtualRoom.emit('addDevice', this.device);
        
        clientSocket.on('clientSize', (data: {width: number, height: number}) => {
            this.device.emit('sizeChanged', data);
        });

        clientSocket.on('devicePress', (data: {x: number, y: number}) => {
            this.virtualRoom.emit('devicePress', { device: this.device, ...data });
        });
    
        clientSocket.on('deviceMove', (data: {x: number, y: number}) => {
            this.virtualRoom.emit('deviceMove', { device: this.device, ...data });
        });

        clientSocket.on('deviceRelease', (data: {x: number, y: number}) => {
            this.virtualRoom.emit('deviceRelease', { device: this.device, ...data });
        });

        clientSocket.on('deviceOrientationChange', (data: {alpha: number, beta: number, gamma: number}) => {
            this.virtualRoom.emit('deviceOrientationChange', { device: this.device, ...data });
        });

        clientSocket.on('deviceAcceleration', (data: {x: number, y: number, z: number, timestamp: number}) => {
            this.virtualRoom.emit('deviceAcceleration', { device: this.device, ...data });
        });

        // Tilt-related socket listeners
        clientSocket.on('getCombinedTilt', (method: 'average' | 'max' | 'min') => {
            if (this.virtualRoom.tiltManager) {
                const combinedTilt = this.virtualRoom.tiltManager.calculateCombinedTilt(method);
                clientSocket.emit('combinedTilt', combinedTilt);
            }
        });

        clientSocket.on('getDeviceTilt', (deviceId: string) => {
            if (this.virtualRoom.tiltManager) {
                const deviceTilt = this.virtualRoom.tiltManager.getDeviceTilt(deviceId);
                clientSocket.emit('deviceTilt', { deviceId, tiltData: deviceTilt });
            }
        });

        // Movement/shake-related socket listeners
        clientSocket.on('getAccelerationHistory', (deviceId: string) => {
            if (this.virtualRoom.movementManager) {
                const history = this.virtualRoom.movementManager.getAccelerationHistory(deviceId);
                clientSocket.emit('accelerationHistory', { deviceId, history });
            }
        });

        // Listen to virtualRoom tilt events and broadcast to all clients
        this.virtualRoom.addEventListener('deviceTiltUpdate', (data) => {
            clientSocket.broadcast.emit('deviceTiltUpdate', data);
        });

        this.virtualRoom.addEventListener('deviceTiltMovement', (data) => {
            clientSocket.broadcast.emit('deviceTiltMovement', data);
        });

        this.virtualRoom.addEventListener('tiltTogether', (data) => {
            clientSocket.broadcast.emit('combinedTilt', data);
        });

        // Listen to virtualRoom shake events and broadcast to all clients
        this.virtualRoom.addEventListener('shake', (data) => {
            clientSocket.broadcast.emit('shake', data);
        });
    
        clientSocket.on('disconnect', () => {
            // Clean up device tilt data when they disconnect
            if (this.virtualRoom.tiltManager) {
                this.virtualRoom.tiltManager.clearDeviceTiltData(this.device.id.value);
            }
            // Clean up device acceleration history when they disconnect
            if (this.virtualRoom.movementManager) {
                this.virtualRoom.movementManager.clearDeviceHistory(this.device.id.value);
            }
            this.virtualRoom.emit('removeDevice', this.device);
            this.emit('destroy', undefined);
            console.log('❌ Client disconnected');
        });

        this.addEventListener('destroy', this.destroy.bind(this));
    }

    /*== Dispatcher deleguate ==*/
    public addEventListener = this.dispatcher.addEventListener.bind(this.dispatcher);
    public removeEventListener = this.dispatcher.removeEventListener.bind(this.dispatcher);
    public emit = this.dispatcher.emit.bind(this.dispatcher);
    /*== ==================== ==*/
    
    /*============================================================================================*/
    /*                                          handlers                                          */
    /*============================================================================================*/

    /**
     * Handle the destroy of the current object
     */
    private destroy() {
        this.clientSocket.removeAllListeners();
    }
}

export default ClientSocketService;
