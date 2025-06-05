import { EventDispatcher } from "./EventDispatcher";
import { Position, DeviceInteractionPointerEvent, Id, SnapEvent } from "./types";
import { VirtualRoom } from "./VirtualRoom";

export type DeviceEvents = {
  pointerPress: DeviceInteractionPointerEvent;
  pointerMove: DeviceInteractionPointerEvent;
  pointerRelease: DeviceInteractionPointerEvent;
  snap: SnapEvent;
  unSnap: SnapEvent;
};

/**
 * Representation of a Device
 * 
 * @param size - the size of the viewport of the device
 * @param metaData - an optional Record of custom any, by string key
 * @param preId - the optional substring to add before the final ID
 */
export class Device {
    protected dispatcher = new EventDispatcher<DeviceEvents>();
    
    readonly id: Id;

    /** The press event of the current active pointer event, initialized directly on press */
    currentPressStart: DeviceInteractionPointerEvent | null = null;
    /** The press/move event of the current pointer event, initialized directly on press and updated on move */
    currentPress: DeviceInteractionPointerEvent | null = null;

    /** The currents devices that are snap with this */
    snapDevices: [Device, Position][] = [];

    constructor(
        public size?: { width: number; height: number; },
        public metaData?: Record<string, any>,
        preId: string = 'device',
    ) {
        this.id = new Id(preId);

        /*== Link internal handlers ==*/
        this.addEventListener("snap", this.handleSnapTo.bind(this));
        this.addEventListener("unSnap", this.handleUnSnapTo.bind(this));
        this.addEventListener("pointerPress", this.handlePress.bind(this));
        this.addEventListener("pointerMove", this.handleMove.bind(this));
        this.addEventListener("pointerRelease", this.handleRelease.bind(this));
        /*== ====================== ==*/
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
     * Snap to the passed device
     *
     * @param device - The device to snap with
     * @param position - Position where the snap take place on the device screen
     */
    private handleSnapTo(snapeEvent: SnapEvent) {
        this.snapDevices.push([snapeEvent.device, snapeEvent.position]);
    }

    /**
     * UnSnap the passed device
     *
     * @param device - The device to unSnap
     * @param position - Position where the unSnap take place on the device screen
     */
    private handleUnSnapTo(snapeEvent: SnapEvent) {
        this.snapDevices = this.snapDevices.filter(el => ! (el[0] === snapeEvent.device && el[1] === snapeEvent.position));
    }

    /**
     * Handle a press pointer by a device
     *
     * @param event - The device to unSnap
     * 
     * @remarks
     * This method should be call by {@link VirtualRoom.handleDevicePress}
     */
    private handlePress(event: DeviceInteractionPointerEvent){
        this.currentPressStart = this.currentPress = event;
    }
    
    /**
     * Handle a move pointer by a device
     *
     * @param event - The device to unSnap
     * 
     * @remarks
     * This method should be call by {@link VirtualRoom.handleDevicePress}
     */
    private handleMove(event: DeviceInteractionPointerEvent) {
        if (this.currentPress) this.currentPress = event;
    }
    
    /**
     * Handle a release pointer by a device
     *
     * @param event - The device to unSnap
     * 
     * @remarks
     * This method should be call by {@link VirtualRoom.handleDevicePress}
     */
    private handleRelease(event: DeviceInteractionPointerEvent){
        this.currentPressStart = null;
        this.currentPress = null;
    }
}

export default Device;