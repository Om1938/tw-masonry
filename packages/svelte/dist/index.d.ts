import { MasonryConfig } from '@tw-masonry/core';
export { MasonryConfig, MasonryController, MasonryStrategy } from '@tw-masonry/core';

/**
 * Svelte action to apply masonry layout to a DOM element
 * @example
 * <div use:masonry={{ maxColumns: 4, order: 'dom' }}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </div>
 */
declare function masonry(node: HTMLElement, config?: Partial<MasonryConfig>): {
    destroy: () => void;
    update: (newConfig?: Partial<MasonryConfig>) => void;
};

export { masonry };
