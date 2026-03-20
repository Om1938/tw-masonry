import { useEffect, useRef } from "react";
import { createMasonry } from "@tw-masonry/dom";
/**
 * React hook to apply masonry layout to a container element
 * @param config - partial masonry configuration
 * @returns ref object to attach to the container element
 */
export function useMasonry(config) {
    const containerRef = useRef(null);
    const controllerRef = useRef(null);
    useEffect(() => {
        if (!containerRef.current)
            return;
        // Create masonry layout
        controllerRef.current = createMasonry(containerRef.current, config);
        // Cleanup on unmount or config change
        return () => {
            controllerRef.current?.destroy();
            controllerRef.current = null;
        };
    }, [config]);
    return containerRef;
}
//# sourceMappingURL=use-masonry.js.map