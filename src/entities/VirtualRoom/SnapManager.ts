import { distance } from "../Utils";
import { Position, DeviceInteractionPointerEvent } from "./types";
import { VirtualRoom } from "./VirtualRoom";

/**
 * Handle the snapping management for virtualRoom
 * @internal
 *
 * @param virtualRoom - the calling virtualRoom
 */
export class SnapManager {
    constructor( private readonly virtualRoom: VirtualRoom ) {
        virtualRoom.addEventListener("deviceRelease", this.manageSnap.bind(this), 1);
    }

    private colorCount = -0.5;
    private colorsList = ['red', 'blue', 'green', 'magenta', 'yellow',  'cyan', 'orange', 'pink', 'lime', 'purple', 'brown'];

    private get color(): string {
        this.colorCount = (this.colorCount+0.5)%this.colorsList.length;
        return this.colorsList[Math.floor(this.colorCount)];
    }

    /** save the starting and ending event of the first touch if a multiple touch across the device is detected */
    private composedPress: { start: DeviceInteractionPointerEvent | null, end: DeviceInteractionPointerEvent | null } = { start: null, end: null };
    
    private pairs: [Position, Position][] = [
        [Position.top, Position.bottom],
        [Position.bottom, Position.top],
        [Position.left, Position.right],
        [Position.right, Position.left],
    ];

    /**
     * Call by VirtualRoom for each release event to detect if a snapping is involved
     *
     * @param event - the released event
     */
    public manageSnap(event: DeviceInteractionPointerEvent) {
        if (this.composedPress.start && this.composedPress.end && event.device.currentPressStart && distance(this.composedPress.start, this.composedPress.end) > 10 && distance(event.device.currentPressStart, event) > 10) {
        // if we already had a touch on the screen, and the distance bewteen start and end for the two touches are big enough
            
            this.checkSnapDevices(this.composedPress.end, event);
            this.checkUnsnapDevices(this.composedPress.start, event.device.currentPressStart);
            this.composedPress.start = null;
            this.composedPress.end = null;
        } else if (this.virtualRoom.devices.filter(device => device !== event.device).some(device => device.currentPress)) {
        // else if a multi touch is detected 

            this.composedPress.start = event.device.currentPressStart
            this.composedPress.end = event;
        } else {
        // else reset multi touch

            this.composedPress.start = null;
            this.composedPress.end = null;
        }
    }
    
    private positionOnViewPort(event: DeviceInteractionPointerEvent): Position[] | null {
        if (!event.device.size) return null;
        const margin = 0.1;
        const position: Position[] = [];
        if (event.x < event.device.size.width * margin) position.push(Position.left);
        if (event.x > event.device.size.width * (1 - margin)) position.push(Position.right);
        if (event.y < event.device.size.height * margin) position.push(Position.top);
        if (event.y > event.device.size.height * (1 - margin)) position.push(Position.bottom);
        
        if (position.length === 0) return [Position.center];
        return position;
    };

    

    private checkSnapDevices(eventEnd1: DeviceInteractionPointerEvent, eventEnd2: DeviceInteractionPointerEvent) {
        const pos1 = this.positionOnViewPort(eventEnd1);
        const pos2 = this.positionOnViewPort(eventEnd2);
        if (pos1 && pos2) this.pairs.forEach(pair => {
            if (pos1.includes(pair[0]) && pos2.includes(pair[1])) {
                eventEnd1.device.emit("snap", { device: eventEnd2.device, position: pair[0], color: this.color });
                eventEnd2.device.emit("snap",{ device: eventEnd1.device, position: pair[1], color: this.color });
                this.virtualRoom.emit("snapDevices", { event1: eventEnd1, event2: eventEnd2 });
            }
        });
    }

    private checkUnsnapDevices(eventStart1: DeviceInteractionPointerEvent, eventStart2: DeviceInteractionPointerEvent) {
        const pos1 = this.positionOnViewPort(eventStart1);
        const pos2 = this.positionOnViewPort(eventStart2);
        if (pos1 && pos2) this.pairs.forEach(pair => {
            if (pos1.includes(pair[0]) && pos2.includes(pair[1])) {
                eventStart1.device.emit("unSnap", { device: eventStart2.device, position: pair[0] });
                eventStart2.device.emit("unSnap", { device: eventStart1.device, position: pair[1] });
                this.virtualRoom.emit("unSnapDevices", { event1: eventStart1, event2: eventStart2 });
            }
        });
    }
}