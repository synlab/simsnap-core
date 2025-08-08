import { EventDispatcher } from '../Utils';
import { DeviceInteractionPointerEvent, SnapEvent } from './types'; 
import { Id } from '../Utils';
import { SnapManagerDeviceEvent } from './SnapManager';
import { PointerManagerDeviceEvent } from './PointerManager';

export type DeviceEvents = {
    sizeChanged: { width: number, height: number };
} & PointerManagerDeviceEvent & SnapManagerDeviceEvent;

/**
 * Representation of a Device
 * 
 * @param size - the size of the viewport of the device
 * @param metaData - an optional Record of custom any, by string key
 * @param preId - the optional substring to add before the final ID
 */
export class Device<Events extends DeviceEvents = DeviceEvents> {
    readonly id: Id;
    private dispatcher = new EventDispatcher<Events>();

    /** The currents devices that are snap with this */
    public snapDevices: SnapEvent[] = [];

    /** The press event of the current active pointer event, initialized directly on press */
    public currentPressStart: DeviceInteractionPointerEvent | null = null;
    /** The press/move event of the current pointer event, initialized directly on press and updated on move */
    public currentPress: DeviceInteractionPointerEvent | null = null;

    constructor(
        public size?: { width: number; height: number; },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public metaData?: Record<string, any>,
        public anchorPriority: number | null = null,
        preId: string = 'device',
    ) {
        this.id = new Id(preId);

        /*== Link internal handlers ==*/
        this.addEventListener('snap', this.handleSnapTo.bind(this));
        this.addEventListener('unSnap', this.handleUnSnapTo.bind(this));
        this.addEventListener('sizeChanged', this.handleSizeChanged.bind(this));
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
    private handleUnSnapTo(snapeEvent: SnapEvent) {
        this.snapDevices = this.snapDevices.filter(event => ! (event.device === snapeEvent.device && event.position === snapeEvent.position));
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
}

export default Device;
