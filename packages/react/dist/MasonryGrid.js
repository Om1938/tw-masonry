import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import { useMasonry } from "./use-masonry.js";
/**
 * React component for masonry grid layout
 * @example
 * <MasonryGrid config={{ maxColumns: 4 }}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </MasonryGrid>
 */
export const MasonryGrid = React.forwardRef(({ config, as, children, className, ...props }, ref) => {
    const containerRef = useMasonry(config);
    const Component = (as || "div");
    // Merge refs
    React.useImperativeHandle(ref, () => containerRef.current);
    return (_jsx(Component, { ...props, ref: containerRef, className: `masonry ${className ?? ""}`, children: children }));
});
MasonryGrid.displayName = "MasonryGrid";
//# sourceMappingURL=MasonryGrid.js.map