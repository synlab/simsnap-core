import Device from "../VirtualRoom/Device";
import { VirtualRoom } from "../VirtualRoom/VirtualRoom";
import Object3D from "./Object3D";

export class Scene3D extends VirtualRoom {

	constructor(
		devices: Device[] = [],
		public sceneObjects: Object3D[] = []
	) { 
		super(devices)
	}

	/** @internal **/
	updateSceneObjects(): Object3D[] {
		this.handleSceneUpdate?.();
        return this.sceneObjects
    }

	/*== handler ==*/
    
    handleSceneUpdate?: () => void

    /*== ======= ==*/
}

export default Scene3D;