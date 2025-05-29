import { DeviceInteractionOrientationEvent, DeviceInteractionPointerEvent } from "./types";
import { Device } from "../VirtualRoom/Device";
import { removeItem } from "../Utils";
import { SnapManager } from "./SnapManager";

export class VirtualRoom {
    private snapManager = new SnapManager(this);

    constructor(
        public devices: Device[] = [],
    ) { }

    /*== handler ==*/

    handleAddDevice(device: Device) {
        this.devices.push(device);
        this.onAddDevice?.(device);
    }

    handleRemoveDevice(device: Device) {
        removeItem(this.devices, device);
        this.devices.forEach(device => device.snapDevices = device.snapDevices.filter(el => el[0] !== device));
        this.onRemoveDevice?.(device);
    }

    handleDevicePress(event: DeviceInteractionPointerEvent) {
        event.device.handlePress(event);
        this.onDevicePress?.(event);
    }

    handleDeviceMove(event: DeviceInteractionPointerEvent) {
        if (event.device.currentPress) {
            event.device.handleMove(event);
            this.onDeviceMove?.(event);
        }
    }

    handleDeviceRelease(event: DeviceInteractionPointerEvent) {
        if (event.device.currentPress) {
            
            /*-- snap --*/
            this.snapManager.manageSnap(event);
            /*-- ---- --*/
            
            event.device.handleRelease(event);
            this.onDeviceRelease?.(event);
        }
    }

    handleDeviceOrientationChange(event: DeviceInteractionOrientationEvent) {
        this.onDeviceOrientationChange?.(event);
    }

    /*== ======= ==*/

    /*== event listenner ==*/

    onSnapDevices?: (event1: DeviceInteractionPointerEvent, event2: DeviceInteractionPointerEvent) => void;
    onUnSnapDevices?: (event1: DeviceInteractionPointerEvent, event2: DeviceInteractionPointerEvent) => void;
    onAddDevice?: (device: Device) => void;
    onRemoveDevice?: (device: Device) => void;
    onDevicePress?: (event: DeviceInteractionPointerEvent) => void;
    onDeviceMove?: (event: DeviceInteractionPointerEvent) => void;
    onDeviceRelease?: (event: DeviceInteractionPointerEvent) => void;
    onDeviceOrientationChange?: (event: DeviceInteractionOrientationEvent) => void;

    /*== =============== ==*/
}