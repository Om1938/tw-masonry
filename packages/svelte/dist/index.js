// src/masonry-action.ts
import { createMasonry } from "@tw-masonry/dom";
function masonry(node, config) {
  let controller = createMasonry(
    node,
    config
  );
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
    }
  };
}
export {
  masonry
};
//# sourceMappingURL=index.js.map