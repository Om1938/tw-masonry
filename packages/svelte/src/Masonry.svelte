<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import type { MasonryConfig } from "@tw-masonry/core";
  import { masonry } from "./masonry-action.js";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Masonry layout configuration */
    config?: Partial<MasonryConfig>;
  }

  let { config, class: className, ...rest }: Props = $props();
</script>

<!--
  MasonryGrid component for Svelte

  @example
  <MasonryGrid config={{ maxColumns: 4 }} class="gap-4">
    <div>Item 1</div>
    <div>Item 2</div>
  </MasonryGrid>
-->
<div use:masonry={config} class="masonry {className}" {...rest}>
  <slot />
</div>

<style>
  /* Base masonry styles handled by Tailwind CSS */
</style>
