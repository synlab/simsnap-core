import { UserInteractionPointerEvent } from "../VirtualRoom/types";
import CanvasUser from "./CanvasUser";

export class UserInteractionPointerEventOnCanvas implements UserInteractionPointerEvent {
    static FromEvent(event: UserInteractionPointerEventOnCanvas){
        return new UserInteractionPointerEventOnCanvas(event.user, event.x, event.y)
    }

    constructor(
        public readonly user: CanvasUser,
        public readonly x: number,
        public readonly y: number,
    ) { }

    get canvaX() {
        return this.user.pos && this.x + this.user.pos.x;
    }

    get canvaY() {
        return this.user.pos && this.y + this.user.pos.y;
    }

    get posCanvas() {
        return this.canvaX && this.canvaY ? { x: this.canvaX, y: this.canvaY } : undefined;
    }
}