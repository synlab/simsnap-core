import { DeviceInteractionOrientationEvent, DeviceInteractionPointerEvent, SnapDevicesEvent } from "./types";
import { Device, DeviceEvents } from "../VirtualRoom/Device";
import { SnapManager } from "./SnapManager";
import { EventDispatcher } from "./EventDispatcher";

export type VirtualRoomEvents = {
  addDevice: Device;
  removeDevice: Device;
  devicePress: DeviceInteractionPointerEvent;
  deviceMove: DeviceInteractionPointerEvent;
  deviceRelease: DeviceInteractionPointerEvent;
  deviceOrientationChange: DeviceInteractionOrientationEvent;
  snapDevices: SnapDevicesEvent;
  unSnapDevices: SnapDevicesEvent;
  destroy: undefined
};

/**
 * Representation of a virtual room
 *
 * @param devices - the list of device to add to the room
 */
export class VirtualRoom<Events extends VirtualRoomEvents = VirtualRoomEvents> {
    private dispatcher = new EventDispatcher<Events>();
    
    private snapManager: SnapManager = new SnapManager(this);
    public devices: Device[] = [];

    constructor(
        /** The list of devices currently active on the virtual room */
        devices: Device[] = [],
    ) { 
        devices.forEach(device => this.handleAddDevice(device));

        this.addEventListener("addDevice", this.handleAddDevice.bind(this));
        this.addEventListener("removeDevice", this.handleRemoveDevice.bind(this));
        this.addEventListener("devicePress", this.handleDevicePress.bind(this));
        this.addEventListener("deviceMove", this.handleDeviceMove.bind(this));
        this.addEventListener("deviceRelease", this.handleDeviceRelease.bind(this));
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
        this.devices = this.devices.filter((el)=>el.id !== device.id);
        device.snapDevices.forEach(
            ({ device: snapedDevice })=>snapedDevice.snapDevices.forEach((snapEvent) => {
                if (snapEvent.device.id.value === device.id.value) snapedDevice.emit("unSnap", snapEvent)
            })
        )
        device.snapDevices.forEach(snapEvent=>device.emit("unSnap", snapEvent))
    }

    /**
     * Handle a press pointer by a device, and trigger the {@link DeviceEvents.pointerPress} event
     *
     * @param event - The event emit from the device
     */
    private handleDevicePress(event: DeviceInteractionPointerEvent) {
        event.device.emit("pointerPress", event);
    }

    /**
     * Handle a move pointer by a device, and trigger the {@link DeviceEvents.pointerMove} event
     *
     * @param event - The event emit from the device
     */
    private handleDeviceMove(event: DeviceInteractionPointerEvent) {
        if (event.device.currentPress) {
            event.device.emit("pointerMove", event);
        }
    }

    /**
     * Handle a release pointer by a device, and trigger the {@link DeviceEvents.pointerRelease} event
     *
     * @param event - The event emit from the device
     */
    private handleDeviceRelease(event: DeviceInteractionPointerEvent) {
        if (event.device.currentPress) {

            /*-- snap --*/
            this.snapManager.manageSnap(event);
            /*-- ---- --*/
            
            event.device.emit("pointerRelease", event);
        }
    }
}

export default VirtualRoom;

new VirtualRoom()