export function removeItem<T>(arr: T[], item: T): void;
export function removeItem<T>(arr: T[], predicate: (value: T, index: number) => boolean): void;
export function removeItem<T>(arr: T[], arg: T | ((value: T, index: number) => boolean)): void {
    if (typeof arg === "function") {
        for (let i = arr.length - 1; i >= 0; i--) {
            if ((arg as (value: T, index: number) => boolean)(arr[i], i)) {
                arr.splice(i, 1);
            }
        }
    } else {
        const idx = arr.indexOf(arg as T);
        if (idx !== -1) arr.splice(idx, 1);
    }
}

export function distance(a: {x: number, y: number}, b: {x: number, y: number}) {
    return Math.hypot(a.x - b.x , a.y - b.y);
}