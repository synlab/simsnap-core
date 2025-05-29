import User from "../VirtualRoom/User";
import { VirtualRoom } from "../VirtualRoom/VirtualRoom";
import Object3D from "./Object3D";

export class Scene3D extends VirtualRoom {

	constructor(
		users: User[] = [],
		public sceneObjects: Object3D[] = []
	) { 
		super(users)
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