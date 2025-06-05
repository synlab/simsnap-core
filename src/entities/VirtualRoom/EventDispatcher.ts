type Listener<T> = {
  callback: (event: T) => void;
  priority: number;
};

export class EventDispatcher<Events extends Record<string, any>> {
  private listeners: {
    [K in keyof Events]?: Listener<Events[K]>[];
  } = {};

  addEventListener<K extends keyof Events>(
    type: K,
    callback: (event: Events[K]) => void,
    priority = 0
  ): void {
    const list = this.listeners[type] ?? [];
    list.push({ callback, priority });
    list.sort((a, b) => b.priority - a.priority);
    this.listeners[type] = list;
  }

  removeEventListener<K extends keyof Events>(
    type: K,
    callback: (payload: Events[K]) => void
  ): void {
    const list = this.listeners[type];
    if (!list) return;
    this.listeners[type] = list.filter((l) => l.callback !== callback);
  }

  emit<K extends keyof Events>(type: K, event: Events[K]): void {
    const list = this.listeners[type];
    if (!list) return;
    for (const { callback } of list) {
      callback(event);
    }
  }
}
