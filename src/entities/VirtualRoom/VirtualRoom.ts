import { Id } from '../Utils';
import { Device } from '../VirtualRoom/Device';
import { SnapManager, SnapManagerEvent } from './SnapManager';
import { EventDispatcher } from '../Utils';
import { TiltManager, TiltManagerEvent } from './TiltManager';
import { MovementManager, MovementManagerEvent } from './MovementManager';
import { PointerManager, PointerManagerEvent } from './PointerManager';

export type VirtualRoomEvents = {
    addDevice: Device;
    removeDevice: Device;
    destroy: undefined
} & PointerManagerEvent & SnapManagerEvent & TiltManagerEvent & MovementManagerEvent;

/**
 * Representation of a virtual room
 *
 * @param devices - the list of device to add to the room
 */
export class VirtualRoom<Events extends VirtualRoomEvents = VirtualRoomEvents> {
    readonly id = new Id('virtualRoom');
    private dispatcher = new EventDispatcher<Events>();
    public pointerManager?: PointerManager;
    public snapManager?: SnapManager;
    public tiltManager?: TiltManager;
    public movementManager?: MovementManager;
    
    public devices: Device[] = [];

    constructor(
        /** The list of devices currently active on the virtual room */
        devices: Device[] = [],
        enablePointerManager = true,
        enableSnapManager = true,
        enableTiltManager = true,
        enableMovementManager = true,
    ) { 
        devices.forEach(device => this.handleAddDevice(device));

        this.addEventListener('addDevice', this.handleAddDevice.bind(this));
        this.addEventListener('removeDevice', this.handleRemoveDevice.bind(this));
        if (enablePointerManager) this.pointerManager = new PointerManager(this);
        if (enableSnapManager) this.snapManager = new SnapManager(this);
        if (enableTiltManager) this.tiltManager = new TiltManager(this);
        if (enableMovementManager) this.movementManager = new MovementManager(this);
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
     * Add a new device in the room
     *
     * @param device - The added device
     * 
     * @remarks
     * priority in the event chain is 0
     */
    private handleAddDevice(device: Device) {
        this.devices.push(device);
    }

    /**
     * Remove all the references of a device from the room
     *
     * @param device - The removed device
     * @remarks
     * priority in the event chain is 0
     */
    private handleRemoveDevice(device: Device) {
        this.devices = this.devices.filter((el) => el.id !== device.id);
    }
}

export default VirtualRoom;

new VirtualRoom();
