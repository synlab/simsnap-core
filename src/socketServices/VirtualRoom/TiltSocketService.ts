import { Socket } from 'socket.io';
import { TiltManager } from '../../entities/VirtualRoom/TiltManager';
import { DeviceInteractionOrientationEvent, TiltTogetherEvent } from '../../entities/VirtualRoom/types';

export class TiltSocketService {
    constructor(
        private readonly socket: Socket,
        private readonly tiltManager: TiltManager,
    ) {
        this.setupEventListeners();
    }

    private setupEventListeners() {
        // Listen for tilt updates from clients
        this.socket.on('deviceTilt', (data: DeviceInteractionOrientationEvent) => {
            this.handleDeviceTilt(data);
        });

        // Listen for requests for combined tilt data
        this.socket.on('getCombinedTilt', (method: 'average' | 'max' | 'min') => {
            const combinedTilt = this.tiltManager.calculateCombinedTilt(method);
            this.socket.emit('combinedTilt', combinedTilt);
        });

        // Listen for requests for individual device tilt data
        this.socket.on('getDeviceTilt', (deviceId: string) => {
            const deviceTilt = this.tiltManager.getDeviceTilt(deviceId);
            this.socket.emit('deviceTilt', { deviceId, tiltData: deviceTilt });
        });

        // Clean up when device disconnects
        this.socket.on('disconnect', () => {
            // Clean up device tilt data when they disconnect
            if (this.socket.data.deviceId) {
                this.tiltManager.clearDeviceTiltData(this.socket.data.deviceId);
            }
        });
    }

    private handleDeviceTilt(data: DeviceInteractionOrientationEvent) {
        // Store the device ID in socket for cleanup
        this.socket.data.deviceId = data.device.id.value;
        
        // Get movement recommendation using current data and previous angles
        const movementRecommendation = this.tiltManager.getMovementRecommendation(data);
        
        // Broadcast the tilt update to all connected clients
        this.socket.broadcast.emit('deviceTiltUpdate', data);
        
        // Update the tilt manager with new data
        this.tiltManager.manageTilt(data);
        
        // Emit movement recommendation if available
        if (movementRecommendation) {
            this.socket.broadcast.emit('deviceTiltMovement', {
                deviceId: data.device.id.value,
                ...movementRecommendation
            });
        }
    }

    /**
     * Broadcast combined tilt data to all clients
     * @param tiltData The combined tilt data
     */
    public broadcastCombinedTilt(tiltData: TiltTogetherEvent) {
        this.socket.broadcast.emit('combinedTilt', tiltData);
    }
}
