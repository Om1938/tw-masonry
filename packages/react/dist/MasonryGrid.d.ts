import React from "react";
import type { MasonryConfig } from "@tw-masonry/core";
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
export declare const MasonryGrid: React.ForwardRefExoticComponent<MasonryGridProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=MasonryGrid.d.ts.map