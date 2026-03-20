import { describe, expect, it } from "vitest";
import { resolveConfig } from "../src/config.js";

describe("resolveConfig", () => {
  it("applies defaults", () => {
    const config = resolveConfig();

    expect(config.strategy).toBe("auto");
    expect(config.order).toBe("dom");
    expect(config.gapPx).toBe(16);
    expect(config.observeResize).toBe(true);
    expect(config.transition?.durationMs).toBe(200);
  });

  it("deep merges nested objects", () => {
    const config = resolveConfig({
      transition: { enabled: false, durationMs: 350, easing: "ease-out" },
      instrumentation: { enabled: true, markPerformance: true },
    });

    expect(config.transition?.enabled).toBe(false);
    expect(config.transition?.durationMs).toBe(350);
    expect(config.transition?.easing).toBe("ease-out");
    expect(config.instrumentation?.enabled).toBe(true);
    expect(config.instrumentation?.markPerformance).toBe(true);
  });
});
