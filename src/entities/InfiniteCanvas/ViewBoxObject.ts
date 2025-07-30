import { EventDispatcher } from '../Utils';
import { DeviceInteractionPointerEvent, Id } from '../VirtualRoom/types';
import { ViewBoxEntity } from './types';
import { ViewBoxManager } from './ViewBoxManager';

export type ViewBoxObjectEvents = { 
    click: DeviceInteractionPointerEvent,
    grab: DeviceInteractionPointerEvent
};

/**
 * Representation of a Object with a viewbox in a Canvas context
 *
 * @param pos - the position of the object on the canvas
 * @param size - the size of the viewbox
 * @param metaData - an optional Record of custom any, by string key
 * @param preId - the optional substring to add before the final ID
 */
export class ViewBoxObject<Events extends ViewBoxObjectEvents = ViewBoxObjectEvents> implements ViewBoxEntity {
    private dispatcher = new EventDispatcher<Events>();

    readonly id: Id;

    /** The list of the CanvasDevice currently pressing the object */
    pressedBy: Id[] = [];

    constructor(
        public pos?: {x: number, y: number},
        public size?: {width: number, height: number},
        public metaData?: Record<string, any>,
        preId: string = 'viewBoxObject',
        center?: {x: number, y: number},
    )
    {
        this.id = new Id(preId);
        if (center) this.center = center;
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
        ViewBoxManager.setCenter(point, this);
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

    /*== Dispatcher deleguate ==*/
    public addEventListener = this.dispatcher.addEventListener.bind(this.dispatcher);
    public removeEventListener = this.dispatcher.removeEventListener.bind(this.dispatcher);
    public emit = this.dispatcher.emit.bind(this.dispatcher);
    /*== ==================== ==*/

    /**
     * copy the object
     *
     * @remarks
     * shallow copy on metaData and pressedBy
     * @remarks
     * the id is copied
     */
    copy(): this {
        return structuredClone({ ...this, dispatcher: undefined, addEventListener: undefined, removeEventListener: undefined, emit: undefined, pressedBy: undefined });
    }

    /**
     * Custom JSON serialisation for any transfert object
     *
     */
    toJSON(): object {
        return {
            id: this.id.value,
            pos: this.pos,
            size: this.size,
            metaData: this.metaData,
        };
    }
}

export default ViewBoxObject;
