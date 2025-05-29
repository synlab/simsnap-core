import { DeviceInteractionPointerEvent } from "../VirtualRoom/types";
import CanvasDevice from "./CanvasDevice";
import { ViewBoxEntity } from "./ViewBoxEntity";

export class ViewBoxObject implements ViewBoxEntity {
    private static CountId = 0;
    readonly id: string;
    pressedBy: CanvasDevice[] = [];

    constructor(
        public pos?: {x: number, y: number},
        public size?: {width: number, height: number},
        public metaData?: { [key: string]: any },
        preId: string = 'viewBoxObject',)
    {
        this.id = `${preId}-${ViewBoxObject.CountId++}`;
    }

    copy(): ViewBoxObject {
        const newObject = new ViewBoxObject(this.pos && {...this.pos}, this.size && {...this.size}, this.metaData);
        return newObject;
    }

    /*== event listenner ==*/

    onClick?: (event: DeviceInteractionPointerEvent)=>void;
    onGrab?: (event: DeviceInteractionPointerEvent)=>void;

    /*== =============== ==*/
}

export default ViewBoxObject;