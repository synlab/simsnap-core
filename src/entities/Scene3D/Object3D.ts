import { Id } from '../VirtualRoom/types';

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public metaData?: Record<string, any>,
        preId: string = 'Object3D')
    {
        this.id = new Id(preId);
    }

    /**
     * Custom JSON serialisation for any transfert object
     *
     */
    toJSON(): object {
        return {
            id: this.id.value,
            pos: this.pos,
            rotation: this.rotation,
            scale: this.scale,
            metaData: this.metaData,
        };
    }
}

export default Object3D;
