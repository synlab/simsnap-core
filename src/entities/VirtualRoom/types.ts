import User from "./User";

export enum Position{ 'center','top','bottom','left','right' }

export interface UserInteractionOrientationEvent {
    readonly user: User,
    readonly alpha: number,
    readonly beta: number,
    readonly gamma: number
}

export interface UserInteractionPointerEvent {
    readonly user: User,
    readonly x: number,
    readonly y: number
}