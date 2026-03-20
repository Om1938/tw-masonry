"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  MasonryGrid: () => MasonryGrid,
  useMasonry: () => useMasonry
});
module.exports = __toCommonJS(index_exports);

// src/use-masonry.ts
var import_react = require("react");
var import_dom = require("@tw-masonry/dom");
function useMasonry(config) {
  const containerRef = (0, import_react.useRef)(null);
  const controllerRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    if (!containerRef.current) return;
    controllerRef.current = (0, import_dom.createMasonry)(containerRef.current, config);
    return () => {
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, [config]);
  return containerRef;
}

// src/MasonryGrid.tsx
var import_react2 = __toESM(require("react"), 1);
var import_jsx_runtime = require("react/jsx-runtime");
var MasonryGrid = import_react2.default.forwardRef(
  ({ config, as, children, className, ...props }, ref) => {
    const containerRef = useMasonry(config);
    const Component = as || "div";
    import_react2.default.useImperativeHandle(ref, () => containerRef.current);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MasonryGrid,
  useMasonry
});
//# sourceMappingURL=index.cjs.map