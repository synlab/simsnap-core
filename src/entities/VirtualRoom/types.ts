import { Device } from "./Device";

export enum Position{ 'center','top','bottom','left','right' }

export class DeviceInteractionPointerEvent<D extends Device<D> = Device> {

    constructor(
        readonly device: D,
        readonly x: number,
        readonly y: number
    ) { }
}

export class DeviceInteractionOrientationEvent<D extends Device<D> = Device> {
    
    constructor(
        readonly device: D,
        readonly alpha: number,
        readonly beta: number,
        readonly gamma: number
    ) { }
}