import { SnapManager } from '../VirtualRoom/SnapManager';
import { DeviceInteractionPointerEvent, Position, SnapDevicesEvent, SnapEvent } from '../VirtualRoom/types';
import InfiniteCanvas from './InfiniteCanvas';
import { SnapCanvasEvent, SnapDevicesCanvasEvent } from './types';

export type InfiniteCanvasSnapManagerEvent = { 
    snapDevicesOnCanvas: SnapDevicesCanvasEvent;
    unSnapDevicesOnCanvas: SnapDevicesCanvasEvent;
};

/**
 * Handle the snapping management for virtualRoom
 * @internal
 *
 * @param virtualRoom - the calling virtualRoom
 */
export class InfiniteCanvasSnapManager extends SnapManager {
    constructor( protected override readonly virtualRoom: InfiniteCanvas ) {
        super(virtualRoom);
        virtualRoom.addEventListener('snapDevices', (event) => this.handleSnapTo(event, 'snapDevicesOnCanvas'));
        virtualRoom.addEventListener('unSnapDevices', (event) => this.handleSnapTo(event, 'unSnapDevicesOnCanvas'));
        virtualRoom.addEventListener('snapDevicesOnCanvas', this.handleSnapDevicesOnCanvas.bind(this));
        virtualRoom.addEventListener('unSnapDevicesOnCanvas', this.handleUnSnapDevicesOnCanvas.bind(this));
    }

    private pairs: [Position, Position][] = [
        [Position.top, Position.bottom],
        [Position.bottom, Position.top],
        [Position.left, Position.right],
        [Position.right, Position.left],
    ];

    /**
     * Convert a SnapEvent to a SnapCanvasEvent
     * 
     * @param event - The event to convert
     */
    public toSnapCanvasEvent(event: SnapEvent): SnapCanvasEvent | undefined {
        const device = this.virtualRoom.devices.find(d => d.id == event.device.id);
        const snapDevice = this.virtualRoom.devices.find(d => d.id == event.snapDevice.id);
        if (device && snapDevice) return new SnapCanvasEvent(device, event.x, event.y, snapDevice, event.position, event.color, event.autoFired);
    }

    /**
     * Handle a snap event to dispatch it on Canvas
	 * 
	 * @param snapEvent - The event to handle
	 * @param eventType - The event type to transfert
     */
	private handleSnapTo(event: SnapDevicesEvent, eventType: 'snapDevicesOnCanvas' | 'unSnapDevicesOnCanvas') {
		const event1 = this.toSnapCanvasEvent(event.event1);
		const event2 = this.toSnapCanvasEvent(event.event2);
		if (event1 && event2) this.virtualRoom.emit(eventType, { event1, event2 });
	}

    private cleanUnAnchored(event1: DeviceInteractionPointerEvent, event2: DeviceInteractionPointerEvent){
        const unAnchor = this.getPriorityzedAnchoredDevice(event1, event2)?.unAnchored;
        const unAnchored = unAnchor && this.virtualRoom.pointerManager?.toDeviceInteractionPointerEventOnCanvas(unAnchor);
        if (unAnchored) {
            this.unSnapAllConnectedDevice(unAnchored.device);
            unAnchored.device.pos = undefined;
        }
    }

    protected override checkSnapDevices(eventEnd1: DeviceInteractionPointerEvent, eventEnd2: DeviceInteractionPointerEvent) {
        const pos1 = this.positionOnViewPort(eventEnd1);
        const pos2 = this.positionOnViewPort(eventEnd2);
        if (this.pairs.find(([p1, p2]) => p1 === pos1 && p2 === pos2)){
            this.cleanUnAnchored(eventEnd1, eventEnd2);
            super.checkSnapDevices(eventEnd1, eventEnd2);
        }
    }

    protected override checkUnsnapDevices(eventStart1: DeviceInteractionPointerEvent, eventStart2: DeviceInteractionPointerEvent) {
        const pos1 = this.positionOnViewPort(eventStart1);
        const pos2 = this.positionOnViewPort(eventStart2);
        if (
            this.pairs.find(([p1, p2]) => p1 === pos1 && p2 === pos2)
            && !eventStart1.device.snapDevices.map(({device})=>device.id.value).includes(eventStart2.device.id.value)
            && !eventStart2.device.snapDevices.map(({device})=>device.id.value).includes(eventStart1.device.id.value)
        ) {
            super.checkUnsnapDevices(eventStart1, eventStart2);
            this.cleanUnAnchored(eventStart1, eventStart2);
        };
    }

    protected handleSnapDevicesOnCanvas(event: SnapDevicesCanvasEvent) {
        if (event.event1.autoFired || event.event2.autoFired) return;

        const prio = this.getPriorityzedAnchoredDevice(event.event1, event.event2);
        
        if (!prio) return;

        const { anchored, unAnchored } = prio;
        const unAnchoredDevice = unAnchored.device;

        if (!unAnchoredDevice.size || !anchored.device.pos || !anchored.device.size) return;

        let x, y: number;
        switch (unAnchored.position){
            case Position.top:
                x = anchored.x - unAnchored.x;
                y = anchored.device.size.height;
                break;
            case Position.left:
                x = anchored.device.size.width;
                y = anchored.y - unAnchored.y;
                break;
            case Position.bottom:
                x = anchored.x - unAnchored.x;
                y = -unAnchoredDevice.size.height;
                break;
            case Position.right:
                x = -unAnchoredDevice.size.width;
                y = anchored.y - unAnchored.y;
                break;
        }
        
        unAnchoredDevice.pos = { x: anchored.device.pos.x + x, y: anchored.device.pos.y + y };

        const margin = 100;
        this.virtualRoom.devices.forEach(device => {
            if (device.id.value === unAnchoredDevice.id.value || !unAnchoredDevice.pos || !unAnchoredDevice.size || !device.pos || !device.size || !device.center) return;
            if (unAnchoredDevice.isIntersectViewBox(device, margin/2) && !unAnchoredDevice.snapDevices.find(d => d.snapDevice.id.value === device.id.value)) {
                let position: Position | null = null;
                if (unAnchoredDevice.pos.x + margin > device.pos.x + device.size.width) position = Position.left;
                if (unAnchoredDevice.pos.x + unAnchoredDevice.size.width < device.pos.x + margin) position = Position.right;
                if (unAnchoredDevice.pos.y + margin > device.pos.y + device.size.height) position = Position.top;
                if (unAnchoredDevice.pos.y + unAnchoredDevice.size.height < device.pos.y + margin) position = Position.bottom;

                const position2 = this.pairs.find(([pos]) => pos === position)?.[1];
                if (position && position2) {
                    this.fireEvent('snap', { ...unAnchored, position }, { device, ...device.center, position: position2 }, true);
                }
            };
        });
    }

    protected handleUnSnapDevicesOnCanvas(event: SnapDevicesCanvasEvent) {
        const unAnchored = this.getPriorityzedAnchoredDevice(event.event1, event.event2)?.unAnchored;
        if (unAnchored) unAnchored.device.pos = undefined;
    }
}
