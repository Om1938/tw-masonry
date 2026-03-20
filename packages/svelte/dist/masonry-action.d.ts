import type { MasonryConfig } from "@tw-masonry/core";
/**
 * Svelte action to apply masonry layout to a DOM element
 * @example
 * <div use:masonry={{ maxColumns: 4, order: 'dom' }}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </div>
 */
export declare function masonry(node: HTMLElement, config?: Partial<MasonryConfig>): {
    destroy: () => void;
    update: (newConfig?: Partial<MasonryConfig>) => void;
};
//# sourceMappingURL=masonry-action.d.ts.map