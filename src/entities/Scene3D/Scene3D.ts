import Device from '../VirtualRoom/Device';
import { VirtualRoom, VirtualRoomEvents } from '../VirtualRoom/VirtualRoom';
import Object3D from './Object3D';

export type Scene3DEvents = VirtualRoomEvents & { sceneUpdate: Object3D[] };

/**
 * Representation of a virtual room in a 3D context
 *
 * @param devices - the list of device to add to the room
 * @param sceneObjects - the list of 3D object to add to the scene
 */
export class Scene3D<Events extends Scene3DEvents = Scene3DEvents> extends VirtualRoom<Events> {
	private timeInterval: NodeJS.Timeout;

	constructor(
		devices: Device[] = [],
		public sceneObjects: Object3D[] = [],
	) { 
		super(devices);
		this.timeInterval = setInterval(() => {
            this.updateSceneObjects();
        }, 50);

		this.addEventListener('destroy', this.handleDestroy.bind(this));
	}
	
	/**
     * Update the 3D scene, and trigger the {@link Scene3DEvents.sceneUpdate} event
     */
	updateSceneObjects() {
		this.emit('sceneUpdate', this.sceneObjects);
    }

	/**
	 * Handle the destroying of the current element
	 */
	private handleDestroy() {
		clearInterval(this.timeInterval);
	}
}

export default Scene3D;
