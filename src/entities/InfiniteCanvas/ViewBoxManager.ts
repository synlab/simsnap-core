import { ViewBoxEntity } from './types';

/**
 * Handle the viewbox casual action
 * @internal
 */
export class ViewBoxManager{
    private constructor(){}

    /**
     * Get the center of the viewbox of the entity
     *
     * @param viewBoxEntity - the entity to get the center from
     */
    static getCenter(viewBoxEntity: ViewBoxEntity) {
        if (!viewBoxEntity.pos || !viewBoxEntity.size) return undefined;
        return {
            x: viewBoxEntity.pos.x + viewBoxEntity.size.width / 2,
            y: viewBoxEntity.pos.y + viewBoxEntity.size.height / 2,
        };
    }

    /**
     * Move the entity to fit the center on the point
     *
     * @param point - the point to set the center of the entity on
     * @param viewBoxEntity - the entity to set the center
     */
    static setCenter(point: { x: number, y: number }, viewBoxEntity: ViewBoxEntity) {
        if (!viewBoxEntity.size) {
            viewBoxEntity.pos = point;
        } else {
            viewBoxEntity.pos = {
                x: point.x - viewBoxEntity.size.width / 2,
                y: point.y - viewBoxEntity.size.height / 2,
            };
        }
    }

    /**
     * Check if a point intersect with a viewBox
     *
     * @param point - the point to check intersection
     * @param viewBox - the viewBox to check intersection
     */
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

    /**
     * Check if a viewBox intersect an other
     *
     * @param a - the first viewbox
     * @param b - the second viewbox
     * @param margin - the optional positiv or negativ margin to apply on the viewBoxs
     */
    static intersectViewBox(a: ViewBoxEntity, b: ViewBoxEntity, margin: number = 0): boolean {
        if (!(a.pos && a.size && b.pos && b.size)) return false;

        const aLeft = a.pos.x - margin;
        const aRight = a.pos.x + a.size.width + margin;
        const aTop = a.pos.y - margin;
        const aBottom = a.pos.y + a.size.height + margin;
        const bLeft = b.pos.x - margin;
        const bRight = b.pos.x + b.size.width + margin;
        const bTop = b.pos.y - margin;
        const bBottom = b.pos.y + b.size.height + margin;

        return (
            aLeft < bRight &&
            aRight > bLeft &&
            aTop < bBottom &&
            aBottom > bTop
        );
    }
}
