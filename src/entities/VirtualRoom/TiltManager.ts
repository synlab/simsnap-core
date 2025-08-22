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
  private deviceTiltData: Map<string, DeviceInteractionOrientationEvent> = new Map();
  private previousTiltAngles: Map<string, { alpha: number; beta: number; gamma: number }> = new Map();

  constructor(protected readonly virtualRoom: VirtualRoom) {
    virtualRoom.addEventListener(
      'deviceOrientationChange',
      this.manageTilt.bind(this),
    );
  }

  // Update tilt data and detect up/down direction
  public manageTilt(event: DeviceInteractionOrientationEvent) {
    const deviceId = event.device.id.value;
    this.deviceTiltData.set(deviceId, event);

    // Store current angles for next comparison AFTER calculating movement
    this.previousTiltAngles.set(deviceId, { alpha: event.alpha, beta: event.beta, gamma: event.gamma });

    // Calculate and emit average tilt for tilt together
    const combinedTilt = this.calculateCombinedTilt('average');
    this.virtualRoom.emit('tiltTogether', combinedTilt);
  }

  // Get tilt data for a specific device
  public getDeviceTilt(deviceId: string): DeviceInteractionOrientationEvent | undefined {
    return this.deviceTiltData.get(deviceId);
  }

  // Calculate combined tilt values
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

  // Recommend movement direction and shift for x/y based on tilt
  public getMovementRecommendation(current: DeviceInteractionOrientationEvent, sensitivity = 1): { direction: string; xShift: number; yShift: number } | undefined {
    const deviceId = current.device.id.value;
    const prev = this.previousTiltAngles.get(deviceId);
    if (!prev) return undefined;
    
    // Handle 360° wrapping
    const normalizeAngleDiff = (current: number, prev: number): number => {
      let diff = current - prev;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      return diff;
    };
    
    const xShift = Math.round(normalizeAngleDiff(current.gamma, prev.gamma) * sensitivity);
    const yShift = Math.round(normalizeAngleDiff(current.beta, prev.beta) * sensitivity);
    
    let direction = 'none';
    if (Math.abs(xShift) > Math.abs(yShift)) {
      direction = xShift > 0 ? 'right' : 'left';
    } else if (Math.abs(yShift) > 0) {
      direction = yShift > 0 ? 'up' : 'down';
    }
    return { direction, xShift, yShift };
  }

  // Get all current device tilt data
  public getAllDeviceTiltData(): Map<string, DeviceInteractionOrientationEvent> {
    return new Map(this.deviceTiltData);
  }

  // Clear tilt data for a specific device
  public clearDeviceTiltData(deviceId: string) {
    this.deviceTiltData.delete(deviceId);
    this.previousTiltAngles.delete(deviceId);
  }
}
