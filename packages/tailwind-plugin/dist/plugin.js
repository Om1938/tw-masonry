import plugin from "tailwindcss/plugin";
function buildPlugin(options = {}) {
    const { maxColumns = 12, defaultColumns = 3, defaultGap = "1rem" } = options;
    return function ({ addBase, addComponents, addUtilities, matchUtilities, theme, }) {
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
        const colValues = {};
        for (let i = 1; i <= maxColumns; i++) {
            colValues[String(i)] = String(i);
        }
        matchUtilities({
            "masonry-cols": (value) => ({
                "--masonry-cols": value,
            }),
        }, { values: colValues });
        // masonry-gap-{spacing} → sets --masonry-gap
        const spacingValues = theme("spacing") ?? {};
        matchUtilities({
            "masonry-gap": (value) => ({
                "--masonry-gap": value,
            }),
        }, {
            values: spacingValues,
            type: ["length", "number", "percentage"],
        });
        // Native CSS masonry via @supports progressive enhancement
        addUtilities({
            "@supports (grid-template-rows: masonry)": {
                ".masonry-native": {
                    display: "grid",
                    "grid-template-columns": "repeat(var(--masonry-cols, 3), minmax(0, 1fr))",
                    "grid-template-rows": "masonry",
                    gap: "var(--masonry-gap, 1rem)",
                },
            },
        });
    };
}
// plugin.withOptions returns an internal type; cast to our public MasonryPlugin type
export default plugin.withOptions(buildPlugin);
//# sourceMappingURL=plugin.js.map