import Device from "./Device";

/**
 * The snapping position
 *
 * @remarks value is 'center' | 'top' | 'bottom' | 'left' | 'right'
 */
export enum Position{ center = 'center', top = 'top', bottom = 'bottom', left = 'left', right = 'right' }

/**
 * class representing an unique identifier of any object (ID)
 *
 * @param preId - define a pre string to put before an id object, default to 'untyped'
 * 
 * @remarks the id pattern is `${preId}-${idNumber: string}`
 */
export class Id {
    private static Count = 0;
    readonly value: string;

    constructor(preId: string = 'untyped') {
        this.value = `${preId}-${Id.Count++}`;
    }

    get type() {
        return this.value.split('-')[0];
    }

    toString() {
        return this.value;
    }
}

/**
 * Represent an Event triggered on a pointer event i.e Press | Move | Release
 *
 * @param device - the Device responsible of the event
 * @param x - the x position on the device screen
 * @param y - the y position on the device screen
 */
export interface DeviceInteractionPointerEvent {
    readonly device: Device,
    readonly x: number,
    readonly y: number
}

/**
 * Represent an Event triggered when the device orientation change
 *
 * @param device - the Device responsible of the event
 * @param alpha
 * @param beta
 * @param gamma
 */
export interface DeviceInteractionOrientationEvent {
    readonly device: Device,
    readonly alpha: number,
    readonly beta: number,
    readonly gamma: number
}