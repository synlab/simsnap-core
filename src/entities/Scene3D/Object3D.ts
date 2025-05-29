export class Object3D {
    private static CountId = 0;
    readonly id: string;

    constructor(
        public pos: {x: number, y: number, z: number},
        public rotation: {x: number, y: number, z: number},
        public scale: {x: number, y: number, z: number},
        public metaData?: { [key: string]: any },
        preId: string = 'Object3D',)
    {
        this.id = `${preId}-${Object3D.CountId++}`;
    }
}

export default Object3D;