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
  default: () => plugin_default
});
module.exports = __toCommonJS(index_exports);

// src/plugin.ts
var import_plugin = __toESM(require("tailwindcss/plugin"), 1);
function buildPlugin(options = {}) {
  const { maxColumns = 12, defaultColumns = 3, defaultGap = "1rem" } = options;
  return function({
    addBase,
    addComponents,
    addUtilities,
    matchUtilities,
    theme
  }) {
    addBase({
      ":root": {
        "--masonry-cols": String(defaultColumns),
        "--masonry-gap": defaultGap
      }
    });
    addComponents({
      ".masonry": {
        position: "relative"
      }
    });
    addUtilities({
      ".masonry-item": {
        "break-inside": "avoid"
      }
    });
    const colValues = {};
    for (let i = 1; i <= maxColumns; i++) {
      colValues[String(i)] = String(i);
    }
    matchUtilities(
      {
        "masonry-cols": (value) => ({
          "--masonry-cols": value
        })
      },
      { values: colValues }
    );
    const spacingValues = theme("spacing") ?? {};
    matchUtilities(
      {
        "masonry-gap": (value) => ({
          "--masonry-gap": value
        })
      },
      {
        values: spacingValues,
        type: ["length", "number", "percentage"]
      }
    );
    addUtilities({
      "@supports (grid-template-rows: masonry)": {
        ".masonry-native": {
          display: "grid",
          "grid-template-columns": "repeat(var(--masonry-cols, 3), minmax(0, 1fr))",
          "grid-template-rows": "masonry",
          gap: "var(--masonry-gap, 1rem)"
        }
      }
    });
  };
}
var plugin_default = import_plugin.default.withOptions(
  buildPlugin
);
//# sourceMappingURL=index.cjs.map