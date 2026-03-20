import plugin from "tailwindcss/plugin";
import type { PluginAPI, Config } from "tailwindcss/plugin";
import type { MasonryPluginOptions } from "./types.js";

/** Public shape of the plugin export — avoids referencing tailwindcss internals in .d.ts */
export type MasonryPlugin = {
  (options?: MasonryPluginOptions): {
    handler: (api: PluginAPI) => void;
    config?: Partial<Config>;
  };
  __isOptionsFunction: true;
};

function buildPlugin(
  options: MasonryPluginOptions = {},
): (api: PluginAPI) => void {
  const { maxColumns = 12, defaultColumns = 3, defaultGap = "1rem" } = options;

  return function ({
    addBase,
    addComponents,
    addUtilities,
    matchUtilities,
    theme,
  }: PluginAPI) {
    // CSS custom property defaults on :root
    addBase({
      ":root": {
        "--masonry-cols": String(defaultColumns),
        "--masonry-gap": defaultGap,
      },
    });

    // .masonry — layout container
    addComponents({
      ".masonry": {
        position: "relative",
      },
    });

    // .masonry-item — prevents column breaks inside items (css-columns mode)
    addUtilities({
      ".masonry-item": {
        "break-inside": "avoid",
      },
    });

    // masonry-cols-{n} → sets --masonry-cols
    const colValues: Record<string, string> = {};
    for (let i = 1; i <= maxColumns; i++) {
      colValues[String(i)] = String(i);
    }
    matchUtilities(
      {
        "masonry-cols": (value) => ({
          "--masonry-cols": value,
        }),
      },
      { values: colValues },
    );

    // masonry-gap-{spacing} → sets --masonry-gap
    const spacingValues =
      (theme("spacing") as Record<string, string> | undefined) ?? {};
    matchUtilities(
      {
        "masonry-gap": (value) => ({
          "--masonry-gap": value,
        }),
      },
      {
        values: spacingValues,
        type: ["length", "number", "percentage"],
      },
    );

    // Native CSS masonry via @supports progressive enhancement.
    // Using addBase so Tailwind v4 (which restricts addUtilities to class-only
    // selectors) doesn't reject the @supports at-rule wrapper.
    addBase({
      "@supports (grid-template-rows: masonry)": {
        ".masonry-native": {
          display: "grid",
          "grid-template-columns":
            "repeat(var(--masonry-cols, 3), minmax(0, 1fr))",
          "grid-template-rows": "masonry",
          gap: "var(--masonry-gap, 1rem)",
        },
      },
    });
  };
}

// plugin.withOptions returns an internal type; cast to our public MasonryPlugin type
export default plugin.withOptions<MasonryPluginOptions>(
  buildPlugin,
) as MasonryPlugin;
