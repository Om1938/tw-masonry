// src/use-masonry.ts
import { useEffect, useRef } from "react";
import { createMasonry } from "@tw-masonry/dom";
function useMasonry(config) {
  const containerRef = useRef(null);
  const controllerRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return;
    controllerRef.current = createMasonry(containerRef.current, config);
    return () => {
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, [config]);
  return containerRef;
}

// src/MasonryGrid.tsx
import React from "react";
import { jsx } from "react/jsx-runtime";
var MasonryGrid = React.forwardRef(
  ({ config, as, children, className, ...props }, ref) => {
    const containerRef = useMasonry(config);
    const Component = as || "div";
    React.useImperativeHandle(ref, () => containerRef.current);
    return /* @__PURE__ */ jsx(
      Component,
      {
        ...props,
        ref: containerRef,
        className: `masonry ${className ?? ""}`,
        children
      }
    );
  }
);
MasonryGrid.displayName = "MasonryGrid";
export {
  MasonryGrid,
  useMasonry
};
//# sourceMappingURL=index.js.map