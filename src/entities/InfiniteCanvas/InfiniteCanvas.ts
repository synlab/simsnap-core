import { distance, removeItem } from "../Utils";
import { VirtualRoom } from "../VirtualRoom/VirtualRoom";
import CanvasDevice from "./CanvasDevice";
import { ViewBoxManager } from "./ViewBoxManager";
import { ViewBoxObject } from "./ViewBoxObject";
import { DeviceInteractionPointerEventOnCanvas } from "./types";


/**
 * Representation of a virtual room in a 3D context
 *
 * @param devices - the list of CanvasDevice to add to the room
 * @param sceneObjects - the list of object to add to the scene
 */
export class InfiniteCanvas extends VirtualRoom {
	override devices: CanvasDevice[] = [];

	constructor(
		devices: CanvasDevice[] = [],
		public sceneObjects: ViewBoxObject[] = []
	) { 
		super(devices)
	}

	/**
     * Update the scene, and trigger the {@link InfiniteCanvas.handleSceneUpdate} event
     * @internal 
     *
	 * @param device the device asking for the update
	 * 
     * @return the current Canvas scene
	 * 
	 * @remarks only the object visible for the device are returned
     */
	updateSceneObjects(device: CanvasDevice): ViewBoxObject[] {
		this.onSceneUpdate?.();
		const devicePos = device.pos;
		if (!devicePos || !device.size) {
			return [];
		}
		return this.sceneObjects
			.filter(obj => ViewBoxManager.intersectViewBox(obj, device))
			.map(obj => {
				const newObj = obj.copy();
				newObj.pos && (newObj.pos = { x: newObj.pos.x - devicePos.x, y: newObj.pos.y - devicePos.y });
				return newObj;
			});
	}

	
	/*============================================================================================*/
    /*                                          handlers                                          */
    /*============================================================================================*/


	/**
     * Handle a press pointer by a device on the Canvas
	 * @override 
	 * 
	 * @param event - The event emit from the device
     * 
     * @see {@link VirtualRoom.handleDevicePress}
     */
	override handleDevicePress(event: DeviceInteractionPointerEventOnCanvas) {
		const canvaPos = event.posCanvas;
		canvaPos && this.sceneObjects.filter(el => ViewBoxManager.intersect(canvaPos, el)).forEach(el => el.pressedBy.push(event.device.id));
		super.handleDevicePress(event);
	}

	/**
     * Handle a move pointer by a device on the Canvas
	 * @override
	 * 
	 * @param event - The event emit from the device
     * 
     * @see {@link VirtualRoom.handleDeviceMove}
     */
	override handleDeviceMove(event: DeviceInteractionPointerEventOnCanvas) {
		if (event.device.currentPress) {
			this.sceneObjects.filter(obj => obj.pressedBy.includes(event.device.id)).forEach(obj => obj.onGrab?.(event));
		}
		super.handleDeviceMove(event);
	}

	/**
     * Handle a release pointer by a device on the Canvas
	 * @override
	 * 
	 * @param event - The event emit from the device
     * 
     * @see {@link VirtualRoom.handleDeviceRelease}
     */
	override handleDeviceRelease(event: DeviceInteractionPointerEventOnCanvas) {
		if (event.device.currentPress) {
			if (event.posCanvas && event.device.currentPress.posCanvas && distance(event.posCanvas, event.device.currentPress.posCanvas) < 10) {
				this.sceneObjects.filter(el => el.pressedBy.includes(event.device.id)).forEach(el => el?.onClick?.(event))
			}

            this.sceneObjects.forEach(el => removeItem(el.pressedBy, event.device.id));
		}
		super.handleDeviceRelease(event);
	}


	/*=============================================================================================*/
    /*                                      event listenner                                        */
    /*=============================================================================================*/


    /**
     * CallBack triggered when an update of the scene is required
	 * @eventProperty
	 * 
	 * @remarks
	 * The event is triggered just before the sceneObjects list is been returned
     */
    onSceneUpdate?: () => void
}

export default InfiniteCanvas;