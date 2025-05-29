import { Position, DeviceInteractionPointerEvent } from "./types";

export class Device {
    private static CountId = 0;
    readonly id: string;

    currentPressStart: DeviceInteractionPointerEvent | null = null;
    currentPress: DeviceInteractionPointerEvent | null = null;

    snapDevices: [Device, Position][] = [];

    constructor(
        private _size?: { width: number; height: number; },
        public metaData?: { [key: string]: any },
        preId: string = 'device',
    ) {
        this.id = `${preId}-${Device.CountId++}`;
    }

    set size(value: { width: number; height: number; }) { this._size = value };
    get size(): { width: number; height: number; } | undefined { return this._size; }

    /** @internal **/
    snapTo(device: Device, position: Position) {
        this.snapDevices.push([device, position]);
        this.onSnap?.(device, position);
    }

    /** @internal **/
    unSnapTo(device: Device, position: Position) {
        this.snapDevices = this.snapDevices.filter(el => ! (el[0] === device && el[1] === position));
        this.onUnSnap?.(device, position);
    }

    /*== handler ==*/

    handlePress(event: DeviceInteractionPointerEvent){
        this.currentPressStart = this.currentPress = event;
    }
    
    handleMove(event: DeviceInteractionPointerEvent) {
        if (this.currentPress) this.currentPress = event;
    }
    
    handleRelease(event: DeviceInteractionPointerEvent){
        this.currentPressStart = null;
        this.currentPress = null;
    }

    /*== ======= ==*/

    /*== event listenner ==*/

    onSnap?: (device: Device, position: Position) => void;
    onUnSnap?: (device: Device, position: Position) => void;

    /*== =============== ==*/
}

export default Device;