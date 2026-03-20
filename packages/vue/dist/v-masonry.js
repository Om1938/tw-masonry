import { createMasonry } from "@tw-masonry/dom";
/**
 * Vue directive for applying masonry layout: v-masonry="config"
 * @example
 * <div v-masonry="{ maxColumns: 4, order: 'dom' }">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </div>
 */
export const vMasonry = {
    mounted(el, binding) {
        el.__masonryController = createMasonry(el, binding.value);
    },
    updated(el, binding) {
        // Destroy old layout and create new one if config changed
        if (el.__masonryController) {
            el.__masonryController.destroy();
        }
        el.__masonryController = createMasonry(el, binding.value);
    },
    unmounted(el) {
        el.__masonryController?.destroy();
        delete el.__masonryController;
    },
};
//# sourceMappingURL=v-masonry.js.map