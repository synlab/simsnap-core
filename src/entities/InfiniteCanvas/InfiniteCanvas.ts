import { VirtualRoom, VirtualRoomEvents } from '../VirtualRoom/VirtualRoom';
import { DeviceInteractionPointerEvent } from '../VirtualRoom/types';
import CanvasDevice from './CanvasDevice';
import { GrabPressManager } from './GrabPressManager';
import { InfiniteCanvasSnapManager, InfiniteCanvasSnapManagerEvent } from './InfiniteCanvasSnapManager';
import { ViewBoxObject } from './ViewBoxObject';
import { DeviceInteractionPointerEventOnCanvas } from './types';

export type InfiniteCanvasEvents = VirtualRoomEvents & { 
	devicePressOnCanvas: DeviceInteractionPointerEventOnCanvas;
	deviceMoveOnCanvas: DeviceInteractionPointerEventOnCanvas;
	deviceReleaseOnCanvas: DeviceInteractionPointerEventOnCanvas;
} & InfiniteCanvasSnapManagerEvent;

/**
 * Representation of a virtual room in a 3D context
 *
 * @param devices - the list of CanvasDevice to add to the room
 * @param sceneObjects - the list of object to add to the scene
 */
export class InfiniteCanvas<Events extends InfiniteCanvasEvents = InfiniteCanvasEvents> extends VirtualRoom<Events> {
	override devices: CanvasDevice[] = [];
	
	protected override snapManager?: InfiniteCanvasSnapManager;
	protected grabPressManager?: GrabPressManager;

	private timeInterval: NodeJS.Timeout | undefined;

	constructor(
		devices: CanvasDevice[] = [],
		public sceneObjects: ViewBoxObject[] = [],
		enableSnapManager = true,
		enableTiltManager = true,
		enablePressManager = true,
	) {
		super(devices, false, enableTiltManager);
        this.addEventListener('devicePress', (event) => this.handlePointerTo(event, 'devicePressOnCanvas'));
        this.addEventListener('deviceMove', (event) => this.handlePointerTo(event, 'deviceMoveOnCanvas'), 1);
        this.addEventListener('deviceRelease', (event) => this.handlePointerTo(event, 'deviceReleaseOnCanvas'), 1);
		this.addEventListener('destroy', this.handleDestroy.bind(this));

		if (enableSnapManager) this.snapManager = new InfiniteCanvasSnapManager(this);
		if (enablePressManager) this.grabPressManager = new GrabPressManager(this);

		this.timeInterval = setInterval(() => {
            this.updateSceneObjects();
        }, 50);
	}

	/**
     * Update the scene, and trigger the {@link InfiniteCanvasEvents.sceneUpdate} event
     */
	updateSceneObjects() {
		this.devices.forEach(device => {
			if (!device.pos || !device.size) {
				return;
			}
			device.emit('sceneUpdate', 
				this.sceneObjects
					.filter(obj => device.isIntersectViewBox(obj))
					.map(obj =>  device.getProjectedViewBox(obj)),
			);
		});
	}

	
	/*============================================================================================*/
    /*                                          handlers                                          */
    /*============================================================================================*/

	
	/**
     * Convert a DeviceInteractionPointerEvent to a DeviceInteractionPointerEventOnCanvas
	 * 
	 * @param event - The event to convert
     */
	public toDeviceInteractionPointerEventOnCanvas(event: DeviceInteractionPointerEvent) {
		const device = this.devices.find(d => d.id == event.device.id);
		if (device) return new DeviceInteractionPointerEventOnCanvas(device, event.x, event.y);
	}


	/**
     * Handle a pointer event to dispatch it if on Canvas
	 * 
	 * @param event - The event emit from the device
	 * @param eventType - The event type to transfert
     */
	private handlePointerTo(event: DeviceInteractionPointerEvent, eventType: 'devicePressOnCanvas' | 'deviceMoveOnCanvas' | 'deviceReleaseOnCanvas') {
		const canvasEvent = this.toDeviceInteractionPointerEventOnCanvas(event);
		if (canvasEvent) this.emit(eventType, canvasEvent);
	}

	/**
	 * Handle the destroying of the current element
	 */
	private handleDestroy() {
		clearInterval(this.timeInterval);
	}
}

export default InfiniteCanvas;
