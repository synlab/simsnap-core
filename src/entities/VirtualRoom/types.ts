import Device from './Device';

/**
 * The snapping position
 *
 * @remarks value is 'top' | 'bottom' | 'left' | 'right'
 */
export enum Position{ top = 'top', bottom = 'bottom', left = 'left', right = 'right' }

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

/**
 * Represent an Event triggered when all the tilt in approximately the same direction 
 *
 * @param alpha
 * @param beta
 * @param gamma
 */
export interface TiltTogetherEvent {
    readonly alpha: number,
    readonly beta: number,
    readonly gamma: number
}

/**
 * Represent an Event triggered on the device when snaped or unSnaped with an other one
 *
 * @param device - The device the current device has been snaped/unSnaped with
 * @param position - The position of the snap on the current device
 * @param color - The color attribuated to the Snap
 * @param autoFired - The boolean indicating if the snap is reulsting from a user operation or the system
 */
export interface SnapEvent extends DeviceInteractionPointerEvent {
    readonly snapDevice: Device,
    readonly position: Position,
    readonly color?: string,
    readonly autoFired: boolean;
}

/**
 * Represent an Event triggered when two Device snaped or unSnaped
 *
 * @param event1 - the first snaped device event
 * @param event2 - the second snaped device event
 * 
 * @remarks
 * for snapEvent, the event are the release event - for unSnap, the event are the press event
 */
export interface SnapDevicesEvent {
    readonly event1: SnapEvent,
    readonly event2: SnapEvent,
}
