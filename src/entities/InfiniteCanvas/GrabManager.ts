import InfiniteCanvas from "./InfiniteCanvas";
import { DeviceInteractionPointerEventOnCanvas } from "./types";
import { distance } from "../Utils";
import ViewBoxObject from "./ViewBoxObject";

/**
 * Handle the grap and press obejct management for infiniteCanvas
 * @internal
 *
 * @param virtualRoom - the calling virtualRoom
 */
export class GrabPressManager {
    private currentGrabObjects: [DeviceInteractionPointerEventOnCanvas, ViewBoxObject][] = [];

    constructor( private readonly infiniteCanvas: InfiniteCanvas ) {
        infiniteCanvas.addEventListener("devicePressOnCanvas", this.managePressObject.bind(this));
        infiniteCanvas.addEventListener("deviceMoveOnCanvas", this.manageGrabMoveObject.bind(this));
        infiniteCanvas.addEventListener("deviceReleaseOnCanvas", this.managePressReleaseObject.bind(this));
    }

    /**
     * Handle a possible press object
     *
     * @param event - the released event
     */
    public managePressObject(event: DeviceInteractionPointerEventOnCanvas) {
        const canvaPos = event.posCanvas;
		if (canvaPos) this.infiniteCanvas.sceneObjects.filter(el => el.isIntersect(canvaPos)).forEach(el => el.pressedBy.push(event.device.id));
        this.currentGrabObjects.forEach(([oldEvent, obj]) => {
            if (!obj.pressedBy.length && oldEvent.posCanvas && event.posCanvas && distance(oldEvent.posCanvas, event.posCanvas) < 100) {
                obj.pressedBy.push(event.device.id);
            }
        })
    }

    /**
     * Handle a possible grab object
     *
     * @param event - the released event
     */
    public manageGrabMoveObject(event: DeviceInteractionPointerEventOnCanvas) {
        this.infiniteCanvas.sceneObjects
            .filter(obj => obj.pressedBy.includes(event.device.id))
            .forEach(obj => {
                obj.emit('grab', event);
                const currentGrabObject = this.currentGrabObjects.find(([e, o])=>e.device.id === event.device.id && o.id === obj.id);
                if (currentGrabObject) {
                    currentGrabObject[0] = event
                } else {
                    this.currentGrabObjects.push([event, obj]);
                }
        });
    }

    /**
     * Handle a possible release of a pressed object
     *
     * @param event - the released event
     */
    public managePressReleaseObject(event: DeviceInteractionPointerEventOnCanvas) {
        if (event.device.currentPress) {
            // click //
			if (event.posCanvas && event.device.currentPress.posCanvas && distance(event.posCanvas, event.device.currentPress.posCanvas) < 10) {
				this.infiniteCanvas.sceneObjects.filter(el => el.pressedBy.includes(event.device.id)).forEach(el => el.emit('click', event))
			}
            this.infiniteCanvas.sceneObjects.forEach(obj => {
                obj.pressedBy = obj.pressedBy.filter(id => id !== event.device.id)
                setTimeout(()=>{
                    this.currentGrabObjects = this.currentGrabObjects.filter(([e, o])=>e.device.id !== event.device.id || o.id !== obj.id);
                }, 1000);
            });
		}
    }
}