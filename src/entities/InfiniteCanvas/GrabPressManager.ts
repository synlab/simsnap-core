import InfiniteCanvas from './InfiniteCanvas';
import { DeviceInteractionPointerEventOnCanvas } from './types';
import { distance } from '../Utils';

export type GrabManagerViewBoxEvent = { 
    click: DeviceInteractionPointerEventOnCanvas,
    grab: DeviceInteractionPointerEventOnCanvas
};

/**
 * Handle the grap and press obejct management for infiniteCanvas
 * @internal
 *
 * @param virtualRoom - the calling virtualRoom
 */
export class GrabPressManager {
    constructor( private readonly infiniteCanvas: InfiniteCanvas ) {
        infiniteCanvas.addEventListener('devicePressOnCanvas', this.managePressObject.bind(this));
        infiniteCanvas.addEventListener('deviceMoveOnCanvas', this.manageGrabMoveObject.bind(this));
        infiniteCanvas.addEventListener('deviceReleaseOnCanvas', this.managePressReleaseObject.bind(this));
    }

    /**
     * Handle a possible press object
     *
     * @param event - the released event
     */
    protected managePressObject(event: DeviceInteractionPointerEventOnCanvas) {
        const canvaPos = event.posCanvas;
		if (canvaPos) this.infiniteCanvas.sceneObjects.forEach(obj => {
            if (obj.isIntersect(canvaPos)) obj.pressedBy[event.device.id.value] = event;
            Object.values(obj.grabedBy).forEach(oldGrabEvent=>{ 
                if (!obj.pressedBy[oldGrabEvent.device.id.value] && oldGrabEvent.posCanvas && event.posCanvas && distance(oldGrabEvent.posCanvas, event.posCanvas) < 100) {
                    obj.pressedBy[event.device.id.value] = event;
                }
            })
        });
    }

    /**
     * Handle a possible grab object
     *
     * @param event - the released event
     */
    protected manageGrabMoveObject(event: DeviceInteractionPointerEventOnCanvas) {
        this.infiniteCanvas.sceneObjects
            .forEach(obj => {
                if ( obj.pressedBy[event.device.id.value] ) {
                    obj.pressedBy[event.device.id.value] = event;
                    obj.grabedBy[event.device.id.value] = event;
                }
        });
    }

    /**
     * Handle a possible release of a pressed object
     *
     * @param event - the released event
     */
    protected managePressReleaseObject(event: DeviceInteractionPointerEventOnCanvas) {
        const clickEvent = !!(event.posCanvas && event.device.currentPressStart?.posCanvas && distance(event.posCanvas, event.device.currentPressStart.posCanvas) < 10);
        this.infiniteCanvas.sceneObjects.forEach(obj => {
            if (obj.pressedBy[event.device.id.value]){
                delete obj.pressedBy[event.device.id.value];
                setTimeout(() => {
                    delete obj.grabedBy[event.device.id.value];
                }, 1000);
                if (clickEvent) obj.emit('click', event);
            }
        })
    }
}
