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
  useMasonry: () => useMasonry,
  vMasonry: () => vMasonry
});
module.exports = __toCommonJS(index_exports);

// src/use-masonry.ts
var import_vue = require("vue");
var import_dom = require("@tw-masonry/dom");
function useMasonry(config) {
  const containerRef = (0, import_vue.ref)(null);
  const controllerRef = (0, import_vue.ref)(null);
  (0, import_vue.onMounted)(() => {
    if (containerRef.value) {
      controllerRef.value = (0, import_dom.createMasonry)(containerRef.value, config);
    }
  });
  (0, import_vue.watch)(
    () => config,
    (newConfig) => {
      if (containerRef.value) {
        controllerRef.value?.destroy();
        controllerRef.value = (0, import_dom.createMasonry)(containerRef.value, newConfig);
      }
    },
    { deep: true }
  );
  (0, import_vue.onBeforeUnmount)(() => {
    controllerRef.value?.destroy();
  });
  return containerRef;
}

// src/v-masonry.ts
var import_dom2 = require("@tw-masonry/dom");
var vMasonry = {
  mounted(el, binding) {
    el.__masonryController = (0, import_dom2.createMasonry)(el, binding.value);
  },
  updated(el, binding) {
    if (el.__masonryController) {
      el.__masonryController.destroy();
    }
    el.__masonryController = (0, import_dom2.createMasonry)(el, binding.value);
  },
  unmounted(el) {
    el.__masonryController?.destroy();
    delete el.__masonryController;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useMasonry,
  vMasonry
});
//# sourceMappingURL=index.cjs.map