import { MasonryConfig } from '@tw-masonry/core';
export { MasonryConfig, MasonryController, MasonryStrategy } from '@tw-masonry/core';
import React$1 from 'react';

/**
 * React hook to apply masonry layout to a container element
 * @param config - partial masonry configuration
 * @returns ref object to attach to the container element
 */
declare function useMasonry(config?: Partial<MasonryConfig>): React.RefObject<HTMLDivElement>;

interface MasonryGridProps extends React$1.HTMLAttributes<HTMLDivElement> {
    /** Masonry layout configuration */
    config?: Partial<MasonryConfig>;
    /** Container element type (default: 'div') */
    as?: React$1.ElementType;
    /** Child elements to layout */
    children?: React$1.ReactNode;
}
/**
 * React component for masonry grid layout
 * @example
 * <MasonryGrid config={{ maxColumns: 4 }}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </MasonryGrid>
 */
declare const MasonryGrid: React$1.ForwardRefExoticComponent<MasonryGridProps & React$1.RefAttributes<HTMLDivElement>>;

export { MasonryGrid, type MasonryGridProps, useMasonry };
