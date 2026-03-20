import React from "react";
import type { MasonryConfig } from "@tw-masonry/core";
import { useMasonryController } from "./use-masonry.js";

export interface MasonryGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Masonry layout configuration */
  config?: Partial<MasonryConfig>;
  /** Container element type (default: 'div') */
  as?: React.ElementType;
  /** Child elements to layout */
  children?: React.ReactNode;
}

/**
 * React component for masonry grid layout
 * @example
 * <MasonryGrid config={{ maxColumns: 4 }}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </MasonryGrid>
 */
export const MasonryGrid = React.forwardRef<HTMLDivElement, MasonryGridProps>(
  ({ config, as, children, className, ...props }, ref) => {
    const { ref: containerRef } = useMasonryController(config);
    const Component = (as || "div") as React.ElementType;

    // Merge refs
    React.useImperativeHandle(
      ref,
      () => containerRef.current as HTMLDivElement,
    );

    return (
      <Component
        {...props}
        ref={containerRef}
        className={`masonry ${className ?? ""}`}
      >
        {children}
      </Component>
    );
  },
);

MasonryGrid.displayName = "MasonryGrid";
