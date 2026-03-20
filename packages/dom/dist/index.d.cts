import { ItemRect, MasonryConfig, LayoutResult, MasonryController, MasonryStrategy } from '@tw-masonry/core';

interface MeasuredItem extends ItemRect {
    element: HTMLElement;
}
interface CssLayoutVars {
    columns: number;
    gap: number;
}
declare function getItems(container: HTMLElement, selector: string): HTMLElement[];
declare function readCssLayoutVars(container: HTMLElement, config: MasonryConfig): CssLayoutVars;
declare function measureItems(container: HTMLElement, selector: string): MeasuredItem[];

declare function clearItemPositionStyles(items: HTMLElement[]): void;
declare function applyCssColumns(container: HTMLElement, items: HTMLElement[], columns: number, gap: number): void;
declare function applyJsLayout(container: HTMLElement, measuredItems: MeasuredItem[], layout: LayoutResult, config: MasonryConfig): void;

declare function createMasonry(container: HTMLElement, partialConfig?: Partial<MasonryConfig>): MasonryController;

interface ObserverHandle {
    refresh(nextItems: HTMLElement[]): void;
    disconnect(): void;
}
declare function createResizeWatcher(container: HTMLElement, items: HTMLElement[], onResize: (item?: HTMLElement) => void): ObserverHandle;
declare function createImageWatcher(container: HTMLElement, onImageLoad: () => void): ObserverHandle;
declare function createMutationWatcher(container: HTMLElement, onMutate: () => void): ObserverHandle;

declare function resolveStrategy(config: MasonryConfig): MasonryStrategy;

export { type CssLayoutVars, type MeasuredItem, type ObserverHandle, applyCssColumns, applyJsLayout, clearItemPositionStyles, createImageWatcher, createMasonry, createMutationWatcher, createResizeWatcher, getItems, measureItems, readCssLayoutVars, resolveStrategy };
