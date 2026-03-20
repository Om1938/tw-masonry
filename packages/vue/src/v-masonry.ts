import type { DirectiveBinding } from "vue";
import type { MasonryConfig, MasonryController } from "@tw-masonry/core";
import { createMasonry } from "@tw-masonry/dom";

// Extend HTMLDivElement interface to store the controller
declare global {
  interface HTMLDivElement {
    __masonryController?: MasonryController;
  }
}

/**
 * Vue directive for applying masonry layout: v-masonry="config"
 * @example
 * <div v-masonry="{ maxColumns: 4, order: 'dom' }">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </div>
 */
export const vMasonry = {
  mounted(
    el: HTMLDivElement,
    binding: DirectiveBinding<Partial<MasonryConfig>>,
  ) {
    el.__masonryController = createMasonry(el, binding.value);
  },

  updated(
    el: HTMLDivElement,
    binding: DirectiveBinding<Partial<MasonryConfig>>,
  ) {
    // Destroy old layout and create new one if config changed
    if (el.__masonryController) {
      el.__masonryController.destroy();
    }
    el.__masonryController = createMasonry(el, binding.value);
  },

  unmounted(el: HTMLDivElement) {
    el.__masonryController?.destroy();
    delete el.__masonryController;
  },
};
