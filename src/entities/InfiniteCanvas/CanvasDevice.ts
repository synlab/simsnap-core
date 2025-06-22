import { Device, DeviceEvents } from "../VirtualRoom/Device";
import { DeviceInteractionPointerEventOnCanvas, ViewBoxEntity } from "./types";
import ViewBoxObject from "./ViewBoxObject";
import { ViewBoxManager } from "./ViewBoxManager";
import ViewBoxObject from "./ViewBoxObject";


export type CanvasDeviceEvents = DeviceEvents & { 
    sceneUpdate: ViewBoxObject[],
};

/**
 * Represent an entity having a viewBox
 *
 * @param pos - the position of the object on the canvas
 * @param size - the size of the viewport of the device
 * @param metaData - an optional Record of custom any, by string key
 * @param preId - the optional substring to add before the final ID
 */
export class CanvasDevice<Events extends CanvasDeviceEvents = CanvasDeviceEvents> extends Device<Events> implements ViewBoxEntity {
    /** The press event of the current active pointer event, initialized directly on press */
    override currentPressStart: DeviceInteractionPointerEventOnCanvas | null = null;
    /** The press/move event of the current pointer event, initialized directly on press and updated on move */
    override currentPress: DeviceInteractionPointerEventOnCanvas | null = null;

    constructor(
        public pos?: {x: number, y: number},
        size?: {width: number, height: number},
        metaData?: Record<string, any>,
        preId: string = 'canvaDevice'
    ) {
        super(size, metaData, preId);
    }

    /**
     * Get the center of the viewbox of the entity
     *
     * @remarks
     * deleguate to ViewBoxManager
     * @see {@link ViewBoxManager.getCenter}
     */
    get center(): { x: number, y: number } | undefined {
        return ViewBoxManager.getCenter(this);
    }

    /**
     * Move the entity to fit the center on the point
     *
     * @param point - the point to set the center of the entity on
     * 
     * @remarks
     * deleguate to ViewBoxManager
     * @see {@link ViewBoxManager.setCenter}
     */
    set center(point: { x: number, y: number }) {
        ViewBoxManager.setCenter(point, this)
    }
        

    /**
     * Check if a point intersect with the current viewBox
     * 
     * @param point - the point to check intersection
     *
     * @remarks
     * deleguate to ViewBoxManager
     * @see {@link ViewBoxManager.intersect}
     */
    public isIntersect(point: {x: number, y: number}): boolean {
        return ViewBoxManager.intersect(point, this);
    }

    /**
     * Check if a viewBox intersect the current viewBox
     * 
     * @param viewbox - the viewBox to check intersection with
     *
     * @remarks
     * deleguate to ViewBoxManager
     * @see {@link ViewBoxManager.intersectViewBox}
     */
    public isIntersectViewBox(viewbox: ViewBoxEntity): boolean {
        return ViewBoxManager.intersectViewBox(this, viewbox);
    }

    /**
     * Return the projection of a ViewBoxObject on the device coordinate
     * 
     * @param viewbox - the ViewBoxObject to project
     */
    public getProjectedViewBox(viewbox: ViewBoxObject): ViewBoxObject {
        const newViewbox = viewbox.copy();
        if (newViewbox.pos && this.pos) newViewbox.pos = { x: newViewbox.pos.x - this.pos.x, y: newViewbox.pos.y - this.pos.y };
        return newViewbox;
    }

    /**
     * Get the center of the viewbox of the entity
     *
     * @remarks
     * deleguate to ViewBoxManager
     * @see {@link ViewBoxManager.getCenter}
     */
    get center(): { x: number, y: number } | undefined {
        return ViewBoxManager.getCenter(this);
    }

    /**
     * Move the entity to fit the center on the point
     *
     * @param point - the point to set the center of the entity on
     * 
     * @remarks
     * deleguate to ViewBoxManager
     * @see {@link ViewBoxManager.setCenter}
     */
    set center(point: { x: number, y: number }) {
        ViewBoxManager.setCenter(point, this)
    }
        

    /**
     * Check if a point intersect with the current viewBox
     * 
     * @param point - the point to check intersection
     *
     * @remarks
     * deleguate to ViewBoxManager
     * @see {@link ViewBoxManager.intersect}
     */
    public isIntersect(point: {x: number, y: number}): boolean {
        return ViewBoxManager.intersect(point, this);
    }

    /**
     * Check if a viewBox intersect the current viewBox
     * 
     * @param viewbox - the viewBox to check intersection with
     *
     * @remarks
     * deleguate to ViewBoxManager
     * @see {@link ViewBoxManager.intersectViewBox}
     */
    public isIntersectViewBox(viewbox: ViewBoxEntity): boolean {
        return ViewBoxManager.intersectViewBox(this, viewbox);
    }

    /**
     * Return the projection of a ViewBoxObject on the device coordinate
     * 
     * @param viewbox - the ViewBoxObject to project
     */
    public getProjectedViewBox(viewbox: ViewBoxObject): ViewBoxObject {
        const newViewbox = viewbox.copy();
        if (newViewbox.pos && this.pos) newViewbox.pos = { x: newViewbox.pos.x - this.pos.x, y: newViewbox.pos.y - this.pos.y };
        return newViewbox;
    }
}

export default CanvasDevice;