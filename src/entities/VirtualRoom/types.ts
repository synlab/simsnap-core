import Device from "./Device";

export enum Position{ 'center','top','bottom','left','right' }

export interface DeviceInteractionOrientationEvent {
    readonly device: Device,
    readonly alpha: number,
    readonly beta: number,
    readonly gamma: number
}

export interface DeviceInteractionPointerEvent {
    readonly device: Device,
    readonly x: number,
    readonly y: number
}