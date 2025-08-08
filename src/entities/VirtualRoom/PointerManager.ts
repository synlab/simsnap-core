import { DeviceInteractionPointerEvent } from './types';
import { VirtualRoom } from './VirtualRoom';
import { DeviceEvents } from '../VirtualRoom/Device';
void ({} as DeviceEvents); // avoid lint unused error

export type PointerManagerEvent = {
    devicePress: DeviceInteractionPointerEvent;
    deviceMove: DeviceInteractionPointerEvent;
    deviceRelease: DeviceInteractionPointerEvent;
}

export type PointerManagerDeviceEvent = {
    pointerPress: DeviceInteractionPointerEvent;
    pointerMove: DeviceInteractionPointerEvent;
    pointerRelease: DeviceInteractionPointerEvent;
}

/**
 * Handle the pointer management for virtualRoom
 * @internal
 *
 * @param virtualRoom - the calling virtualRoom
 */
export class PointerManager {
    constructor( protected readonly virtualRoom: VirtualRoom ) {
        virtualRoom.addEventListener('devicePress', this.handleDevicePress.bind(this));
        virtualRoom.addEventListener('deviceMove', this.handleDeviceMove.bind(this));
        virtualRoom.addEventListener('deviceRelease', this.handleDeviceRelease.bind(this));
    }

    /**
     * Handle a press pointer by a device, and trigger the {@link DeviceEvents.pointerPress} event
     *
     * @param event - The event emit from the device
     */
    protected handleDevicePress(event: DeviceInteractionPointerEvent) {
        event.device.currentPressStart = event.device.currentPress = event;
        event.device.emit('pointerPress', event);
    }

    /**
     * Handle a move pointer by a device, and trigger the {@link DeviceEvents.pointerMove} event
     *
     * @param event - The event emit from the device
     */
    protected handleDeviceMove(event: DeviceInteractionPointerEvent) {
        if (event.device.currentPress) {
            event.device.currentPress = event;
            event.device.emit('pointerMove', event);
        }
    }

    /**
     * Handle a release pointer by a device, and trigger the {@link DeviceEvents.pointerRelease} event
     *
     * @param event - The event emit from the device
     */
    protected handleDeviceRelease(event: DeviceInteractionPointerEvent) {
        if (event.device.currentPress) {
            event.device.currentPressStart = event.device.currentPress = null;
            event.device.emit('pointerRelease', event);
        }
    }
}
