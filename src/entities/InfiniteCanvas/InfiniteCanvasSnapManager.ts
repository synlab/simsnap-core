import { SnapManager } from '../VirtualRoom/SnapManager';
import { DeviceInteractionPointerEvent, Position, SnapDevicesEvent, SnapEvent } from '../VirtualRoom/types';
import CanvasDevice from './CanvasDevice';
import InfiniteCanvas from './InfiniteCanvas';
import { SnapCanvasEvent, SnapDevicesCanvasEvent } from './types';

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

    /**
     * Convert a SnapEvent to a SnapCanvasEvent
     * 
     * @param event - The event to convert
     */
    public toSnapCanvasEvent(event: SnapEvent) {
        const device = this.virtualRoom.devices.find(d => d.id == event.device.id);
        const snapDevice = this.virtualRoom.devices.find(d => d.id == event.snapDevice.id);
        if (device && snapDevice) return new SnapCanvasEvent(device, event.x, event.y, snapDevice, event.position, event.color);
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

    private pairs: [Position, Position][] = [
        [Position.top, Position.bottom],
        [Position.bottom, Position.top],
        [Position.left, Position.right],
        [Position.right, Position.left],
    ];

    protected override checkSnapDevices(eventEnd1: DeviceInteractionPointerEvent, eventEnd2: DeviceInteractionPointerEvent) {
        const pos1 = this.positionOnViewPort(eventEnd1);
        const pos2 = this.positionOnViewPort(eventEnd2);
        if (this.pairs.find(([p1, p2])=> p1 === pos1 && p2 === pos2)){
            const unAnchor = this.getPriorityzedAnchoredDevice(eventEnd1, eventEnd2)?.unAnchored
            const unAnchored = unAnchor && this.virtualRoom.toDeviceInteractionPointerEventOnCanvas(unAnchor);
            if (unAnchored) {
                this.unSnapAllConnectedDevice(unAnchored.device);
                unAnchored.device.pos = undefined;
            }

            super.checkSnapDevices(eventEnd1, eventEnd2);
        }
    }

    protected override checkUnsnapDevices(eventStart1: DeviceInteractionPointerEvent, eventStart2: DeviceInteractionPointerEvent) {
        const pos1 = this.positionOnViewPort(eventStart1);
        const pos2 = this.positionOnViewPort(eventStart2);
        if (this.pairs.find(([p1, p2])=> p1 === pos1 && p2 === pos2)) super.checkUnsnapDevices(eventStart1, eventStart2);
    }

    protected handleSnapDevicesOnCanvas(event: SnapDevicesCanvasEvent) {
        console.log("handleSnapDevicesOnCanvas")
        const prio = this.getPriorityzedAnchoredDevice(event.event1, event.event2);
        if (!prio) return;
        const { anchored, unAnchored } = prio
        
        if (unAnchored.device.size && anchored.device.pos && anchored.device.size){
            const { x, y } = (() => {
                switch (unAnchored.position){
                    case Position.top:
                        return {
                            x: anchored.x - unAnchored.x,
                            y: anchored.device.size.height,
                        };
                    case Position.left:
                        return {
                            x: anchored.device.size.width,
                            y: anchored.y - unAnchored.y,
                        };
                    case Position.bottom:
                        return {
                            x: anchored.x - unAnchored.x,
                            y: -unAnchored.device.size.height,
                        };
                    case Position.right:
                        return {
                            x: -unAnchored.device.size.width,
                            y: anchored.y - unAnchored.y,
                        };
                }
            })();
            unAnchored.device.pos = { x: anchored.device.pos.x + x, y: anchored.device.pos.y + y };
        };
    }

    protected handleUnSnapDevicesOnCanvas(event: SnapDevicesCanvasEvent) {
        const unAnchored = this.getPriorityzedAnchoredDevice(event.event1, event.event2)?.unAnchored;
        if (unAnchored) unAnchored.device.pos = undefined;
    }
}
