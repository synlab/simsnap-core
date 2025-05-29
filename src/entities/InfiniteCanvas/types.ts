import { DeviceInteractionPointerEvent } from "../VirtualRoom/types";
import CanvasDevice from "./CanvasDevice";

export class DeviceInteractionPointerEventOnCanvas implements DeviceInteractionPointerEvent {
    static FromEvent(event: DeviceInteractionPointerEventOnCanvas){
        return new DeviceInteractionPointerEventOnCanvas(event.device, event.x, event.y)
    }

    constructor(
        public readonly device: CanvasDevice,
        public readonly x: number,
        public readonly y: number,
    ) { }

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