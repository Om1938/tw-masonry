import { describe, expect, it, vi } from "vitest";
import { resolveConfig } from "@tw-masonry/core";
import { resolveStrategy } from "../src/strategy-resolver.js";

describe("resolveStrategy", () => {
  it("uses explicit strategy when provided", () => {
    const container = document.createElement("div");
    const strategy = resolveStrategy(
      resolveConfig({ strategy: "css-columns" }),
    );

    expect(strategy).toBe("css-columns");
  });

  it("falls back to js-masonry when native support is unavailable", () => {
    const container = document.createElement("div");
    vi.stubGlobal("CSS", { supports: vi.fn(() => false) });

    const strategy = resolveStrategy(resolveConfig({ strategy: "auto" }));

    expect(strategy).toBe("js-masonry");
  });
});
