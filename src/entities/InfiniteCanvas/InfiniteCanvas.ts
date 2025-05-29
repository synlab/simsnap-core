import { distance, removeItem } from "../Utils";
import { VirtualRoom } from "../VirtualRoom/VirtualRoom";
import CanvasDevice from "./CanvasDevice";
import { ViewBox } from "./ViewBoxEntity";
import { ViewBoxObject } from "./ViewBoxObject";
import { DeviceInteractionPointerEventOnCanvas } from "./types";

export class InfiniteCanvas extends VirtualRoom {

	constructor(
		override devices: CanvasDevice[] = [],
		public sceneObjects: ViewBoxObject[] = []
	) { 
		super(devices)
	}

	/** @internal **/
	getViewPortScene(device: CanvasDevice): ViewBoxObject[] {
		this.handleSceneUpdate?.();
		const devicePos = device.pos;
		if (!devicePos || !device.size) {
			return [];
		}
		return this.sceneObjects
			.filter(obj => ViewBox.intersectViewBox(obj, device))
			.map(obj => {
				const newObj = obj.copy();
				newObj.pos && (newObj.pos = { x: newObj.pos.x - devicePos.x, y: newObj.pos.y - devicePos.y });
				return newObj;
			});
	}

	/*== handler ==*/

	override handleDevicePress(event: DeviceInteractionPointerEventOnCanvas) {
		event = DeviceInteractionPointerEventOnCanvas.FromEvent(event);
		const canvaPos = event.posCanvas;
		canvaPos && this.sceneObjects.filter(el => ViewBox.intersect(canvaPos, el)).forEach(el => el.pressedBy.push(event.device));
		super.handleDevicePress(event);
	}

	override handleDeviceMove(event: DeviceInteractionPointerEventOnCanvas) {
		event = DeviceInteractionPointerEventOnCanvas.FromEvent(event);
		if (event.device.currentPress) {
			this.sceneObjects.filter(obj => obj.pressedBy.includes(event.device)).forEach(obj => obj.onGrab?.(event));
		}
		super.handleDeviceMove(event);
	}

	override handleDeviceRelease(event: DeviceInteractionPointerEventOnCanvas) {
		event = DeviceInteractionPointerEventOnCanvas.FromEvent(event);
		if (event.device.currentPress) {
			if (event.posCanvas && event.device.currentPress.posCanvas && distance(event.posCanvas, event.device.currentPress.posCanvas) < 10) {
				this.sceneObjects.filter(el => el.pressedBy.includes(event.device)).forEach(el => el?.onClick?.(event))
			}

            this.sceneObjects.forEach(el => removeItem(el.pressedBy, event.device));
		}
		super.handleDeviceRelease(event);
	}

    handleSceneUpdate?: () => void

	/*== ======= ==*/
}

export default InfiniteCanvas;