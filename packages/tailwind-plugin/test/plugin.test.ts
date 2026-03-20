import { describe, expect, it, vi } from "vitest";
import type { PluginAPI } from "tailwindcss/plugin";
import masonry from "../src/plugin.js";

function makeMockApi(spacingOverride?: Record<string, string>): PluginAPI {
  return {
    addBase: vi.fn(),
    addComponents: vi.fn(),
    addUtilities: vi.fn(),
    matchUtilities: vi.fn(),
    matchComponents: vi.fn(),
    addVariant: vi.fn(),
    matchVariant: vi.fn(),
    config: vi.fn(),
    prefix: vi.fn((c: string) => c),
    theme: vi.fn(
      () =>
        spacingOverride ?? {
          "0": "0px",
          "1": "0.25rem",
          "4": "1rem",
          "8": "2rem",
        },
    ),
  } as unknown as PluginAPI;
}

describe("masonryPlugin", () => {
  it("registers base CSS variables with defaults", () => {
    const api = makeMockApi();
    masonry().handler(api);

    expect(api.addBase).toHaveBeenCalledWith({
      ":root": { "--masonry-cols": "3", "--masonry-gap": "1rem" },
    });
  });

  it("accepts custom defaultColumns and defaultGap options", () => {
    const api = makeMockApi();
    masonry({ defaultColumns: 4, defaultGap: "2rem" }).handler(api);

    expect(api.addBase).toHaveBeenCalledWith({
      ":root": { "--masonry-cols": "4", "--masonry-gap": "2rem" },
    });
  });

  it("registers .masonry component", () => {
    const api = makeMockApi();
    masonry().handler(api);

    expect(api.addComponents).toHaveBeenCalledWith({
      ".masonry": { position: "relative" },
    });
  });

  it("registers .masonry-item and @supports utilities", () => {
    const api = makeMockApi();
    masonry().handler(api);

    const calls = vi.mocked(api.addUtilities).mock.calls;
    // .masonry-item
    expect(calls[0]?.[0]).toMatchObject({
      ".masonry-item": { "break-inside": "avoid" },
    });
    // @supports block
    expect(calls[1]?.[0]).toMatchObject({
      "@supports (grid-template-rows: masonry)": {
        ".masonry-native": expect.objectContaining({
          display: "grid",
          "grid-template-rows": "masonry",
        }),
      },
    });
  });

  it("generates masonry-cols matchUtility with correct column count", () => {
    const api = makeMockApi();
    masonry().handler(api);

    const colsCall = vi.mocked(api.matchUtilities).mock.calls[0];
    expect(colsCall).toBeDefined();
    const utilFns = colsCall![0] as Record<string, (v: string) => object>;
    const opts = colsCall![1] as { values: Record<string, string> };

    expect(utilFns["masonry-cols"]!("5")).toEqual({ "--masonry-cols": "5" });
    expect(Object.keys(opts.values ?? {})).toHaveLength(12);
  });

  it("respects maxColumns option", () => {
    const api = makeMockApi();
    masonry({ maxColumns: 6 }).handler(api);

    const colsCall = vi.mocked(api.matchUtilities).mock.calls[0];
    const opts = colsCall![1] as { values: Record<string, string> };
    expect(Object.keys(opts.values ?? {})).toHaveLength(6);
  });

  it("generates masonry-gap matchUtility using theme spacing", () => {
    const api = makeMockApi();
    masonry().handler(api);

    const gapCall = vi.mocked(api.matchUtilities).mock.calls[1];
    expect(gapCall).toBeDefined();
    const utilFns = gapCall![0] as Record<string, (v: string) => object>;
    expect(utilFns["masonry-gap"]!("1rem")).toEqual({
      "--masonry-gap": "1rem",
    });
  });
});
