import { VirtualRoom, VirtualRoomEvents } from '../VirtualRoom/VirtualRoom';
import CanvasDevice from './CanvasDevice';
import { GrabPressManager } from './GrabPressManager';
import { InfiniteCanvasPointerManager, InfiniteCanvasPointerManagerEvent } from './InfiniteCanvasPointerManager';
import { InfiniteCanvasSnapManager, InfiniteCanvasSnapManagerEvent } from './InfiniteCanvasSnapManager';
import { ViewBoxObject } from './ViewBoxObject';

export type InfiniteCanvasEvents = VirtualRoomEvents & InfiniteCanvasPointerManagerEvent & InfiniteCanvasSnapManagerEvent;

/**
 * Representation of a virtual room in a 3D context
 *
 * @param devices - the list of CanvasDevice to add to the room
 * @param sceneObjects - the list of object to add to the scene
 */
export class InfiniteCanvas<Events extends InfiniteCanvasEvents = InfiniteCanvasEvents> extends VirtualRoom<Events> {
	override devices: CanvasDevice[] = [];
	
	public override pointerManager?: InfiniteCanvasPointerManager;
	public override snapManager?: InfiniteCanvasSnapManager;
	public grabPressManager?: GrabPressManager;

	private timeInterval: NodeJS.Timeout;

	constructor(
		devices: CanvasDevice[] = [],
		public sceneObjects: ViewBoxObject[] = [],
		enablePointerManager = true,
		enableSnapManager = true,
		enableTiltManager = true,
		enablePressManager = true,
	) {
		super(devices, false, false, enableTiltManager);
		this.addEventListener('destroy', this.handleDestroy.bind(this));

		if (enablePointerManager) this.pointerManager = new InfiniteCanvasPointerManager(this);
		if (enableSnapManager) this.snapManager = new InfiniteCanvasSnapManager(this);
		if (enablePressManager) this.grabPressManager = new GrabPressManager(this);

		this.timeInterval = setInterval(() => {
            this.updateSceneObjects();
        }, 50);
	}

	/**
     * Update the scene, and trigger the {@link InfiniteCanvasEvents.sceneUpdate} event
     */
	protected updateSceneObjects() {
		this.devices.forEach(device => {
			if (!device.pos || !device.size) {
				return;
			}
			device.emit('sceneUpdate', 
				this.sceneObjects
					.filter(obj => device.isIntersectViewBox(obj))
					.map(obj =>  device.getProjectedViewBox(obj)),
			);
		});
	}

	
	/*============================================================================================*/
    /*                                          handlers                                          */
    /*============================================================================================*/

	/**
	 * Handle the destroying of the current element
	 */
	private handleDestroy() {
		clearInterval(this.timeInterval);
	}
}

export default InfiniteCanvas;
