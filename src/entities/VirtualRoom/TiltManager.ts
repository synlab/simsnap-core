import { DeviceInteractionOrientationEvent, TiltTogetherEvent } from './types';
import { VirtualRoom } from './VirtualRoom';

export type TiltManagerEvent = {
  deviceOrientationChange: DeviceInteractionOrientationEvent;
  tiltTogether: TiltTogetherEvent;
};

/**
 * Handle the tilt management for virtualRoom
 * @internal
 *
 * @param virtualRoom - the calling virtualRoom
 */
export class TiltManager {
  private deviceTiltData: Map<string, DeviceInteractionOrientationEvent> =
    new Map();

  constructor(protected readonly virtualRoom: VirtualRoom) {
    virtualRoom.addEventListener(
      'deviceOrientationChange',
      this.manageTilt.bind(this),
    );
  }

  /**
   * Call for each tilt event to update device tilt data
   * @param event - the device orientation event
   */
  public manageTilt(event: DeviceInteractionOrientationEvent) {
    // Store the tilt data for this device
    this.deviceTiltData.set(event.device.id.value, event);

    // Calculate combined tilt and emit
    const combinedTilt = this.calculateCombinedTilt('average');
    this.virtualRoom.emit('tiltTogether', combinedTilt);
  }

  /**
   * Calculate the combined tilt values based on specified method
   * @param method - The method to combine tilt values ('average', 'max', 'min')
   * @returns Combined tilt values
   */
  public calculateCombinedTilt(
    method: 'average' | 'max' | 'min' = 'average',
  ): TiltTogetherEvent {
    const devices = Array.from(this.deviceTiltData.values());

    if (devices.length === 0) {
      return { alpha: 0, beta: 0, gamma: 0 };
    }

    switch (method) {
      case 'max':
        return {
          alpha: Math.max(...devices.map((d) => d.alpha)),
          beta: Math.max(...devices.map((d) => d.beta)),
          gamma: Math.max(...devices.map((d) => d.gamma)),
        };
      case 'min':
        return {
          alpha: Math.min(...devices.map((d) => d.alpha)),
          beta: Math.min(...devices.map((d) => d.beta)),
          gamma: Math.min(...devices.map((d) => d.gamma)),
        };
      case 'average':
      default:
        return {
          alpha: devices.reduce((sum, d) => sum + d.alpha, 0) / devices.length,
          beta: devices.reduce((sum, d) => sum + d.beta, 0) / devices.length,
          gamma: devices.reduce((sum, d) => sum + d.gamma, 0) / devices.length,
        };
    }
  }

  /**
   * Get all current device tilt data
   * @returns Map of device IDs to their tilt data
   */
  public getAllDeviceTiltData(): Map<
    string,
    DeviceInteractionOrientationEvent
  > {
    return new Map(this.deviceTiltData);
  }

  /**
   * Clear tilt data for a specific device
   * @param deviceId - The ID of the device to clear
   */
  public clearDeviceTiltData(deviceId: string) {
    this.deviceTiltData.delete(deviceId);
  }
}
