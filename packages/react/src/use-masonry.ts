import { useEffect, useLayoutEffect, useRef } from "react";
import type { MasonryConfig, MasonryController } from "@tw-masonry/core";
import { createMasonry } from "@tw-masonry/dom";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export interface UseMasonryControllerResult {
  ref: React.RefObject<HTMLDivElement | null>;
  controller: React.MutableRefObject<MasonryController | null>;
}

export function useMasonryController(
  config?: Partial<MasonryConfig>,
): UseMasonryControllerResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<MasonryController | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current) {
      return;
    }

    controllerRef.current = createMasonry(containerRef.current, config);

    return () => {
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, [config]);

  return {
    ref: containerRef,
    controller: controllerRef,
  };
}

/**
 * React hook to apply masonry layout to a container element
 * @param config - partial masonry configuration
 * @returns ref object to attach to the container element
 */
export function useMasonry(
  config?: Partial<MasonryConfig>,
): React.RefObject<HTMLDivElement | null> {
  return useMasonryController(config).ref;
}
