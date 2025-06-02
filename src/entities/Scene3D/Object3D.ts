import { Id } from "../VirtualRoom/types";

/**
 * Representation of a 3D obejct in a 3D context
 *
 * @param pos - the position of the object
 * @param rotation - the rotation of the object
 * @param scale - the scale factors of the object
 * @param metaData - an optional Record of custom any, by string key
 * @param preId - the optional substring to add before the final ID
 */
export class Object3D {
    readonly id: Id;

    constructor(
        public pos: {x: number, y: number, z: number},
        public rotation: {x: number, y: number, z: number},
        public scale: {x: number, y: number, z: number},
        public metaData?: Record<string, any>,
        preId: string = 'Object3D',)
    {
        this.id = new Id(preId);
    }
}

export default Object3D;