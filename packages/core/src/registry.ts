import { shortestColumnLayout } from "./algorithms/shortest-column.js";
import type { LayoutAlgorithm } from "./types.js";

const registry = new Map<string, LayoutAlgorithm>([["js-masonry", shortestColumnLayout]]);

export function registerAlgorithm(name: string, impl: LayoutAlgorithm): void {
  registry.set(name, impl);
}

export function getAlgorithm(name: string): LayoutAlgorithm {
  const algorithm = registry.get(name);
  if (!algorithm) {
    throw new Error(`Unknown masonry algorithm: ${name}`);
  }

  return algorithm;
}
