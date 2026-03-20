import { useEffect, useRef } from "react";
import type { MasonryConfig, MasonryController } from "@tw-masonry/core";
import { createMasonry } from "@tw-masonry/dom";

/**
 * React hook to apply masonry layout to a container element
 * @param config - partial masonry configuration
 * @returns ref object to attach to the container element
 */
export function useMasonry(
  config?: Partial<MasonryConfig>,
): React.RefObject<HTMLDivElement> {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<MasonryController | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create masonry layout
    controllerRef.current = createMasonry(containerRef.current, config);

    // Cleanup on unmount or config change
    return () => {
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, [config]);

  return containerRef as React.RefObject<HTMLDivElement>;
}
