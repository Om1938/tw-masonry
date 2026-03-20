"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  masonry: () => masonry
});
module.exports = __toCommonJS(index_exports);

// src/masonry-action.ts
var import_dom = require("@tw-masonry/dom");
function masonry(node, config) {
  let controller = (0, import_dom.createMasonry)(
    node,
    config
  );
  return {
    destroy() {
      controller?.destroy();
      controller = null;
    },
    update(newConfig) {
      if (controller) {
        controller.destroy();
      }
      controller = (0, import_dom.createMasonry)(node, newConfig);
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  masonry
});
//# sourceMappingURL=index.cjs.map