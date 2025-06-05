import { EventDispatcher } from "../VirtualRoom/EventDispatcher";
import { DeviceInteractionPointerEvent, Id } from "../VirtualRoom/types";
import { ViewBoxEntity } from "./types";

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
export class ViewBoxObject implements ViewBoxEntity {
    protected dispatcher = new EventDispatcher<ViewBoxObjectEvents>();

    readonly id: Id;

    /** The list of the CanvasDevice currently pressing the object */
    pressedBy: Id[] = [];

    constructor(
        public pos?: {x: number, y: number},
        public size?: {width: number, height: number},
        public metaData?: Record<string, any>,
        preId: string = 'viewBoxObject',)
    {
        this.id = new Id(preId);
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
    copy(): ViewBoxObject {
        const newObj = new ViewBoxObject(structuredClone(this.pos), structuredClone(this.size), this.metaData)
        newObj.pressedBy = structuredClone(this.pressedBy);
        (newObj.id as {value: string}).value = this.id.value;
        return newObj;
    }
}

export default ViewBoxObject;