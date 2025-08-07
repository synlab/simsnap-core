import { DeviceInteractionPointerEvent, Position, SnapDevicesEvent, SnapEvent } from '../VirtualRoom/types';
import CanvasDevice from './CanvasDevice';

/**
 * Represent an entity having a viewBox
 *
 * @param pos - the position of the object on the canvas
 * @param size - the size of the viewbox
 * @param center - the center of the viewbox
 */
export interface ViewBoxEntity {
    pos?: { x: number; y: number };
    size?: {width: number, height: number};
    center?: { x: number; y: number };
    
    /**
     * Check if a point intersect with the current viewBox
     * 
     * @param point - the point to check intersection
     *
     * @remarks
     * deleguate to ViewBoxManager
     * @see {@link ViewBoxManager.intersect}
     */
    isIntersect(point: {x: number, y: number}): boolean;

    /**
     * Check if a viewBox intersect the current viewBox
     * 
     * @param viewbox - the viewBox to check intersection with
     *
     * @remarks
     * deleguate to ViewBoxManager
     * @see {@link ViewBoxManager.intersectViewBox}
     */
    isIntersectViewBox(viewbox: ViewBoxEntity): boolean;
}

/**
 * Represent an Event triggered on a pointer event i.e Press | Move | Release
 *
 * @param device - the CanvasDevice responsible of the event
 * @param x - the x position on the device screen
 * @param y - the y position on the device screen
 */
export class DeviceInteractionPointerEventOnCanvas implements DeviceInteractionPointerEvent {
    constructor(
        public readonly device: CanvasDevice,
        public readonly x: number,
        public readonly y: number,
    ) { }

    get canvaX(): number | undefined {
        return this.device.pos && this.x + this.device.pos.x;
    }

    get canvaY(): number | undefined {
        return this.device.pos && this.y + this.device.pos.y;
    }

    get posCanvas(): { x: number, y: number } | undefined {
        return this.canvaX && this.canvaY ? { x: this.canvaX, y: this.canvaY } : undefined;
    }
}

/**
 * Represent an Event triggered when two Device snaped or unSnaped on a Infinite Canvas
 *
 * @param event1 - the first snaped device event
 * @param event2 - the second snaped device event
 * 
 * @remarks
 * for snapEvent, the event are the release event - for unSnap, the event are the press event
 */
export interface SnapDevicesCanvasEvent extends SnapDevicesEvent {
    readonly event1: SnapCanvasEvent,
    readonly event2: SnapCanvasEvent,
}

/**
 * Represent an Event triggered on the device when snaped or unSnaped with an other one on a InfinitCanvas
 *
 * @param device - The device the current device has been snaped/unSnaped with
 * @param position - The position of the snap on the current device
 */
export class SnapCanvasEvent extends DeviceInteractionPointerEventOnCanvas implements SnapEvent {
    constructor(
        device: CanvasDevice,
        x: number,
        y: number,
        readonly snapDevice: CanvasDevice,
        readonly position: Position,
        readonly color?: string,
        readonly autoFired: boolean = false,
    ) { super(device, x, y); }
}
