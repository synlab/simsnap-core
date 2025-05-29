import { distance } from "../Utils";
import { Position, UserInteractionPointerEvent } from "./types";
import { VirtualRoom } from "./VirtualRoom";

export class SnapManager {
    constructor(private readonly virtualRoom: VirtualRoom) { }

    private composedPress: { start: UserInteractionPointerEvent | null, end: UserInteractionPointerEvent | null } = { start: null, end: null };
    
    private pairs: [Position, Position][] = [
        [Position.top, Position.bottom],
        [Position.bottom, Position.top],
        [Position.left, Position.right],
        [Position.right, Position.left],
    ];

    public manageSnap(event: UserInteractionPointerEvent) {
        if (this.composedPress.start && this.composedPress.end && event.user.currentPressStart && distance(this.composedPress.start, this.composedPress.end) > 10 && distance(event.user.currentPressStart, event) > 10) {
            this.checkSnapUsers(this.composedPress.end, event);
            this.checkUnsnapUsers(this.composedPress.start, event.user.currentPressStart);
            this.composedPress.start = null;
            this.composedPress.end = null;
        } else if (this.virtualRoom.users.filter(u => u !== event.user).some(u => u.currentPress)) {
            this.composedPress.start = event.user.currentPressStart
            this.composedPress.end = event;
        } else {
            this.composedPress.start = null;
            this.composedPress.end = null;
        }
    }
    
    private positionOnViewPort(event: UserInteractionPointerEvent): Position[] | null {
        if (!event.user.size) return null;
        const margin = 0.1;
        const position: Position[] = [];
        if (event.x < event.user.size.width * margin) position.push(Position.left);
        if (event.x > event.user.size.width * (1 - margin)) position.push(Position.right);
        if (event.y < event.user.size.height * margin) position.push(Position.top);
        if (event.y > event.user.size.height * (1 - margin)) position.push(Position.bottom);
        
        if (position.length === 0) return [Position.center];
        return position;
    };

    

    private checkSnapUsers(eventEnd1: UserInteractionPointerEvent, eventEnd2: UserInteractionPointerEvent) {
        const pos1 = this.positionOnViewPort(eventEnd1);
        const pos2 = this.positionOnViewPort(eventEnd2);
        if (pos1 && pos2) this.pairs.forEach(pair => {
            if (pos1.includes(pair[0]) && pos2.includes(pair[1])) {
                eventEnd1.user.snapTo(eventEnd2.user, pair[0]);
                eventEnd2.user.snapTo(eventEnd1.user, pair[1]);
                this.virtualRoom.onSnapUsers?.(eventEnd1, eventEnd2);
            }
        });
    }

    private checkUnsnapUsers(eventStart1: UserInteractionPointerEvent, eventStart2: UserInteractionPointerEvent) {
        const pos1 = this.positionOnViewPort(eventStart1);
        const pos2 = this.positionOnViewPort(eventStart2);
        if (pos1 && pos2) this.pairs.forEach(pair => {
            if (pos1.includes(pair[0]) && pos2.includes(pair[1])) {
                eventStart1.user.unSnapTo(eventStart2.user, pair[0]);
                eventStart2.user.unSnapTo(eventStart1.user, pair[1]);
                this.virtualRoom.onUnSnapUsers?.(eventStart1, eventStart2);
            }
        });
    }
}