import { DeviceInteractionOrientationEvent, DeviceInteractionPointerEvent } from "./types";
import { Device } from "../VirtualRoom/Device";
import { removeItem } from "../Utils";
import { SnapManager } from "./SnapManager";

export class VirtualRoom<D extends Device<D> = Device> {
    private snapManager = new SnapManager<D>(this);

    constructor(
        public devices: D[] = [],
    ) { }

    /*== handler ==*/

    handleAddDevice(device: D) {
        this.devices.push(device);
        this.onAddDevice?.(device);
    }

    handleRemoveDevice(device: D) {
        removeItem(this.devices, device);
        this.devices.forEach(device => device.snapDevices = device.snapDevices.filter(el => el[0] !== device));
        this.onRemoveDevice?.(device);
    }

    handleDevicePress(event: DeviceInteractionPointerEvent<D>) {
        event.device.handlePress(event);
        this.onDevicePress?.(event);
    }

    handleDeviceMove(event: DeviceInteractionPointerEvent<D>) {
        if (event.device.currentPress) {
            event.device.handleMove(event);
            this.onDeviceMove?.(event);
        }
    }

    handleDeviceRelease(event: DeviceInteractionPointerEvent<D>) {
        if (event.device.currentPress) {
            
            /*-- snap --*/
            this.snapManager.manageSnap(event);
            /*-- ---- --*/
            
            event.device.handleRelease(event);
            this.onDeviceRelease?.(event);
        }
    }

    handleDeviceOrientationChange(event: DeviceInteractionOrientationEvent<D>) {
        this.onDeviceOrientationChange?.(event);
    }

    /*== ======= ==*/

    /*== event listenner ==*/

    onSnapDevices?: (event1: DeviceInteractionPointerEvent<D>, event2: DeviceInteractionPointerEvent<D>) => void;
    onUnSnapDevices?: (event1: DeviceInteractionPointerEvent<D>, event2: DeviceInteractionPointerEvent<D>) => void;
    onAddDevice?: (device: D) => void;
    onRemoveDevice?: (device: D) => void;
    onDevicePress?: (event: DeviceInteractionPointerEvent<D>) => void;
    onDeviceMove?: (event: DeviceInteractionPointerEvent<D>) => void;
    onDeviceRelease?: (event: DeviceInteractionPointerEvent<D>) => void;
    onDeviceOrientationChange?: (event: DeviceInteractionOrientationEvent<D>) => void;

    /*== =============== ==*/
}

export default VirtualRoom;