import { distance, removeItem } from "../Utils";
import { VirtualRoom } from "../VirtualRoom/VirtualRoom";
import CanvasUser from "./CanvasUser";
import { ViewBox } from "./ViewBoxEntity";
import { ViewBoxObject } from "./ViewBoxObject";
import { UserInteractionPointerEventOnCanvas } from "./types";

export class InfiniteCanvas extends VirtualRoom {

	constructor(
		override users: CanvasUser[] = [],
		public sceneObjects: ViewBoxObject[] = []
	) { 
		super(users)
	}

	/** @internal **/
	getViewPortScene(user: CanvasUser): ViewBoxObject[] {
		this.handleSceneUpdate?.();
		const usrPos = user.pos;
		if (!usrPos || !user.size) {
			return [];
		}
		return this.sceneObjects
			.filter(obj => ViewBox.intersectViewBox(obj, user))
			.map(obj => {
				const newObj = obj.copy();
				newObj.pos && (newObj.pos = { x: newObj.pos.x - usrPos.x, y: newObj.pos.y - usrPos.y });
				return newObj;
			});
	}

	/*== handler ==*/

	override handleUserPress(event: UserInteractionPointerEventOnCanvas) {
		event = UserInteractionPointerEventOnCanvas.FromEvent(event);
		const canvaPos = event.posCanvas;
		canvaPos && this.sceneObjects.filter(el => ViewBox.intersect(canvaPos, el)).forEach(el => el.pressedBy.push(event.user));
		super.handleUserPress(event);
	}

	override handleUserMove(event: UserInteractionPointerEventOnCanvas) {
		event = UserInteractionPointerEventOnCanvas.FromEvent(event);
		if (event.user.currentPress) {
			this.sceneObjects.filter(obj => obj.pressedBy.includes(event.user)).forEach(obj => obj.onGrab?.(event));
		}
		super.handleUserMove(event);
	}

	override handleUserRelease(event: UserInteractionPointerEventOnCanvas) {
		event = UserInteractionPointerEventOnCanvas.FromEvent(event);
		if (event.user.currentPress) {
			if (event.posCanvas && event.user.currentPress.posCanvas && distance(event.posCanvas, event.user.currentPress.posCanvas) < 10) {
				this.sceneObjects.filter(el => el.pressedBy.includes(event.user)).forEach(el => el?.onClick?.(event))
			}

            this.sceneObjects.forEach(el => removeItem(el.pressedBy, event.user));
		}
		super.handleUserRelease(event);
	}

    handleSceneUpdate?: () => void

	/*== ======= ==*/
}

export default InfiniteCanvas;