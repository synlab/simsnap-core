import { Device } from "../VirtualRoom/Device";
import { DeviceInteractionPointerEventOnCanvas } from "./types";
import { ViewBoxEntity } from "./ViewBoxEntity";

export class CanvasDevice<D extends CanvasDevice<D> = CanvasDeviceImpl> extends Device<D> implements ViewBoxEntity {
    override currentPressStart: DeviceInteractionPointerEventOnCanvas<D> | null = null;
    override currentPress: DeviceInteractionPointerEventOnCanvas<D> | null = null;

    constructor(
        public pos?: {x: number, y: number},
        size?: {width: number, height: number},
        metaData?: { [key: string]: any },
        preId: string = 'canvaDevice'
    ) {
        super(size, metaData, preId);
    }
}

class CanvasDeviceImpl extends CanvasDevice<CanvasDevice>{};
export default CanvasDevice;