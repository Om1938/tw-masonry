// src/plugin.ts
import plugin from "tailwindcss/plugin";
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
    addBase({
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
var plugin_default = plugin.withOptions(
  buildPlugin
);
export {
  plugin_default as default
};
//# sourceMappingURL=index.js.map