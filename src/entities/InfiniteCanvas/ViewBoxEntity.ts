export interface ViewBoxEntity {
    pos?: { x: number; y: number };
    size?: {width: number, height: number};
}

export class ViewBox{
    private constructor(){}

    static getCenter(viewBoxEntity: ViewBoxEntity) {
        if (viewBoxEntity.pos && viewBoxEntity.size) {
            return {
                x: viewBoxEntity.pos.x + viewBoxEntity.size.width / 2,
                y: viewBoxEntity.pos.y + viewBoxEntity.size.height / 2,
            }
        }
        return undefined;
    }

    static intersect(point: {x: number, y: number}, viewBox: ViewBoxEntity): boolean {
        if (!viewBox.pos || !viewBox.size) return false;

        const aLeft = viewBox.pos.x;
        const aRight = viewBox.pos.x + viewBox.size.width;
        const aTop = viewBox.pos.y;
        const aBottom = viewBox.pos.y + viewBox.size.height;

        return (
            point.x > aLeft &&
            point.x < aRight &&
            point.y > aTop &&
            point.y < aBottom
        );
    }

    static intersectViewBox(a: ViewBoxEntity, b: ViewBoxEntity): boolean {
        if (!(a.pos && a.size && b.pos && b.size)) return false;

        const aLeft = a.pos.x;
        const aRight = a.pos.x + a.size.width;
        const aTop = a.pos.y;
        const aBottom = a.pos.y + a.size.height;
        const bLeft = b.pos.x;
        const bRight = b.pos.x + b.size.width;
        const bTop = b.pos.y;
        const bBottom = b.pos.y + b.size.height;

        return (
            aLeft < bRight &&
            aRight > bLeft &&
            aTop < bBottom &&
            aBottom > bTop
        );
    }
}