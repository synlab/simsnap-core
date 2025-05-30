import { DeviceInteractionPointerEvent } from "../VirtualRoom/types";
import { CanvasDevice } from "./CanvasDevice";

export class DeviceInteractionPointerEventOnCanvas<D extends CanvasDevice<D> = CanvasDevice> extends DeviceInteractionPointerEvent<D> {
    constructor(
        public override readonly device: D,
        public readonly x: number,
        public readonly y: number,
    ) {
        super(device, x, y);
     }

    get canvaX() {
        return this.device.pos && this.x + this.device.pos.x;
    }

    get canvaY() {
        return this.device.pos && this.y + this.device.pos.y;
    }

    get posCanvas() {
        return this.canvaX && this.canvaY ? { x: this.canvaX, y: this.canvaY } : undefined;
    }
}