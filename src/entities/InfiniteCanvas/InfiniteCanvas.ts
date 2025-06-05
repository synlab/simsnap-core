import { distance } from "../Utils";
import { EventDispatcher } from "../VirtualRoom/EventDispatcher";
import { VirtualRoom, VirtualRoomEvents } from "../VirtualRoom/VirtualRoom";
import { DeviceInteractionPointerEvent } from "../VirtualRoom/types";
import CanvasDevice from "./CanvasDevice";
import { ViewBoxManager } from "./ViewBoxManager";
import { ViewBoxObject } from "./ViewBoxObject";
import { DeviceInteractionPointerEventOnCanvas } from "./types";

export type InfiniteCanvasEvents = VirtualRoomEvents & { 
	sceneUpdate: ViewBoxObject[],
	devicePressOnCanvas: DeviceInteractionPointerEventOnCanvas;
	deviceMoveOnCanvas: DeviceInteractionPointerEventOnCanvas;
	deviceReleaseOnCanvas: DeviceInteractionPointerEventOnCanvas;
};

/**
 * Representation of a virtual room in a 3D context
 *
 * @param devices - the list of CanvasDevice to add to the room
 * @param sceneObjects - the list of object to add to the scene
 */
export class InfiniteCanvas extends VirtualRoom {
	
	private timeInterval: NodeJS.Timeout | undefined;

	override devices: CanvasDevice[] = [];

	constructor(
		devices: CanvasDevice[] = [],
		public sceneObjects: ViewBoxObject[] = []
	) {
		super(devices)
        this.addEventListener("devicePress", (event) => this.handlePointerTo(event, "devicePressOnCanvas"));
        this.addEventListener("deviceMove", (event) => this.handlePointerTo(event, "deviceMoveOnCanvas"));
        this.addEventListener("deviceRelease", (event) => this.handlePointerTo(event, "deviceReleaseOnCanvas"));
		this.addEventListener("devicePressOnCanvas", this.handleDevicePressOnCanvas.bind(this));
        this.addEventListener("deviceMoveOnCanvas", this.handleDeviceMoveOnCanvas.bind(this));
        this.addEventListener("deviceReleaseOnCanvas", this.handleDeviceReleaseOnCanvas.bind(this));
		this.addEventListener('destroy', this.handleDestroy.bind(this))

		this.timeInterval = setInterval(() => {
            this.updateSceneObjects();
        }, 50)
	}

	/*== Dispatcher deleguate ==*/
    public addEventListener = (this.dispatcher as EventDispatcher<InfiniteCanvasEvents>).addEventListener.bind(this.dispatcher);
    public removeEventListener = (this.dispatcher as EventDispatcher<InfiniteCanvasEvents>).removeEventListener.bind(this.dispatcher);
    public emit = (this.dispatcher as EventDispatcher<InfiniteCanvasEvents>).emit.bind(this.dispatcher);
    /*== ==================== ==*/

	/**
     * Update the scene, and trigger the {@link InfiniteCanvasEvents.sceneUpdate} event
     */
	updateSceneObjects() {
		this.devices.forEach(device => {
			const devicePos = device.pos;

			if (!devicePos || !device.size) {
				return;
			}
			this.emit('sceneUpdate', 
				this.sceneObjects
					.filter(obj => ViewBoxManager.intersectViewBox(obj, device))
					.map(obj => {
						const newObj = obj.copy();
						newObj.pos && (newObj.pos = { x: newObj.pos.x - devicePos.x, y: newObj.pos.y - devicePos.y });
						return newObj;
					})
			)
		})
	}

	
	/*============================================================================================*/
    /*                                          handlers                                          */
    /*============================================================================================*/


	/**
     * Handle a pointer event to dispatch it if on Canvas
	 * 
	 * @param event - The event emit from the device
	 * @param eventType - The event type to transfert
     */
	private handlePointerTo(event: DeviceInteractionPointerEvent, eventType: keyof InfiniteCanvasEvents) {
		const device = this.devices.find(d => d.id == event.device.id);
		if (device?.pos && device.size) {
			this.emit(eventType, new DeviceInteractionPointerEventOnCanvas(device, event.x, event.y))
		}
	}

	/**
     * Handle a press pointer by a device on the Canvas
	 * 
	 * @param event - The event emit from the device
     */
	private handleDevicePressOnCanvas(event: DeviceInteractionPointerEventOnCanvas) {
		const canvaPos = event.posCanvas;
		canvaPos && this.sceneObjects.filter(el => ViewBoxManager.intersect(canvaPos, el)).forEach(el => el.pressedBy.push(event.device.id));
	}

	/**
     * Handle a move pointer by a device on the Canvas
	 * @override
	 * 
	 * @param event - The event emit from the device
     * 
     * @see {@link VirtualRoom.handleDeviceMove}
     */
	private handleDeviceMoveOnCanvas(event: DeviceInteractionPointerEventOnCanvas) {
		if (event.device.currentPress) {
			this.sceneObjects.filter(obj => obj.pressedBy.includes(event.device.id)).forEach(obj => obj.emit('grab', event));
		}
	}

	/**
     * Handle a release pointer by a device on the Canvas
	 * @override
	 * 
	 * @param event - The event emit from the device
     * 
     * @see {@link VirtualRoom.handleDeviceRelease}
     */
	private handleDeviceReleaseOnCanvas(event: DeviceInteractionPointerEventOnCanvas) {
		if (event.device.currentPress) {
			if (event.posCanvas && event.device.currentPress.posCanvas && distance(event.posCanvas, event.device.currentPress.posCanvas) < 10) {
				this.sceneObjects.filter(el => el.pressedBy.includes(event.device.id)).forEach(el => el.emit('click', event))
			}

            this.sceneObjects.forEach(el => el.pressedBy.filter(id => id === event.device.id));
		}
	}

	/**
	 * Handle the destroying of the current element
	 */
	private handleDestroy() {
		clearInterval(this.timeInterval);
	}
}

export default InfiniteCanvas;