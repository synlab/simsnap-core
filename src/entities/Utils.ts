type Listener<T> = {
  callback: (event: T) => void;
  priority: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class EventDispatcher<Events extends Record<string, any>> {
    public listeners: {
        [K in keyof Events]?: Listener<Events[K]>[];
    } = {};

    addEventListener<K extends keyof Events>(
        type: K,
        callback: (event: Events[K]) => void,
        priority = 0,
    ): void {
        const list = this.listeners[type] ?? [];
        list.push({ callback, priority });
        list.sort((a, b) => b.priority - a.priority);
        this.listeners[type] = list;
    }

    removeEventListener<K extends keyof Events>(
        type: K,
        callback: (payload: Events[K]) => void,
    ): void {
        const list = this.listeners[type];
        if (!list) return;
        this.listeners[type] = list.filter((l) => l.callback !== callback);
    }

    emit<K extends keyof Events>(type: K, event: Events[K]): void {
        const list = this.listeners[type];
        if (!list) return;
        list.forEach(({ callback }) => callback(event));
    }
}

/**
 * class representing an unique identifier of any object (ID)
 *
 * @param preId - define a pre string to put before an id object, default to 'untyped'
 *
 * @remarks the id pattern is `${preId}-${idNumber: string}`
 */

export class Id {
    private static Count = 0;
    readonly value: string;

    constructor(preId: string = 'untyped') {
        this.value = `${preId}-${Id.Count++}`;
    }

    get type() {
        return this.value.split('-')[0];
    }

    toString() {
        return this.value;
    }

    /**
     * Factory to create an Id from custom string warning, don't check if unique
     *
     * @param value - the string to create Id from
     */
    static From(value: string): Id {
        const id = new Id();
        (id as { value: string; }).value = value;
        return id;
    }
}

export function distance(a: {x: number, y: number}, b: {x: number, y: number}) {
    return Math.hypot(a.x - b.x , a.y - b.y);
}

type BFSOptions<T> = {
  getNeighbors: (node: T) => T[];              // function to get neighbors
  isGoal?: (node: T) => boolean;               // optional goal condition
  onVisit?: (node: T, depth: number) => void;  // optional hook on visit
};

export function bfs<T>(start: T, options: BFSOptions<T>): T | null {
    const { getNeighbors, isGoal, onVisit } = options;
    const visited = new Set<T>();
    const queue: { node: T; depth: number }[] = [{ node: start, depth: 0 }];

    while (queue.length > 0) {
        const { node, depth } = queue.shift()!;

        if (visited.has(node)) continue;
        visited.add(node);

        onVisit?.(node, depth);
        if (isGoal?.(node)) return node;

        const neighbors = getNeighbors(node);
        for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
            queue.push({ node: neighbor, depth: depth + 1 });
        }
        }
    }

    return null;
}
