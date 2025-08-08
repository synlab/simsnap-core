import { PointerManager } from '../VirtualRoom/PointerManager';
import { DeviceInteractionPointerEvent } from '../VirtualRoom/types';
import InfiniteCanvas from './InfiniteCanvas';
import { DeviceInteractionPointerEventOnCanvas } from './types';

export type InfiniteCanvasPointerManagerEvent = { 
    devicePressOnCanvas: DeviceInteractionPointerEventOnCanvas;
    deviceMoveOnCanvas: DeviceInteractionPointerEventOnCanvas;
    deviceReleaseOnCanvas: DeviceInteractionPointerEventOnCanvas;
};

/**
 * Handle the pointer management for virtualRoom
 * @internal
 *
 * @param virtualRoom - the calling virtualRoom
 */
export class InfiniteCanvasPointerManager extends PointerManager {
    constructor( protected override readonly virtualRoom: InfiniteCanvas ) {
        super(virtualRoom);
        virtualRoom.addEventListener('devicePress', (event) => this.handlePointerTo(event, 'devicePressOnCanvas'));
        virtualRoom.addEventListener('deviceMove', (event) => this.handlePointerTo(event, 'deviceMoveOnCanvas'), 1);
        virtualRoom.addEventListener('deviceRelease', (event) => this.handlePointerTo(event, 'deviceReleaseOnCanvas'), 1);
    }

    /**
     * Convert a DeviceInteractionPointerEvent to a DeviceInteractionPointerEventOnCanvas
	 * 
	 * @param event - The event to convert
     */
	public toDeviceInteractionPointerEventOnCanvas(event: DeviceInteractionPointerEvent): DeviceInteractionPointerEventOnCanvas | undefined {
		const device = this.virtualRoom.devices.find(d => d.id == event.device.id);
		if (device) return new DeviceInteractionPointerEventOnCanvas(device, event.x, event.y);
	}


	/**
     * Handle a pointer event to dispatch it if on Canvas
	 * 
	 * @param event - The event emit from the device
	 * @param eventType - The event type to transfert
     */
	protected handlePointerTo(event: DeviceInteractionPointerEvent, eventType: 'devicePressOnCanvas' | 'deviceMoveOnCanvas' | 'deviceReleaseOnCanvas') {
		const canvasEvent = this.toDeviceInteractionPointerEventOnCanvas(event);
		if (canvasEvent) this.virtualRoom.emit(eventType, canvasEvent);
	}
}
