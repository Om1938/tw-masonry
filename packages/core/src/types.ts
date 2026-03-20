export type MasonryStrategy =
  | "css-columns"
  | "css-grid-dense"
  | "native-masonry"
  | "js-masonry"
  | "js-packery"
  | "auto";

export type MasonryOrderMode = "dom" | "visual" | "stabilized";

export interface MasonryBreakpointRule {
  columns?: number;
  columnWidth?: number;
  gap?: number;
}

export interface MasonryBreakpoints {
  [key: string]: MasonryBreakpointRule;
}

export interface MasonryTransitionConfig {
  enabled: boolean;
  durationMs: number;
  easing: string;
}

export interface MasonryInstrumentationConfig {
  enabled: boolean;
  markPerformance: boolean;
}

export interface MasonryConfig {
  strategy: MasonryStrategy;
  order: MasonryOrderMode;
  breakpoints?: MasonryBreakpoints;
  maxColumns?: number;
  gapPx?: number;
  itemSelector?: string;
  observeResize?: boolean;
  observeMutations?: boolean;
  relayoutOnImages?: boolean;
  useTransforms?: boolean;
  transition?: MasonryTransitionConfig;
  instrumentation?: MasonryInstrumentationConfig;
}

export type MasonryEvent =
  | { type: "layoutStart"; reason?: string }
  | { type: "layoutEnd"; durationMs: number; placed: number }
  | { type: "itemResize"; item: Element }
  | { type: "strategyChange"; from: MasonryStrategy; to: MasonryStrategy }
  | { type: "error"; error: unknown };

export interface MasonryController {
  layout(reason?: string): void;
  add(items: Element[] | NodeListOf<Element>): void;
  remove(items: Element[] | NodeListOf<Element>): void;
  setOptions(partial: Partial<MasonryConfig>): void;
  on(handler: (event: MasonryEvent) => void): () => void;
  destroy(): void;
}

export interface ItemRect {
  index: number;
  width: number;
  height: number;
}

export interface LayoutItem {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  column: number;
}

export interface LayoutResult {
  items: LayoutItem[];
  containerHeight: number;
  columns: number;
  gap: number;
}

export interface LayoutAlgorithmOptions {
  columns: number;
  gap: number;
  columnWidth: number;
}

export type LayoutAlgorithm = (
  items: ItemRect[],
  options: LayoutAlgorithmOptions,
) => LayoutResult;

export interface MasonryStats {
  layoutCount: number;
  avgDurationMs: number;
  lastDurationMs: number;
}
