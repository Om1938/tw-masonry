import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import type { MasonryConfig, MasonryController } from "@tw-masonry/core";
import { createMasonry } from "@tw-masonry/dom";

/**
 * Vue composable to apply masonry layout to a container element
 * @param config - partial masonry configuration
 * @returns ref object to attach to the container element
 */
export function useMasonry(config?: Partial<MasonryConfig>) {
  const containerRef = ref<HTMLDivElement | null>(null);
  const controllerRef = ref<MasonryController | null>(null);

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
    { deep: true },
  );

  onBeforeUnmount(() => {
    controllerRef.value?.destroy();
  });

  return containerRef;
}
