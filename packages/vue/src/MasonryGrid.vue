<template>
  <component :is="as" :class="`masonry ${className}`" v-masonry="config" v-bind="$attrs">
    <slot />
  </component>
</template>

<script setup lang="ts">
import type { MasonryConfig } from "@tw-masonry/core";
import { vMasonry } from "./v-masonry.js";

defineProps<{
  /** Masonry layout configuration */
  config?: Partial<MasonryConfig>;
  /** Container element type (default: 'div') */
  as?: string;
  /** CSS class names */
  className?: string;
}>();

// Register directive for this component
// Note: for proper directives in SFCs, register globally or use vMasonry locally
</script>

<style scoped>
/* Base masonry styles handled by Tailwind CSS */
</style>
