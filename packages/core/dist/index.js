// src/algorithms/css-columns.ts
function cssColumnsLayout(itemCount, columns) {
  const safeColumns = Math.max(1, columns);
  const result = Array.from({ length: safeColumns }, () => []);
  for (let i = 0; i < itemCount; i += 1) {
    result[i % safeColumns]?.push(i);
  }
  return result;
}

// src/algorithms/shortest-column.ts
function getShortestColumnIndex(columnHeights) {
  let minIndex = 0;
  let minHeight = columnHeights[0] ?? 0;
  for (let i = 1; i < columnHeights.length; i += 1) {
    const current = columnHeights[i] ?? 0;
    if (current < minHeight) {
      minHeight = current;
      minIndex = i;
    }
  }
  return minIndex;
}
var shortestColumnLayout = (items, options) => {
  const columns = Math.max(1, options.columns);
  const gap = Math.max(0, options.gap);
  const columnWidth = Math.max(0, options.columnWidth);
  const columnHeights = Array.from({ length: columns }, () => 0);
  const layoutItems = items.map((item) => {
    const column = getShortestColumnIndex(columnHeights);
    const x = column * (columnWidth + gap);
    const y = columnHeights[column] ?? 0;
    columnHeights[column] = y + item.height + gap;
    return {
      index: item.index,
      x,
      y,
      width: item.width,
      height: item.height,
      column
    };
  });
  const tallestColumn = Math.max(0, ...columnHeights);
  return {
    items: layoutItems,
    containerHeight: layoutItems.length > 0 ? tallestColumn - gap : 0,
    columns,
    gap
  };
};

// src/config.ts
var defaultConfig = {
  strategy: "auto",
  order: "dom",
  maxColumns: 12,
  gapPx: 16,
  itemSelector: "[data-masonry-item]",
  observeResize: true,
  observeMutations: false,
  relayoutOnImages: true,
  useTransforms: true,
  transition: {
    enabled: true,
    durationMs: 200,
    easing: "cubic-bezier(0.2,0,0,1)"
  },
  instrumentation: {
    enabled: false,
    markPerformance: false
  }
};
function resolveConfig(partial = {}) {
  return {
    ...defaultConfig,
    ...partial,
    transition: {
      ...defaultConfig.transition,
      ...partial.transition ?? {}
    },
    instrumentation: {
      ...defaultConfig.instrumentation,
      ...partial.instrumentation ?? {}
    }
  };
}

// src/events.ts
function createEventBus() {
  const handlers = /* @__PURE__ */ new Set();
  return {
    emit(event) {
      handlers.forEach((handler) => {
        handler(event);
      });
    },
    on(handler) {
      handlers.add(handler);
      return () => {
        handlers.delete(handler);
      };
    },
    destroy() {
      handlers.clear();
    }
  };
}

// src/instrumentation.ts
function createInstrumentation(markPerformance) {
  let layoutCount = 0;
  let totalDuration = 0;
  let lastDurationMs = 0;
  return {
    track(label, run) {
      const startMark = `${label}:start`;
      const endMark = `${label}:end`;
      const measureMark = `${label}:measure`;
      if (markPerformance && "performance" in globalThis) {
        performance.mark(startMark);
      }
      const start = performance.now();
      const result = run();
      const end = performance.now();
      if (markPerformance && "performance" in globalThis) {
        performance.mark(endMark);
        performance.measure(measureMark, startMark, endMark);
      }
      lastDurationMs = end - start;
      totalDuration += lastDurationMs;
      layoutCount += 1;
      return result;
    },
    getStats() {
      return {
        layoutCount,
        lastDurationMs,
        avgDurationMs: layoutCount === 0 ? 0 : totalDuration / layoutCount
      };
    }
  };
}

// src/registry.ts
var registry = /* @__PURE__ */ new Map([["js-masonry", shortestColumnLayout]]);
function registerAlgorithm(name, impl) {
  registry.set(name, impl);
}
function getAlgorithm(name) {
  const algorithm = registry.get(name);
  if (!algorithm) {
    throw new Error(`Unknown masonry algorithm: ${name}`);
  }
  return algorithm;
}

// src/scheduler.ts
var raf = globalThis.requestAnimationFrame ? (callback) => globalThis.requestAnimationFrame(() => callback()) : (callback) => globalThis.setTimeout(callback, 16);
var caf = globalThis.cancelAnimationFrame ? (handle) => globalThis.cancelAnimationFrame(handle) : (handle) => globalThis.clearTimeout(handle);
function createScheduler() {
  let frameId = null;
  let queuedWork = null;
  const flush = () => {
    const work = queuedWork;
    queuedWork = null;
    frameId = null;
    work?.();
  };
  return {
    request(work) {
      queuedWork = work;
      if (frameId !== null) {
        return;
      }
      frameId = raf(() => {
        flush();
      });
    },
    flush,
    cancel() {
      if (frameId !== null) {
        caf(frameId);
        frameId = null;
      }
      queuedWork = null;
    }
  };
}
export {
  createEventBus,
  createInstrumentation,
  createScheduler,
  cssColumnsLayout,
  getAlgorithm,
  registerAlgorithm,
  resolveConfig,
  shortestColumnLayout
};
//# sourceMappingURL=index.js.map