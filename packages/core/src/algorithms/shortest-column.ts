import type { ItemRect, LayoutAlgorithm, LayoutResult } from "../types.js";

function getShortestColumnIndex(columnHeights: number[]): number {
  let minIndex = 0;
  let minHeight = columnHeights[0] ?? 0;

  for (let i = 1; i < columnHeights.length; i += 1) {
    const current = columnHeights[i] ?? 0;
    if (current < minHeight) {
      minHeight = current;
      minIndex = i;
    }
  }

  return minIndex;
}

export const shortestColumnLayout: LayoutAlgorithm = (items, options): LayoutResult => {
  const columns = Math.max(1, options.columns);
  const gap = Math.max(0, options.gap);
  const columnWidth = Math.max(0, options.columnWidth);

  const columnHeights = Array.from({ length: columns }, () => 0);

  const layoutItems = items.map((item: ItemRect) => {
    const column = getShortestColumnIndex(columnHeights);
    const x = column * (columnWidth + gap);
    const y = columnHeights[column] ?? 0;

    columnHeights[column] = y + item.height + gap;

    return {
      index: item.index,
      x,
      y,
      width: item.width,
      height: item.height,
      column,
    };
  });

  const tallestColumn = Math.max(0, ...columnHeights);

  return {
    items: layoutItems,
    containerHeight: layoutItems.length > 0 ? tallestColumn - gap : 0,
    columns,
    gap,
  };
};
