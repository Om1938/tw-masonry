export interface Scheduler {
  request(work: () => void): void;
  flush(): void;
  cancel(): void;
}

type FrameHandle = number | ReturnType<typeof globalThis.setTimeout>;

const raf: (callback: () => void) => FrameHandle =
  globalThis.requestAnimationFrame
    ? (callback: () => void) =>
        globalThis.requestAnimationFrame(() => callback())
    : (callback: () => void) => globalThis.setTimeout(callback, 16);

const caf: (handle: FrameHandle) => void = globalThis.cancelAnimationFrame
  ? (handle: FrameHandle) => globalThis.cancelAnimationFrame(handle as number)
  : (handle: FrameHandle) =>
      globalThis.clearTimeout(
        handle as ReturnType<typeof globalThis.setTimeout>,
      );

export function createScheduler(): Scheduler {
  let frameId: FrameHandle | null = null;
  let queuedWork: (() => void) | null = null;

  const flush = (): void => {
    const work = queuedWork;
    queuedWork = null;
    frameId = null;
    work?.();
  };

  return {
    request(work: () => void): void {
      queuedWork = work;
      if (frameId !== null) {
        return;
      }

      frameId = raf(() => {
        flush();
      });
    },
    flush,
    cancel(): void {
      if (frameId !== null) {
        caf(frameId);
        frameId = null;
      }
      queuedWork = null;
    },
  };
}
