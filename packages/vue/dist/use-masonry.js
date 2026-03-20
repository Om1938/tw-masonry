import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { createMasonry } from "@tw-masonry/dom";
/**
 * Vue composable to apply masonry layout to a container element
 * @param config - partial masonry configuration
 * @returns ref object to attach to the container element
 */
export function useMasonry(config) {
    const containerRef = ref(null);
    const controllerRef = ref(null);
    onMounted(() => {
        if (containerRef.value) {
            controllerRef.value = createMasonry(containerRef.value, config);
        }
    });
    watch(() => config, (newConfig) => {
        if (containerRef.value) {
            controllerRef.value?.destroy();
            controllerRef.value = createMasonry(containerRef.value, newConfig);
        }
    }, { deep: true });
    onBeforeUnmount(() => {
        controllerRef.value?.destroy();
    });
    return containerRef;
}
//# sourceMappingURL=use-masonry.js.map