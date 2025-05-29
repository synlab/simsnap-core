import { Device } from "../VirtualRoom/Device";
import { DeviceInteractionPointerEventOnCanvas } from "./types";
import { ViewBoxEntity } from "./ViewBoxEntity";

export class CanvasDevice extends Device implements ViewBoxEntity {
    override currentPressStart: DeviceInteractionPointerEventOnCanvas | null = null;
    override currentPress: DeviceInteractionPointerEventOnCanvas | null = null;

    constructor(
        public pos?: {x: number, y: number},
        size?: {width: number, height: number},
        metaData?: { [key: string]: any },
        preId: string = 'canvaDevice'
    ) {
        super(size, metaData, preId);
    }
}

export default CanvasDevice;