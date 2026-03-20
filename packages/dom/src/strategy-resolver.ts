import type { MasonryConfig, MasonryStrategy } from "@tw-masonry/core";

function supportsNativeMasonry(): boolean {
  if (typeof CSS === "undefined" || typeof CSS.supports !== "function") {
    return false;
  }

  return (
    CSS.supports("display", "grid-lanes") ||
    CSS.supports("grid-template-rows", "masonry") ||
    CSS.supports("grid-template-columns", "masonry")
  );
}

export function resolveStrategy(config: MasonryConfig): MasonryStrategy {
  if (config.strategy !== "auto") {
    return config.strategy;
  }

  if (supportsNativeMasonry()) {
    return "native-masonry";
  }

  return "js-masonry";
}
