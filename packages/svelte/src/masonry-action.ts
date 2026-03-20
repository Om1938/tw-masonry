import type { MasonryConfig, MasonryController } from "@tw-masonry/core";
import { createMasonry } from "@tw-masonry/dom";

/**
 * Svelte action to apply masonry layout to a DOM element
 * @example
 * <div use:masonry={{ maxColumns: 4, order: 'dom' }}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </div>
 */
export function masonry(
  node: HTMLElement,
  config?: Partial<MasonryConfig>,
): {
  destroy: () => void;
  update: (newConfig?: Partial<MasonryConfig>) => void;
} {
  let controller: MasonryController | null = createMasonry(
    node as HTMLDivElement,
    config,
  );

  return {
    destroy() {
      controller?.destroy();
      controller = null;
    },

    update(newConfig?: Partial<MasonryConfig>) {
      if (controller) {
        controller.destroy();
      }
      controller = createMasonry(node as HTMLDivElement, newConfig);
    },
  };
}
