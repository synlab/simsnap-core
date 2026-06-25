import Device from './Device';
import { DeviceInteractionAccelerometerEvent } from './types';
import { VirtualRoom } from './VirtualRoom';

// ACCELERATION COMPONENTS:
//     - x-axis: Side-to-side motion (pitch/yaw)
//     - y-axis: Up-and-down motion (roll)
//     - z-axis: Forward-backward motion (includes gravity ~9.81 m/s²)
    
//TYPICAL ACCELERATION VALUES:
//     - At rest: z ≈ 9.81 m/s² (gravity only)
//     - Normal handling: 0-5 m/s² (x, y components)
//     - Gentle shake: 5-10 m/s² (magnitude increase)
//     - Moderate shake: 10-20 m/s² (significant motion)
//     - Vigorous shake: 20+ m/s² (rapid movement)

export type MovementManagerDeviceEvent = {
    device: Device,
    timestamp: number
}

export type MovementManagerEvent = {
  deviceAcceleration: DeviceInteractionAccelerometerEvent;
  shake: MovementManagerDeviceEvent;
};

export type MovementManagerDeviceShakeEvent = {
  shake: MovementManagerDeviceEvent;
};

/**
 * Detects device shake gestures by analyzing accelerometer data within a configurable
 * time window. Emits a single shake event after confirming continuous oscillation.
 */
export class MovementManager {
  private timeWindow: number = 2000;
  private cooldown: number = 100;
  private minimumShakeMagnitude: number = 15;
  
  private accelerationHistory: Map<
    string,
    Array<{ timestamp: number; x: number; y: number; z: number; magnitude: number }>
  > = new Map();

  private activeShakeState: Map<string, {
    firstPeakTime: number;
    lastPeakTime: number;
    peakCount: number;
  }> = new Map();

  constructor(protected readonly virtualRoom: VirtualRoom) {
    virtualRoom.addEventListener('deviceAcceleration', this.handleAcceleration.bind(this));
  }

  /**
   * Configure shake detection parameters.
   * @param timeWindow - Time window from first peak to shake emission (default: 2000ms) 
   * @param cooldown - Minimum time between consecutive peaks (default: 100ms)
   * @param minimumShakeMagnitude - Peak detection threshold in m/s² (default: 15)
   */
  public configure(
    timeWindow?: number,
    cooldown?: number,
    minimumShakeMagnitude?: number,
    
  ): void {
    if (cooldown !== undefined) this.cooldown = cooldown;
    if (minimumShakeMagnitude !== undefined) this.minimumShakeMagnitude = minimumShakeMagnitude;
    if (timeWindow !== undefined) this.timeWindow = timeWindow;
  }

  /**
   * Process accelerometer data and detect shake gestures.
   * Peaks within cooldown intervals accumulate throughout the time window.
   * Emits shake event after time window expires if consecutive peaks detected.
   */
  public handleAcceleration(event: DeviceInteractionAccelerometerEvent): void {
    const deviceId = event.device.id.value;
    const timestamp = Date.now();
    const magnitude = Math.sqrt(event.x * event.x + event.y * event.y + event.z * event.z);

    // Initialize history if needed
    if (!this.accelerationHistory.has(deviceId)) {
      this.accelerationHistory.set(deviceId, []);
    }

    const history = this.accelerationHistory.get(deviceId)!;
    history.push({ timestamp: timestamp, x: event.x, y: event.y, z: event.z, magnitude });

    const isPeak = magnitude > this.minimumShakeMagnitude;
    let activeState = this.activeShakeState.get(deviceId);

    // CHECK: Has time window expired from first peak?
    if (activeState && (timestamp - activeState.firstPeakTime) >= this.timeWindow && (timestamp - activeState.lastPeakTime) <= this.cooldown) {
      const realTime: number = Date.now();
      // Time window reached: emit shake event
      event.device.emit('shake', {
        device: event.device,
        timestamp,
      });
      this.activeShakeState.delete(deviceId);
      activeState = undefined;
    }

    // DETECT: Peak detected
    if (isPeak) {
      if (!activeState) {
        // First peak: start new shake sequence
        this.activeShakeState.set(deviceId, {
          firstPeakTime: timestamp,
          lastPeakTime: timestamp,
          peakCount: 1,
        });
      } else {
        // Check if peak is within cooldown of last peak
        const timeSinceLastPeak = timestamp - activeState.lastPeakTime;
        if (timeSinceLastPeak <= this.cooldown) {
          // Peak within cooldown: continue sequence
          activeState.peakCount += 1;
          activeState.lastPeakTime = timestamp;
        } else {
          // Peak outside cooldown: sequence broken, reset
          this.activeShakeState.delete(deviceId);
        }
      }
    }
  }

  /**
   * Retrieves the acceleration history for a specific device.
   * Returns a copy of all recorded acceleration samples (x, y, z components, magnitude, and timestamp).
   * Useful for debugging, analytics, or analyzing acceleration patterns over time.
   * @param deviceId - The ID of the device to retrieve history for
   * @returns Array of acceleration samples with timestamps, or empty array if device has no history
   */
  public getAccelerationHistory(deviceId: string): 
    Array<{ timestamp: number; x: number; y: number; z: number; magnitude: number }> {
    return [...(this.accelerationHistory.get(deviceId) ?? [])];
  }

  /**
   * Checks if a device is currently in an active shake detection sequence.
   * Returns true if the device has detected peaks within the time window and is waiting for completion.
   * Useful for real-time UI feedback or preventing duplicate actions during active shaking.
   * @param deviceId - The ID of the device to check
   * @returns True if the device has an active shake sequence, false otherwise
   */
  public isDeviceShaking(deviceId: string): boolean {
    return this.activeShakeState.has(deviceId);
  }

  /**
   * Clears all acceleration history and active shake state for a specific device.
   * Resets the device as if it has never been tracked, useful for cleanup when a device disconnects
   * or when you want to restart tracking for a specific device.
   * @param deviceId - The ID of the device to clear
   */
  public clearDeviceHistory(deviceId: string): void {
    this.accelerationHistory.delete(deviceId);
    this.activeShakeState.delete(deviceId);
  }

  /**
   * Clears all acceleration history and active shake states for all devices.
   * Performs a complete reset of the MovementManager state, useful for initializing a clean state
   * or when resetting the entire virtual room. Use with caution as this will interrupt any ongoing shake detection.
   */
  public clearAllHistory(): void {
    this.accelerationHistory.clear();
    this.activeShakeState.clear();
  }
}
