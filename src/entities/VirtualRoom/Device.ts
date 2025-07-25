import { EventDispatcher } from './EventDispatcher';
import { Position, DeviceInteractionPointerEvent, Id, SnapEvent } from './types';
import { VirtualRoom } from './VirtualRoom';

export type DeviceEvents = {
    pointerPress: DeviceInteractionPointerEvent;
    pointerMove: DeviceInteractionPointerEvent;
    pointerRelease: DeviceInteractionPointerEvent;
    sizeChanged: { width: number, height: number };
    anchorPriorityChanged: number;
    snap: SnapEvent;
    unSnap: SnapEvent;
};

/**
 * Representation of a Device
 * 
 * @param size - the size of the viewport of the device
 * @param metaData - an optional Record of custom any, by string key
 * @param preId - the optional substring to add before the final ID
 */
export class Device<Events extends DeviceEvents = DeviceEvents> {
    private dispatcher = new EventDispatcher<Events>();
    
    readonly id: Id;

    /** The press event of the current active pointer event, initialized directly on press */
    currentPressStart: DeviceInteractionPointerEvent | null = null;
    /** The press/move event of the current pointer event, initialized directly on press and updated on move */
    currentPress: DeviceInteractionPointerEvent | null = null;

    /** The currents devices that are snap with this */
    snapDevices: SnapEvent[] = [];

    constructor(
        public size?: { width: number; height: number; },
        public metaData?: Record<string, any>,
        public anchorPriority: number | null = null,
        preId: string = 'device',
    ) {
        this.id = new Id(preId);

        /*== Link internal handlers ==*/
        this.addEventListener('snap', this.handleSnapTo.bind(this));
        this.addEventListener('unSnap', this.handleUnSnapTo.bind(this));
        this.addEventListener('pointerPress', this.handlePress.bind(this));
        this.addEventListener('pointerMove', this.handleMove.bind(this));
        this.addEventListener('pointerRelease', this.handleRelease.bind(this));
        this.addEventListener('sizeChanged', this.handleSizeChanged.bind(this));
        this.addEventListener('anchorPriorityChanged', this.handleAnchorPriorityChanged.bind(this));
        /*== ====================== ==*/
    }

    /*== Dispatcher deleguate ==*/
    public addEventListener = this.dispatcher.addEventListener.bind(this.dispatcher);
    public removeEventListener = this.dispatcher.removeEventListener.bind(this.dispatcher);
    public emit = this.dispatcher.emit.bind(this.dispatcher);
    /*== ==================== ==*/

    /**
     * Custom JSON serialisation for any transfert object
     *
     */
    toJSON(): object {
        return {
            id: this.id.value,
            size: this.size,
            metaData: this.metaData,
        };
    }


    /*============================================================================================*/
    /*                                          handlers                                          */
    /*============================================================================================*/


    /**
     * Snap to the passed device
     *
     * @param snapeEvent - the event to handle
     */
    private handleSnapTo(snapeEvent: SnapEvent) {
        this.snapDevices.push(snapeEvent);
    }

    /**
     * UnSnap the passed device
     *
     * @param snapeEvent - the event to handle
     */
    private handleUnSnapTo(snapeEvent: { device: Device, position: Position }) {
        this.snapDevices = this.snapDevices.filter(event => ! (event.device === snapeEvent.device && event.position === snapeEvent.position));
    }

    /**
     * Handle a press pointer by a device
     *
     * @param event - The pointer event
     * 
     * @remarks
     * This method should be call by {@link VirtualRoom.handleDevicePress}
     */
    private handlePress(event: DeviceInteractionPointerEvent){
        this.currentPressStart = this.currentPress = event;
    }
    
    /**
     * Handle a move pointer by a device
     *
     * @param event - The pointer event
     * 
     * @remarks
     * This method should be call by {@link VirtualRoom.handleDeviceMove}
     */
    private handleMove(event: DeviceInteractionPointerEvent) {
        if (this.currentPress) this.currentPress = event;
    }
    
    /**
     * Handle a release pointer by a device
     *
     * @param event - The pointer event
     * 
     * @remarks
     * This method should be call by {@link VirtualRoom.handleDeviceRelease}
     */
    private handleRelease(event: DeviceInteractionPointerEvent){
        this.currentPressStart = null;
        this.currentPress = null;
    }

    /**
     * Handle a size change of a device
     *
     * @param newSize - The device new size
     * 
     */
    protected handleSizeChanged(newSize: { width: number, height: number }){
        this.size = newSize;
    }

    /**
     * Handle a anchor priority change of a device
     *
     * @param newAnchorPriority - The new acnhor priority
     * 
     */
    protected handleAnchorPriorityChanged(newAnchorPriority: number){
        this.anchorPriority = newAnchorPriority;
    }
}

export default Device;
