// src/use-masonry.ts
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { createMasonry } from "@tw-masonry/dom";
function useMasonry(config) {
  const containerRef = ref(null);
  const controllerRef = ref(null);
  onMounted(() => {
    if (containerRef.value) {
      controllerRef.value = createMasonry(containerRef.value, config);
    }
  });
  watch(
    () => config,
    (newConfig) => {
      if (containerRef.value) {
        controllerRef.value?.destroy();
        controllerRef.value = createMasonry(containerRef.value, newConfig);
      }
    },
    { deep: true }
  );
  onBeforeUnmount(() => {
    controllerRef.value?.destroy();
  });
  return containerRef;
}

// src/v-masonry.ts
import { createMasonry as createMasonry2 } from "@tw-masonry/dom";
var vMasonry = {
  mounted(el, binding) {
    el.__masonryController = createMasonry2(el, binding.value);
  },
  updated(el, binding) {
    if (el.__masonryController) {
      el.__masonryController.destroy();
    }
    el.__masonryController = createMasonry2(el, binding.value);
  },
  unmounted(el) {
    el.__masonryController?.destroy();
    delete el.__masonryController;
  }
};
export {
  useMasonry,
  vMasonry
};
//# sourceMappingURL=index.js.map