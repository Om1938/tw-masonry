import {
  createEventBus,
  createInstrumentation,
  createScheduler,
  resolveConfig,
  shortestColumnLayout,
  type MasonryConfig,
  type MasonryController,
  type MasonryEvent,
} from "@tw-masonry/core";
import {
  applyCssColumns,
  applyJsLayout,
  clearItemPositionStyles,
} from "./apply.js";
import { getItems, measureItems, readCssLayoutVars } from "./measure.js";
import {
  createImageWatcher,
  createMutationWatcher,
  createResizeWatcher,
  type ObserverHandle,
} from "./observers.js";
import { resolveStrategy } from "./strategy-resolver.js";

function mergeConfig(
  current: MasonryConfig,
  partial: Partial<MasonryConfig>,
): MasonryConfig {
  const next: Partial<MasonryConfig> = {
    ...current,
    ...partial,
  };

  if (partial.transition) {
    next.transition = {
      ...(current.transition ?? {
        enabled: true,
        durationMs: 200,
        easing: "cubic-bezier(0.2,0,0,1)",
      }),
      ...partial.transition,
    };
  }

  if (partial.instrumentation) {
    next.instrumentation = {
      ...(current.instrumentation ?? {
        enabled: false,
        markPerformance: false,
      }),
      ...partial.instrumentation,
    };
  }

  return resolveConfig(next);
}

function toElementArray(items: Element[] | NodeListOf<Element>): HTMLElement[] {
  return Array.from(items).filter(
    (item): item is HTMLElement => item instanceof HTMLElement,
  );
}

export function createMasonry(
  container: HTMLElement,
  partialConfig: Partial<MasonryConfig> = {},
): MasonryController {
  let config = resolveConfig(partialConfig);
  let strategy = resolveStrategy(config);
  const eventBus = createEventBus<MasonryEvent>();
  const scheduler = createScheduler();
  const instrumentation = createInstrumentation(
    config.instrumentation?.markPerformance ?? false,
  );

  let resizeHandle: ObserverHandle | null = null;
  let imageHandle: ObserverHandle | null = null;
  let mutationHandle: ObserverHandle | null = null;

  const refreshObservers = (items: HTMLElement[]): void => {
    resizeHandle?.refresh(items);
    imageHandle?.refresh(items);
    mutationHandle?.refresh(items);
  };

  const setupObservers = (): void => {
    const items = getItems(
      container,
      config.itemSelector ?? "[data-masonry-item]",
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

  const teardownObservers = (): void => {
    resizeHandle?.disconnect();
    imageHandle?.disconnect();
    mutationHandle?.disconnect();
    resizeHandle = null;
    imageHandle = null;
    mutationHandle = null;
  };

  const layout = (reason?: string): void => {
    scheduler.request(() => {
      const nowStrategy = resolveStrategy(config);
      if (nowStrategy !== strategy) {
        eventBus.emit({
          type: "strategyChange",
          from: strategy,
          to: nowStrategy,
        });
        strategy = nowStrategy;
      }

      if (reason === undefined) {
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

        if (
          strategy === "css-columns" ||
          strategy === "css-grid-dense" ||
          strategy === "native-masonry"
        ) {
          const vars = readCssLayoutVars(container, config);
          clearItemPositionStyles(items);
          applyCssColumns(container, items, vars.columns, vars.gap);
          const endedAt = performance.now();
          eventBus.emit({
            type: "layoutEnd",
            durationMs: endedAt - startedAt,
            placed: items.length,
          });
          refreshObservers(items);
          return;
        }

        instrumentation.track("layout", () => {
          const measuredItems = measureItems(container, selector);
          const vars = readCssLayoutVars(container, config);
          const width =
            container.clientWidth || container.getBoundingClientRect().width;
          const availableWidth = Math.max(
            1,
            width - vars.gap * (vars.columns - 1),
          );
          const columnWidth = Math.max(1, availableWidth / vars.columns);
          const layoutResult = shortestColumnLayout(
            measuredItems.map((item) => ({
              index: item.index,
              width: columnWidth,
              height: item.height,
            })),
            {
              columns: vars.columns,
              gap: vars.gap,
              columnWidth,
            },
          );

          applyJsLayout(container, measuredItems, layoutResult, config);
          refreshObservers(items);

          const endedAt = performance.now();
          eventBus.emit({
            type: "layoutEnd",
            durationMs: endedAt - startedAt,
            placed: measuredItems.length,
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
    add(items: Element[] | NodeListOf<Element>): void {
      toElementArray(items).forEach((item) => {
        if (!container.contains(item)) {
          container.appendChild(item);
        }
      });
      layout("add");
    },
    remove(items: Element[] | NodeListOf<Element>): void {
      toElementArray(items).forEach((item) => {
        if (item.parentElement === container) {
          container.removeChild(item);
        }
      });
      layout("remove");
    },
    setOptions(partial: Partial<MasonryConfig>): void {
      config = mergeConfig(config, partial);
      layout("setOptions");
    },
    on(handler: (event: MasonryEvent) => void): () => void {
      return eventBus.on(handler);
    },
    destroy(): void {
      scheduler.cancel();
      teardownObservers();

      const items = getItems(
        container,
        config.itemSelector ?? "[data-masonry-item]",
      );
      clearItemPositionStyles(items);
      container.style.height = "";
      container.style.columnCount = "";
      container.style.columnGap = "";
      container.style.position = "";

      eventBus.destroy();
    },
  };
}
