import { createMasonry } from "@tw-masonry/dom";
/**
 * Svelte action to apply masonry layout to a DOM element
 * @example
 * <div use:masonry={{ maxColumns: 4, order: 'dom' }}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </div>
 */
export function masonry(node, config) {
    let controller = createMasonry(node, config);
    return {
        destroy() {
            controller?.destroy();
            controller = null;
        },
        update(newConfig) {
            if (controller) {
                controller.destroy();
            }
            controller = createMasonry(node, newConfig);
        },
    };
}
//# sourceMappingURL=masonry-action.js.map