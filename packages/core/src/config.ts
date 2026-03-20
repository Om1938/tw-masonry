import type { MasonryConfig } from "./types.js";

const defaultConfig: Required<
  Omit<MasonryConfig, "breakpoints" | "maxColumns" | "gapPx" | "itemSelector">
> & {
  maxColumns: number;
  gapPx: number;
  itemSelector: string;
} = {
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
    easing: "cubic-bezier(0.2,0,0,1)",
  },
  instrumentation: {
    enabled: false,
    markPerformance: false,
  },
};

export function resolveConfig(partial: Partial<MasonryConfig> = {}): MasonryConfig {
  return {
    ...defaultConfig,
    ...partial,
    transition: {
      ...defaultConfig.transition,
      ...(partial.transition ?? {}),
    },
    instrumentation: {
      ...defaultConfig.instrumentation,
      ...(partial.instrumentation ?? {}),
    },
  };
}
