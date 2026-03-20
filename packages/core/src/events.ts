export interface EventBus<TEvent> {
  emit(event: TEvent): void;
  on(handler: (event: TEvent) => void): () => void;
  destroy(): void;
}

export function createEventBus<TEvent>(): EventBus<TEvent> {
  const handlers = new Set<(event: TEvent) => void>();

  return {
    emit(event: TEvent): void {
      handlers.forEach((handler) => {
        handler(event);
      });
    },
    on(handler: (event: TEvent) => void): () => void {
      handlers.add(handler);
      return () => {
        handlers.delete(handler);
      };
    },
    destroy(): void {
      handlers.clear();
    },
  };
}
