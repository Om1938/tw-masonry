import type { ItemRect, MasonryConfig } from "@tw-masonry/core";

export interface MeasuredItem extends ItemRect {
  element: HTMLElement;
}

export interface CssLayoutVars {
  columns: number;
  gap: number;
}

function parseNumber(value: string | null | undefined): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function getItems(
  container: HTMLElement,
  selector: string,
): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(selector));
}

export function readCssLayoutVars(
  container: HTMLElement,
  config: MasonryConfig,
): CssLayoutVars {
  const styles = getComputedStyle(container);
  const cssColumns = parseNumber(styles.getPropertyValue("--masonry-cols"));
  const cssGap = parseNumber(styles.getPropertyValue("--masonry-gap"));

  return {
    columns: Math.max(1, Math.floor(cssColumns ?? 1)),
    gap: Math.max(0, cssGap ?? config.gapPx ?? 16),
  };
}

export function measureItems(
  container: HTMLElement,
  selector: string,
): MeasuredItem[] {
  const items = getItems(container, selector);

  return items.map((element, index) => {
    const width = element.offsetWidth || element.getBoundingClientRect().width;
    const height =
      element.offsetHeight || element.getBoundingClientRect().height;

    return {
      element,
      index,
      width,
      height,
    };
  });
}
