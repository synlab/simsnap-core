import { Position, DeviceInteractionPointerEvent } from "./types";

export class Device<D extends Device<D> = DeviceImpl> {
    private static CountId = 0;
    readonly id: string;

    currentPressStart: DeviceInteractionPointerEvent<D> | null = null;
    currentPress: DeviceInteractionPointerEvent<D> | null = null;

    snapDevices: [D, Position][] = [];

    constructor(
        private _size?: { width: number; height: number; },
        public metaData?: { [key: string]: any },
        preId: string = 'device',
    ) {
        this.id = `${preId}-${Device.CountId++}`;
    }

    set size(value: { width: number; height: number; }) { this._size = value };
    get size(): { width: number; height: number; } | undefined { return this._size; }

    snapTo(device: D, position: Position) {
        this.snapDevices.push([device, position]);
        this.onSnap?.(device, position);
    }

    unSnapTo(device: D, position: Position) {
        this.snapDevices = this.snapDevices.filter(el => ! (el[0] === device && el[1] === position));
        this.onUnSnap?.(device, position);
    }

    /*== handler ==*/

    handlePress(event: DeviceInteractionPointerEvent<D>){
        this.currentPressStart = this.currentPress = event;
    }
    
    handleMove(event: DeviceInteractionPointerEvent<D>) {
        if (this.currentPress) this.currentPress = event;
    }
    
    handleRelease(event: DeviceInteractionPointerEvent<D>){
        this.currentPressStart = null;
        this.currentPress = null;
    }

    /*== ======= ==*/

    /*== event listenner ==*/

    onSnap?: (device: D, position: Position) => void;
    onUnSnap?: (device: D, position: Position) => void;

    /*== =============== ==*/
}

class DeviceImpl extends Device<Device>{};
export default Device;