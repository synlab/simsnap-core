import { DeviceInteractionOrientationEvent, TiltTogetherEvent } from './types';
import { VirtualRoom } from './VirtualRoom';

export type TiltManagerEvent = {
    deviceOrientationChange: DeviceInteractionOrientationEvent;
    tiltTogether: TiltTogetherEvent;
}

/**
 * Handle the tilt management for virtualRoom
 * @internal
 *
 * @param virtualRoom - the calling virtualRoom
 */
export class TiltManager {
    constructor( protected readonly virtualRoom: VirtualRoom ) {
        virtualRoom.addEventListener('deviceOrientationChange', this.manageTilt.bind(this));
    }

    /**
     * Call for each tilt event
     *
     * @param event - the released event
     */
    protected manageTilt(event: DeviceInteractionOrientationEvent) {
        // TODO manage tilting
        this.virtualRoom.emit('tiltTogether', {
            alpha: 0,
            beta: 0,
            gamma: 0
        })
    }
}
