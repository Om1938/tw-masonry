"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  applyCssColumns: () => applyCssColumns,
  applyJsLayout: () => applyJsLayout,
  clearItemPositionStyles: () => clearItemPositionStyles,
  createImageWatcher: () => createImageWatcher,
  createMasonry: () => createMasonry,
  createMutationWatcher: () => createMutationWatcher,
  createResizeWatcher: () => createResizeWatcher,
  getItems: () => getItems,
  measureItems: () => measureItems,
  readCssLayoutVars: () => readCssLayoutVars,
  resolveStrategy: () => resolveStrategy
});
module.exports = __toCommonJS(index_exports);

// src/apply.ts
function shouldReduceMotion() {
  if (typeof matchMedia !== "function") {
    return false;
  }
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function clearItemPositionStyles(items) {
  items.forEach((item) => {
    item.style.position = "";
    item.style.left = "";
    item.style.top = "";
    item.style.transform = "";
    item.style.transition = "";
    item.style.width = "";
    item.style.marginBottom = "";
    item.style.breakInside = "";
  });
}
function applyCssColumns(container, items, columns, gap) {
  container.style.position = "";
  container.style.height = "";
  container.style.columnCount = String(columns);
  container.style.columnGap = `${gap}px`;
  items.forEach((item) => {
    item.style.breakInside = "avoid";
    item.style.marginBottom = `${gap}px`;
  });
}
function applyJsLayout(container, measuredItems, layout, config) {
  if (!container.style.position || container.style.position === "static") {
    container.style.position = "relative";
  }
  container.style.columnCount = "";
  container.style.columnGap = "";
  container.style.height = `${layout.containerHeight}px`;
  const transition = config.transition?.enabled && !shouldReduceMotion() ? `transform ${config.transition.durationMs}ms ${config.transition.easing}` : "";
  for (const layoutItem of layout.items) {
    const measured = measuredItems[layoutItem.index];
    if (!measured) {
      continue;
    }
    const element = measured.element;
    element.style.position = "absolute";
    element.style.width = `${layoutItem.width}px`;
    element.style.marginBottom = "";
    element.style.breakInside = "";
    element.style.transition = transition;
    if (config.useTransforms ?? true) {
      element.style.left = "0px";
      element.style.top = "0px";
      element.style.transform = `translate(${layoutItem.x}px, ${layoutItem.y}px)`;
    } else {
      element.style.transform = "";
      element.style.left = `${layoutItem.x}px`;
      element.style.top = `${layoutItem.y}px`;
    }
  }
}

// src/create-masonry.ts
var import_core = require("@tw-masonry/core");

// src/measure.ts
function parseNumber(value) {
  if (!value) {
    return null;
  }
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}
function getItems(container, selector) {
  return Array.from(container.querySelectorAll(selector));
}
function readCssLayoutVars(container, config) {
  const styles = getComputedStyle(container);
  const cssColumns = parseNumber(styles.getPropertyValue("--masonry-cols"));
  const cssGap = parseNumber(styles.getPropertyValue("--masonry-gap"));
  return {
    columns: Math.max(1, Math.floor(cssColumns ?? 1)),
    gap: Math.max(0, cssGap ?? config.gapPx ?? 16)
  };
}
function measureItems(container, selector) {
  const items = getItems(container, selector);
  return items.map((element, index) => {
    const width = element.offsetWidth || element.getBoundingClientRect().width;
    const height = element.offsetHeight || element.getBoundingClientRect().height;
    return {
      element,
      index,
      width,
      height
    };
  });
}

// src/observers.ts
function createResizeWatcher(container, items, onResize) {
  if (typeof ResizeObserver === "undefined") {
    return {
      refresh: () => {
      },
      disconnect: () => {
      }
    };
  }
  const observer = new ResizeObserver((entries) => {
    const target = entries[0]?.target;
    onResize(target instanceof HTMLElement ? target : void 0);
  });
  observer.observe(container);
  items.forEach((item) => observer.observe(item));
  return {
    refresh(nextItems) {
      observer.disconnect();
      observer.observe(container);
      nextItems.forEach((item) => observer.observe(item));
    },
    disconnect() {
      observer.disconnect();
    }
  };
}
function createImageWatcher(container, onImageLoad) {
  let currentImages = [];
  const listeners = /* @__PURE__ */ new Map();
  const attach = () => {
    currentImages = Array.from(container.querySelectorAll("img"));
    currentImages.forEach((img) => {
      const listener = () => {
        onImageLoad();
      };
      listeners.set(img, listener);
      img.addEventListener("load", listener);
    });
  };
  const detach = () => {
    listeners.forEach((listener, img) => {
      img.removeEventListener("load", listener);
    });
    listeners.clear();
    currentImages = [];
  };
  attach();
  return {
    refresh() {
      detach();
      attach();
    },
    disconnect() {
      detach();
    }
  };
}
function createMutationWatcher(container, onMutate) {
  if (typeof MutationObserver === "undefined") {
    return {
      refresh: () => {
      },
      disconnect: () => {
      }
    };
  }
  const observer = new MutationObserver(() => {
    onMutate();
  });
  observer.observe(container, {
    childList: true
  });
  return {
    refresh: () => {
    },
    disconnect() {
      observer.disconnect();
    }
  };
}

// src/strategy-resolver.ts
function supportsNativeMasonry() {
  if (typeof CSS === "undefined" || typeof CSS.supports !== "function") {
    return false;
  }
  return CSS.supports("display", "grid-lanes") || CSS.supports("grid-template-rows", "masonry") || CSS.supports("grid-template-columns", "masonry");
}
function resolveStrategy(config) {
  if (config.strategy !== "auto") {
    return config.strategy;
  }
  if (supportsNativeMasonry()) {
    return "native-masonry";
  }
  return "js-masonry";
}

// src/create-masonry.ts
function mergeConfig(current, partial) {
  const next = {
    ...current,
    ...partial
  };
  if (partial.transition) {
    next.transition = {
      ...current.transition ?? {
        enabled: true,
        durationMs: 200,
        easing: "cubic-bezier(0.2,0,0,1)"
      },
      ...partial.transition
    };
  }
  if (partial.instrumentation) {
    next.instrumentation = {
      ...current.instrumentation ?? {
        enabled: false,
        markPerformance: false
      },
      ...partial.instrumentation
    };
  }
  return (0, import_core.resolveConfig)(next);
}
function toElementArray(items) {
  return Array.from(items).filter(
    (item) => item instanceof HTMLElement
  );
}
function createMasonry(container, partialConfig = {}) {
  let config = (0, import_core.resolveConfig)(partialConfig);
  let strategy = resolveStrategy(config);
  const eventBus = (0, import_core.createEventBus)();
  const scheduler = (0, import_core.createScheduler)();
  const instrumentation = (0, import_core.createInstrumentation)(
    config.instrumentation?.markPerformance ?? false
  );
  let resizeHandle = null;
  let imageHandle = null;
  let mutationHandle = null;
  const refreshObservers = (items) => {
    resizeHandle?.refresh(items);
    imageHandle?.refresh(items);
    mutationHandle?.refresh(items);
  };
  const setupObservers = () => {
    const items = getItems(
      container,
      config.itemSelector ?? "[data-masonry-item]"
    );
    if (config.observeResize) {
      resizeHandle = createResizeWatcher(container, items, (item) => {
        if (item) {
          eventBus.emit({ type: "itemResize", item });
        }
        layout("resize");
      });
    }
    if (config.relayoutOnImages) {
      imageHandle = createImageWatcher(container, () => {
        layout("imageLoad");
      });
    }
    if (config.observeMutations) {
      mutationHandle = createMutationWatcher(container, () => {
        layout("mutation");
      });
    }
  };
  const teardownObservers = () => {
    resizeHandle?.disconnect();
    imageHandle?.disconnect();
    mutationHandle?.disconnect();
    resizeHandle = null;
    imageHandle = null;
    mutationHandle = null;
  };
  const layout = (reason) => {
    scheduler.request(() => {
      const nowStrategy = resolveStrategy(config);
      if (nowStrategy !== strategy) {
        eventBus.emit({
          type: "strategyChange",
          from: strategy,
          to: nowStrategy
        });
        strategy = nowStrategy;
      }
      if (reason === void 0) {
        eventBus.emit({ type: "layoutStart" });
      } else {
        eventBus.emit({ type: "layoutStart", reason });
      }
      const startedAt = performance.now();
      try {
        const selector = config.itemSelector ?? "[data-masonry-item]";
        const items = getItems(container, selector);
        if (items.length === 0) {
          container.style.height = "";
          eventBus.emit({ type: "layoutEnd", durationMs: 0, placed: 0 });
          return;
        }
        if (strategy === "css-columns" || strategy === "css-grid-dense" || strategy === "native-masonry") {
          const vars = readCssLayoutVars(container, config);
          clearItemPositionStyles(items);
          applyCssColumns(container, items, vars.columns, vars.gap);
          const endedAt = performance.now();
          eventBus.emit({
            type: "layoutEnd",
            durationMs: endedAt - startedAt,
            placed: items.length
          });
          refreshObservers(items);
          return;
        }
        instrumentation.track("layout", () => {
          const measuredItems = measureItems(container, selector);
          const vars = readCssLayoutVars(container, config);
          const width = container.clientWidth || container.getBoundingClientRect().width;
          const availableWidth = Math.max(
            1,
            width - vars.gap * (vars.columns - 1)
          );
          const columnWidth = Math.max(1, availableWidth / vars.columns);
          const layoutResult = (0, import_core.shortestColumnLayout)(
            measuredItems.map((item) => {
              const rawSpan = item.element.dataset["masonrySpan"];
              const span = rawSpan ? Math.max(1, parseInt(rawSpan, 10) || 1) : 1;
              return {
                index: item.index,
                width: columnWidth,
                height: item.height,
                span
              };
            }),
            {
              columns: vars.columns,
              gap: vars.gap,
              columnWidth
            }
          );
          applyJsLayout(container, measuredItems, layoutResult, config);
          refreshObservers(items);
          const endedAt = performance.now();
          eventBus.emit({
            type: "layoutEnd",
            durationMs: endedAt - startedAt,
            placed: measuredItems.length
          });
        });
      } catch (error) {
        eventBus.emit({ type: "error", error });
      }
    });
  };
  setupObservers();
  layout("init");
  return {
    layout,
    add(items) {
      toElementArray(items).forEach((item) => {
        if (!container.contains(item)) {
          container.appendChild(item);
        }
      });
      layout("add");
    },
    remove(items) {
      toElementArray(items).forEach((item) => {
        if (item.parentElement === container) {
          container.removeChild(item);
        }
      });
      layout("remove");
    },
    setOptions(partial) {
      config = mergeConfig(config, partial);
      layout("setOptions");
    },
    on(handler) {
      return eventBus.on(handler);
    },
    destroy() {
      scheduler.cancel();
      teardownObservers();
      const items = getItems(
        container,
        config.itemSelector ?? "[data-masonry-item]"
      );
      clearItemPositionStyles(items);
      container.style.height = "";
      container.style.columnCount = "";
      container.style.columnGap = "";
      container.style.position = "";
      eventBus.destroy();
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  applyCssColumns,
  applyJsLayout,
  clearItemPositionStyles,
  createImageWatcher,
  createMasonry,
  createMutationWatcher,
  createResizeWatcher,
  getItems,
  measureItems,
  readCssLayoutVars,
  resolveStrategy
});
//# sourceMappingURL=index.cjs.map