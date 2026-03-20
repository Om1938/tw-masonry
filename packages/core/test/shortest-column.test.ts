import { describe, expect, it } from "vitest";
import { shortestColumnLayout } from "../src/algorithms/shortest-column.js";

describe("shortestColumnLayout", () => {
  it("places items into the shortest column", () => {
    const result = shortestColumnLayout(
      [
        { index: 0, width: 100, height: 100 },
        { index: 1, width: 100, height: 200 },
        { index: 2, width: 100, height: 80 },
        { index: 3, width: 100, height: 120 },
      ],
      { columns: 2, gap: 10, columnWidth: 100 },
    );

    expect(result.items).toEqual([
      { index: 0, x: 0, y: 0, width: 100, height: 100, column: 0 },
      { index: 1, x: 110, y: 0, width: 100, height: 200, column: 1 },
      { index: 2, x: 0, y: 110, width: 100, height: 80, column: 0 },
      { index: 3, x: 0, y: 200, width: 100, height: 120, column: 0 },
    ]);

    expect(result.containerHeight).toBe(320);
    expect(result.columns).toBe(2);
    expect(result.gap).toBe(10);
  });
});
