export { masonry } from "./masonry-action.js";

// For the Masonry component, users should import directly:
// import Masonry from '@tw-masonry/svelte/Masonry.svelte'

// Re-export types from core for convenience
export type {
  MasonryConfig,
  MasonryController,
  MasonryStrategy,
} from "@tw-masonry/core";
