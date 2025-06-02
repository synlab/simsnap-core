import Device from "../VirtualRoom/Device";
import { VirtualRoom } from "../VirtualRoom/VirtualRoom";
import Object3D from "./Object3D";

/**
 * Representation of a virtual room in a 3D context
 *
 * @param devices - the list of device to add to the room
 * @param sceneObjects - the list of 3D object to add to the scene
 */
export class Scene3D extends VirtualRoom {

	constructor(
		devices: Device[] = [],
		public sceneObjects: Object3D[] = []
	) { 
		super(devices)
	}
	
	/**
     * Update the 3D scene, and trigger the {@link Scene3D.handleSceneUpdate} event
     * @internal 
     *
     * @return the current 3D scene
     */
	updateSceneObjects(): Object3D[] {
		this.onSceneUpdate?.();
        return this.sceneObjects
    }


	/*=============================================================================================*/
    /*                                      event listenner                                        */
    /*=============================================================================================*/

	/**
     * CallBack triggered when an update of the scene is required
	 * @eventProperty
	 * @remarks
	 * The event is triggered just before the sceneObjects list is been returned
     */
    onSceneUpdate?: () => void
}

export default Scene3D;