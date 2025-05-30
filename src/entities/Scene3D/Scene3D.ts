import { Device } from "../VirtualRoom/Device";
import { VirtualRoom } from "../VirtualRoom/VirtualRoom";
import Object3D from "./Object3D";

export class Scene3D<D extends Device<D> = Device, O extends Object3D = Object3D> extends VirtualRoom<D> {

	constructor(
		devices: D[] = [],
		public sceneObjects: O[] = []
	) { 
		super(devices)
	}

	/** @internal **/
	updateSceneObjects(): O[] {
		this.handleSceneUpdate?.();
        return this.sceneObjects
    }

	/*== handler ==*/
    
    handleSceneUpdate?: () => void

    /*== ======= ==*/
}

export default Scene3D;