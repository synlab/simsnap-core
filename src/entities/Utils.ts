export function removeItem<T>(arr: T[], item: T) {
    const idx = arr.indexOf(item);
    if (idx !== -1) arr.splice(idx, 1);
}

export function distance(a: {x: number, y: number}, b: {x: number, y: number}) {
    return Math.hypot(a.x - b.x , a.y - b.y);
}