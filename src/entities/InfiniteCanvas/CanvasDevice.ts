import { Device } from "../VirtualRoom/Device";
import { DeviceInteractionPointerEventOnCanvas, ViewBoxEntity } from "./types";

/**
 * Represent an entity having a viewBox
 *
 * @param pos - the position of the object on the canvas
 * @param size - the size of the viewport of the device
 * @param metaData - an optional Record of custom any, by string key
 * @param preId - the optional substring to add before the final ID
 */
export class CanvasDevice extends Device implements ViewBoxEntity {
    /** The press event of the current active pointer event, initialized directly on press */
    override currentPressStart: DeviceInteractionPointerEventOnCanvas | null = null;
    /** The press/move event of the current pointer event, initialized directly on press and updated on move */
    override currentPress: DeviceInteractionPointerEventOnCanvas | null = null;

    constructor(
        public pos?: {x: number, y: number},
        size?: {width: number, height: number},
        metaData?: Record<string, any>,
        preId: string = 'canvaDevice'
    ) {
        super(size, metaData, preId);
    }
}

export default CanvasDevice;