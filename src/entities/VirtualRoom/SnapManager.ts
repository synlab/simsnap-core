import { distance } from '../Utils';
import Device from './Device';
import { Position, DeviceInteractionPointerEvent, SnapEvent } from './types';
import { VirtualRoom } from './VirtualRoom';

/**
 * Handle the snapping management for virtualRoom
 * @internal
 *
 * @param virtualRoom - the calling virtualRoom
 */
export class SnapManager {
    constructor( protected readonly virtualRoom: VirtualRoom ) {
        virtualRoom.addEventListener('deviceRelease', this.manageSnap.bind(this), 1);
        virtualRoom.addEventListener('removeDevice', this.unSnapAllConnectedDevice.bind(this), 1);
    }

    private colorCount = -1;
    private colorsList = ['red', 'blue', 'green', 'magenta', 'yellow',  'cyan', 'orange', 'pink', 'lime', 'purple', 'brown'];

    private get color(): string {
        this.colorCount = (this.colorCount+1)%this.colorsList.length;
        return this.colorsList[Math.floor(this.colorCount)];
    }

    /** save the starting and ending event of the first touch if a multiple touch across the device is detected */
    private composedPress: { start: DeviceInteractionPointerEvent | null, end: DeviceInteractionPointerEvent | null } = { start: null, end: null };

    /**
     * Call by VirtualRoom for each release event to detect if a snapping is involved
     *
     * @param event - the released event
     */
    public manageSnap(event: DeviceInteractionPointerEvent) {
        if (this.composedPress.start && this.composedPress.end && event.device.currentPressStart && distance(this.composedPress.start, this.composedPress.end) > 50 && distance(event.device.currentPressStart, event) > 50) {
        // if we already had a touch on the screen, and the distance bewteen start and end for the two touches are big enough
            
            this.checkSnapDevices(this.composedPress.end, event);
            this.checkUnsnapDevices(this.composedPress.start, event.device.currentPressStart);
            this.composedPress.start = null;
            this.composedPress.end = null;
        } else if (this.virtualRoom.devices.filter(device => device !== event.device).some(device => device.currentPress)) {
        // else if a multi touch is detected 

            this.composedPress.start = event.device.currentPressStart;
            this.composedPress.end = event;
        } else {
        // else reset multi touch

            this.composedPress.start = null;
            this.composedPress.end = null;
        }
    }

    public getPriorityzedAnchoredDevice<E extends DeviceInteractionPointerEvent>(device1: E, device2: E) {
        if (device1.device.anchorPriority === device2.device.anchorPriority) return null;
        if (device1.device.anchorPriority === null) return { anchored: device2, unAnchored: device1 };
        if (device2.device.anchorPriority === null) return { anchored: device1, unAnchored: device2 };
        return (device1.device.anchorPriority > device2.device.anchorPriority ?
            { anchored: device1, unAnchored: device2 } :
            { anchored: device2, unAnchored: device1 }
        );
    }
    
    protected positionOnViewPort(event: DeviceInteractionPointerEvent): Position | null {
        if (!event.device.size) return null;
        const margin = 0.1;

        const is = {
            top: event.y < event.device.size.height * margin,
            left: event.x < event.device.size.width * margin,
            bottom: event.y > event.device.size.height * (1 - margin),
            right: event.x > event.device.size.width * (1 - margin),
        };

        if (!is.top && !is.bottom) {
            if (is.left) return Position.left;
            if (is.right) return Position.right;
        }
        if (!is.left && !is.right) {
            if (is.top) return Position.top;
            if (is.bottom) return Position.bottom;
        }
        return null;
    };
    
    protected fireEvent(eventType: 'snap' | 'unSnap', event1: DeviceInteractionPointerEvent & { position: Position }, event2: DeviceInteractionPointerEvent & { position: Position }, autoFired: boolean = false){
        const color = eventType === 'snap' ? this.color : undefined;
        const snapEvent1: SnapEvent = { ...event1, snapDevice: event2.device, color, autoFired };
        const snapEvent2: SnapEvent = { ...event2, snapDevice: event1.device, color, autoFired };
        snapEvent1.device.emit(eventType, snapEvent1);
        snapEvent2.device.emit(eventType, snapEvent2);
        this.virtualRoom.emit(`${eventType}Devices`, { event1: snapEvent1, event2: snapEvent2 });
    }

    protected checkSnapDevices(eventEnd1: DeviceInteractionPointerEvent, eventEnd2: DeviceInteractionPointerEvent) {
        const pos1 = this.positionOnViewPort(eventEnd1);
        const pos2 = this.positionOnViewPort(eventEnd2);
        if (pos1 && pos2) this.fireEvent('snap', { ...eventEnd1, position: pos1 }, { ...eventEnd2, position: pos2 });
    }

    protected checkUnsnapDevices(eventStart1: DeviceInteractionPointerEvent, eventStart2: DeviceInteractionPointerEvent) {
        const pos1 = this.positionOnViewPort(eventStart1);
        const pos2 = this.positionOnViewPort(eventStart2);
        if (pos1 && pos2) this.fireEvent('unSnap', { ...eventStart1, position: pos1 }, { ...eventStart2, position: pos2 });

        const unAnchored = this.getPriorityzedAnchoredDevice(eventStart1, eventStart2)?.unAnchored;
        if (unAnchored) unAnchored.device.anchorPriority = null;
    }

    protected unSnapAllConnectedDevice(device: Device) {
        device.snapDevices.forEach((snapEventOut) => {
            snapEventOut.snapDevice.snapDevices.forEach(snapEventIn => {
                if (snapEventIn.snapDevice.id.value == snapEventOut.device.id.value) this.fireEvent('unSnap', snapEventIn, snapEventOut, true);
            });
        });

    }
}
