import type { MasonryStats } from "./types.js";

export interface Instrumentation {
  track<T>(label: string, run: () => T): T;
  getStats(): MasonryStats;
}

export function createInstrumentation(markPerformance: boolean): Instrumentation {
  let layoutCount = 0;
  let totalDuration = 0;
  let lastDurationMs = 0;

  return {
    track<T>(label: string, run: () => T): T {
      const startMark = `${label}:start`;
      const endMark = `${label}:end`;
      const measureMark = `${label}:measure`;

      if (markPerformance && "performance" in globalThis) {
        performance.mark(startMark);
      }

      const start = performance.now();
      const result = run();
      const end = performance.now();

      if (markPerformance && "performance" in globalThis) {
        performance.mark(endMark);
        performance.measure(measureMark, startMark, endMark);
      }

      lastDurationMs = end - start;
      totalDuration += lastDurationMs;
      layoutCount += 1;

      return result;
    },
    getStats(): MasonryStats {
      return {
        layoutCount,
        lastDurationMs,
        avgDurationMs: layoutCount === 0 ? 0 : totalDuration / layoutCount,
      };
    },
  };
}
