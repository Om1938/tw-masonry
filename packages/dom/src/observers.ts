export interface ObserverHandle {
  refresh(nextItems: HTMLElement[]): void;
  disconnect(): void;
}

export function createResizeWatcher(
  container: HTMLElement,
  items: HTMLElement[],
  onResize: (item?: HTMLElement) => void,
): ObserverHandle {
  if (typeof ResizeObserver === "undefined") {
    return {
      refresh: () => {},
      disconnect: () => {},
    };
  }

  const observer = new ResizeObserver((entries) => {
    const target = entries[0]?.target;
    onResize(target instanceof HTMLElement ? target : undefined);
  });

  observer.observe(container);
  items.forEach((item) => observer.observe(item));

  return {
    refresh(nextItems: HTMLElement[]): void {
      observer.disconnect();
      observer.observe(container);
      nextItems.forEach((item) => observer.observe(item));
    },
    disconnect(): void {
      observer.disconnect();
    },
  };
}

export function createImageWatcher(
  container: HTMLElement,
  onImageLoad: () => void,
): ObserverHandle {
  let currentImages: HTMLImageElement[] = [];
  const listeners = new Map<HTMLImageElement, EventListener>();

  const attach = (): void => {
    currentImages = Array.from(container.querySelectorAll("img"));
    currentImages.forEach((img) => {
      const listener: EventListener = () => {
        onImageLoad();
      };
      listeners.set(img, listener);
      img.addEventListener("load", listener);
    });
  };

  const detach = (): void => {
    listeners.forEach((listener, img) => {
      img.removeEventListener("load", listener);
    });
    listeners.clear();
    currentImages = [];
  };

  attach();

  return {
    refresh(): void {
      detach();
      attach();
    },
    disconnect(): void {
      detach();
    },
  };
}

export function createMutationWatcher(
  container: HTMLElement,
  onMutate: () => void,
): ObserverHandle {
  if (typeof MutationObserver === "undefined") {
    return {
      refresh: () => {},
      disconnect: () => {},
    };
  }

  const observer = new MutationObserver(() => {
    onMutate();
  });

  observer.observe(container, {
    childList: true,
  });

  return {
    refresh: () => {},
    disconnect(): void {
      observer.disconnect();
    },
  };
}
