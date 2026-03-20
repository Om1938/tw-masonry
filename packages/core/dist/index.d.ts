declare function cssColumnsLayout(itemCount: number, columns: number): number[][];

type MasonryStrategy = "css-columns" | "css-grid-dense" | "native-masonry" | "js-masonry" | "js-packery" | "auto";
type MasonryOrderMode = "dom" | "visual" | "stabilized";
interface MasonryBreakpointRule {
    columns?: number;
    columnWidth?: number;
    gap?: number;
}
interface MasonryBreakpoints {
    [key: string]: MasonryBreakpointRule;
}
interface MasonryTransitionConfig {
    enabled: boolean;
    durationMs: number;
    easing: string;
}
interface MasonryInstrumentationConfig {
    enabled: boolean;
    markPerformance: boolean;
}
interface MasonryConfig {
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
type MasonryEvent = {
    type: "layoutStart";
    reason?: string;
} | {
    type: "layoutEnd";
    durationMs: number;
    placed: number;
} | {
    type: "itemResize";
    item: Element;
} | {
    type: "strategyChange";
    from: MasonryStrategy;
    to: MasonryStrategy;
} | {
    type: "error";
    error: unknown;
};
interface MasonryController {
    layout(reason?: string): void;
    add(items: Element[] | NodeListOf<Element>): void;
    remove(items: Element[] | NodeListOf<Element>): void;
    setOptions(partial: Partial<MasonryConfig>): void;
    on(handler: (event: MasonryEvent) => void): () => void;
    destroy(): void;
}
interface ItemRect {
    index: number;
    width: number;
    height: number;
}
interface LayoutItem {
    index: number;
    x: number;
    y: number;
    width: number;
    height: number;
    column: number;
}
interface LayoutResult {
    items: LayoutItem[];
    containerHeight: number;
    columns: number;
    gap: number;
}
interface LayoutAlgorithmOptions {
    columns: number;
    gap: number;
    columnWidth: number;
}
type LayoutAlgorithm = (items: ItemRect[], options: LayoutAlgorithmOptions) => LayoutResult;
interface MasonryStats {
    layoutCount: number;
    avgDurationMs: number;
    lastDurationMs: number;
}

declare const shortestColumnLayout: LayoutAlgorithm;

declare function resolveConfig(partial?: Partial<MasonryConfig>): MasonryConfig;

interface EventBus<TEvent> {
    emit(event: TEvent): void;
    on(handler: (event: TEvent) => void): () => void;
    destroy(): void;
}
declare function createEventBus<TEvent>(): EventBus<TEvent>;

interface Instrumentation {
    track<T>(label: string, run: () => T): T;
    getStats(): MasonryStats;
}
declare function createInstrumentation(markPerformance: boolean): Instrumentation;

declare function registerAlgorithm(name: string, impl: LayoutAlgorithm): void;
declare function getAlgorithm(name: string): LayoutAlgorithm;

interface Scheduler {
    request(work: () => void): void;
    flush(): void;
    cancel(): void;
}
declare function createScheduler(): Scheduler;

export { type EventBus, type ItemRect, type LayoutAlgorithm, type LayoutAlgorithmOptions, type LayoutItem, type LayoutResult, type MasonryBreakpoints, type MasonryConfig, type MasonryController, type MasonryEvent, type MasonryInstrumentationConfig, type MasonryOrderMode, type MasonryStats, type MasonryStrategy, type MasonryTransitionConfig, createEventBus, createInstrumentation, createScheduler, cssColumnsLayout, getAlgorithm, registerAlgorithm, resolveConfig, shortestColumnLayout };
