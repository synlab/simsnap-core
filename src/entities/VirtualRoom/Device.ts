import { Position, DeviceInteractionPointerEvent, Id } from "./types";
import { VirtualRoom } from "./VirtualRoom";

/**
 * Representation of a Device
 * 
 * @param size - the size of the viewport of the device
 * @param metaData - an optional Record of custom any, by string key
 * @param preId - the optional substring to add before the final ID
 */
export class Device {
    readonly id: Id;

    /** The press event of the current active pointer event, initialized directly on press */
    currentPressStart: DeviceInteractionPointerEvent | null = null;
    /** The press/move event of the current pointer event, initialized directly on press and updated on move */
    currentPress: DeviceInteractionPointerEvent | null = null;

    /** The currents devices that are snap with this */
    snapDevices: [this, Position][] = [];

    constructor(
        public size?: { width: number; height: number; },
        public metaData?: Record<string, any>,
        preId: string = 'device',
    ) {
        this.id = new Id(preId);
    }


    /**
     * Snap to the passed device, and trigger the {@link Device.onSnap} event
     * @internal 
     *
     * @param device - The device to snap with
     * @param position - Position where the snap take place on the device screen
     */
    snapTo(device: this, position: Position) {
        this.snapDevices.push([device, position]);
        this.onSnap?.(device, position);
    }

    /**
     * UnSnap the passed device, and trigger the {@link Device.onUnSnap} event
     * @internal 
     *
     * @param device - The device to unSnap
     * @param position - Position where the unSnap take place on the device screen
     */
    unSnapTo(device: this, position: Position) {
        this.snapDevices = this.snapDevices.filter(el => ! (el[0] === device && el[1] === position));
        this.onUnSnap?.(device, position);
    }


    /*============================================================================================*/
    /*                                          handlers                                          */
    /*============================================================================================*/


    /**
     * Handle a press pointer by a device
     * @virtual
     *
     * @param event - The device to unSnap
     * 
     * @remarks
     * This method should be call by {@link VirtualRoom.handleDevicePress}
     */
    handlePress(event: DeviceInteractionPointerEvent){
        this.currentPressStart = this.currentPress = event;
    }
    
    /**
     * Handle a move pointer by a device
     * @virtual
     *
     * @param event - The device to unSnap
     * 
     * @remarks
     * This method should be call by {@link VirtualRoom.handleDevicePress}
     */
    handleMove(event: DeviceInteractionPointerEvent) {
        if (this.currentPress) this.currentPress = event;
    }
    
    /**
     * Handle a release pointer by a device
     * @virtual
     *
     * @param event - The device to unSnap
     * 
     * @remarks
     * This method should be call by {@link VirtualRoom.handleDevicePress}
     */
    handleRelease(event: DeviceInteractionPointerEvent){
        this.currentPressStart = null;
        this.currentPress = null;
    }


    /*=============================================================================================*/
    /*                                      event listenner                                        */
    /*=============================================================================================*/


    /**
     * CallBack triggered when the Device is snaped
     * @eventProperty
     *
     * @param device - The device the current device has been snaped with
     * @param position - The position of the snap on the current device
     * 
     * @see {@link VirtualRoom.onSnapDevices} to access to the two device at the same time
     */
    onSnap?: (device: Device, position: Position) => void;

    /**
     * CallBack triggered when the Device is unSnaped
     * @eventProperty
     *
     * @param device - The device the current device has been unSnaped with
     * @param position - The position of the unSnap on the current device
     * 
     * @remarks
     * @see {@link VirtualRoom.onUnSnapDevices} to access to the two device at the same time
     */
    onUnSnap?: (device: Device, position: Position) => void;
}

export default Device;