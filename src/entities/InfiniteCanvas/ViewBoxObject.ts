import { DeviceInteractionPointerEvent, Id } from "../VirtualRoom/types";
import { ViewBoxEntity } from "./types";

/**
 * Representation of a Object with a viewbox in a Canvas context
 *
 * @param pos - the position of the object on the canvas
 * @param size - the size of the viewbox
 * @param metaData - an optional Record of custom any, by string key
 * @param preId - the optional substring to add before the final ID
 */
export class ViewBoxObject implements ViewBoxEntity {
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

    /**
     * copy the object
     *
     * @remarks
     * shallow copy on metaData and pressedBy
     * @remarks
     * the id is not copied
     */
    copy(): ViewBoxObject {
        const newObj = new ViewBoxObject(structuredClone(this.pos), structuredClone(this.size), this.metaData)
        newObj.pressedBy = structuredClone(this.pressedBy);
        return newObj;
    }

    /*=============================================================================================*/
    /*                                      event listenner                                        */
    /*=============================================================================================*/

    /**
     * CallBack triggered when the object has been clicked
     * @eventProperty
     *
     * @param event - the released event
     */
    onClick?: (event: DeviceInteractionPointerEvent)=>void;

    /**
     * CallBack triggered when the object is being grab
     * @eventProperty
     *
     * @param event - the move event
     */
    onGrab?: (event: DeviceInteractionPointerEvent)=>void;
}

export default ViewBoxObject;