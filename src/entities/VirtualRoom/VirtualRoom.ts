import { DeviceInteractionOrientationEvent, DeviceInteractionPointerEvent } from "./types";
import { Device } from "../VirtualRoom/Device";
import { removeItem } from "../Utils";
import { SnapManager } from "./SnapManager";

/**
 * Representation of a virtual room
 *
 * @param devices - the list of device to add to the room
 */
export class VirtualRoom {
    private snapManager = new SnapManager(this);
    public devices: Device[] = [];

    constructor(
        /** The list of devices currently active on the virtual room */
        devices: Device[] = [],
    ) { 
        devices.forEach(device => this.handleAddDevice(device));
     }


    /*============================================================================================*/
    /*                                          handlers                                          */
    /*============================================================================================*/


    /**
     * Add a new device in the room, and trigger the {@link VirtualRoom.onAddDevice} event
     * @virtual
     *
     * @param device - The added device
     */
    handleAddDevice(device: Device) {
        this.devices.push(device);
        this.onAddDevice?.(device);
    }

    /**
     * Remove all the references of a device from the room, and trigger the {@link VirtualRoom.onRemoveDevice} event
     * @virtual
     *
     * @param device - The removed device
     */
    handleRemoveDevice(device: Device) {
        removeItem(this.devices, (el)=>el.id == device.id);
        this.devices.forEach(device => device.snapDevices = device.snapDevices.filter(el => el[0] !== device));
        this.onRemoveDevice?.(device);
    }

    /**
     * Handle a press pointer by a device, and trigger the {@link VirtualRoom.onDevicePress} event
     * @virtual
     *
     * @param event - The event emit from the device
     * 
     * @remarks
     * call the {@link Device.handlePress}
     */
    handleDevicePress(event: DeviceInteractionPointerEvent) {
        event.device.handlePress(event);
        this.onDevicePress?.(event);
    }

    /**
     * Handle a move pointer by a device, and trigger the {@link VirtualRoom.onDeviceMove} event
     * @virtual
     *
     * @param event - The event emit from the device
     * 
     * @remarks
     * call the {@link Device.handleMove}
     */
    handleDeviceMove(event: DeviceInteractionPointerEvent) {
        if (event.device.currentPress) {
            event.device.handleMove(event);
            this.onDeviceMove?.(event);
        }
    }

    /**
     * Handle a release pointer by a device, and trigger the {@link VirtualRoom.onDeviceRelease} event
     * @virtual
     *
     * @param event - The event emit from the device
     * 
     * @remarks
     * call the {@link Device.handleRelease}
     */
    handleDeviceRelease(event: DeviceInteractionPointerEvent) {
        if (event.device.currentPress) {
            
            /*-- snap --*/
            this.snapManager.manageSnap(event);
            /*-- ---- --*/
            
            event.device.handleRelease(event);
            this.onDeviceRelease?.(event);
        }
    }

    /**
     * Handle a change of the device orientation, and trigger the {@link VirtualRoom.onDeviceOrientationChange} event
     * @virtual
     *
     * @param event - The event emit from the device
     * 
     * @remarks
     * call the {@link Device.handleRelease}
     */
    handleDeviceOrientationChange(event: DeviceInteractionOrientationEvent) {
        this.onDeviceOrientationChange?.(event);
    }

    /**
     * Handle the destroying of the current obejct, and trigger the {@link VirtualRoom.onDestroy} event
     * @virtual
     */
    handleDestroy() {
        this.onDestroy?.();
    }


    /*=============================================================================================*/
    /*                                      event listenner                                        */
    /*=============================================================================================*/


    /**
     * CallBack triggered when two Devices are snaped
     * @eventProperty
     *
     * @param event1 - the first snaped device
     * @param event2 - the second snaped device
     * 
     * @remarks
     * The event is triggered just after the unSnap is affected
     * @see {@link Device.onSnap} to access to the snapping details for each devices
     */
    onSnapDevices?: (event1: DeviceInteractionPointerEvent, event2: DeviceInteractionPointerEvent) => void;
    
    /**
     * CallBack triggered when two Devices are unSnaped
     * @eventProperty
     *
     * @param event1 - the first unSnaped device
     * @param event2 - the second unSnaped device
     * 
     * @remarks
     * The event is triggered just after the unSnap is affected
     * @see {@link Device.onUnSnap} to access to the unSnapping details for each devices 
     */
    onUnSnapDevices?: (event1: DeviceInteractionPointerEvent, event2: DeviceInteractionPointerEvent) => void;
    
    /**
     * CallBack triggered when a new Device has been added
     * @eventProperty
     *
     * @param device - the freshly new added device
     * 
     * @remarks
     * The event is triggered just after the adding
     */
    onAddDevice?: (device: Device) => void;

    /**
     * CallBack triggered when a Device has been removed 
     * @eventProperty
     *
     * @param device - the removed device
     * 
     * @remarks
     * The event is triggered just after the removing
     */
    onRemoveDevice?: (device: Device) => void;

    /**
     * CallBack triggered when a Device has been pressed 
     * @eventProperty
     *
     * @param event - the pressed event
     * 
     * @remarks
     * The event is triggered just after the press affected the system
     */
    onDevicePress?: (event: DeviceInteractionPointerEvent) => void;

    /**
     * CallBack triggered when a Device pointer has moved
     * @eventProperty
     *
     * @param event - the moved event
     * 
     * @remarks
     * The event is triggered just after the move affected the system
     * @remarks
     * Triggered only if a current press event has been saved for the device
     */
    onDeviceMove?: (event: DeviceInteractionPointerEvent) => void;

    /**
     * CallBack triggered when a Device pointer has been released
     * @eventProperty
     *
     * @param event - the released event
     * 
     * @remarks
     * The event is triggered just after the release affected the system
     * @remarks
     * Triggered only if a current press event has been saved for the device
     */
    onDeviceRelease?: (event: DeviceInteractionPointerEvent) => void;

    /**
     * CallBack triggered when a Device orientation has changed
     * @eventProperty
     *
     * @param event - the device orientation change event
     */
    onDeviceOrientationChange?: (event: DeviceInteractionOrientationEvent) => void;

    /**
     * CallBack triggered when the current object is being destroy
     * @eventProperty
     */
    onDestroy?: () => void;
}

export default VirtualRoom;

new VirtualRoom()