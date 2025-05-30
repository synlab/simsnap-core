import { DeviceInteractionPointerEvent } from "../VirtualRoom/types";
import { CanvasDevice } from "./CanvasDevice";
import { ViewBoxEntity } from "./ViewBoxEntity";

export class ViewBoxObject<D extends CanvasDevice<D> = CanvasDevice> implements ViewBoxEntity {
    private static CountId = 0;
    readonly id: string;
    pressedBy: D[] = [];

    constructor(
        public pos?: {x: number, y: number},
        public size?: {width: number, height: number},
        public metaData?: { [key: string]: any },
        preId: string = 'viewBoxObject',)
    {
        this.id = `${preId}-${ViewBoxObject.CountId++}`;
    }

    copy(): this {
        return structuredClone(this);
    }

    /*== event listenner ==*/

    onClick?: (event: DeviceInteractionPointerEvent<D>)=>void;
    onGrab?: (event: DeviceInteractionPointerEvent<D>)=>void;

    /*== =============== ==*/
}

export default ViewBoxObject;