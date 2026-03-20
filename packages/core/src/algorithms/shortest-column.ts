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

/**
 * Find the best starting column for an item that spans `span` columns.
 * Returns the startCol where max(columnHeights[startCol..startCol+span-1]) is minimised.
 */
function getBestStartColumn(columnHeights: number[], span: number): number {
  const maxStart = columnHeights.length - span;
  let bestStart = 0;
  let bestMaxHeight = Infinity;

  for (let startCol = 0; startCol <= maxStart; startCol++) {
    let maxH = 0;
    for (let c = startCol; c < startCol + span; c++) {
      maxH = Math.max(maxH, columnHeights[c] ?? 0);
    }
    if (maxH < bestMaxHeight) {
      bestMaxHeight = maxH;
      bestStart = startCol;
    }
  }

  return bestStart;
}

export const shortestColumnLayout: LayoutAlgorithm = (items, options): LayoutResult => {
  const columns = Math.max(1, options.columns);
  const gap = Math.max(0, options.gap);
  const columnWidth = Math.max(0, options.columnWidth);

  const columnHeights = Array.from({ length: columns }, () => 0);

  const layoutItems = items.map((item: ItemRect) => {
    const span = Math.min(Math.max(1, item.span ?? 1), columns);
    const itemWidth = span * columnWidth + (span - 1) * gap;

    const column =
      span === 1
        ? getShortestColumnIndex(columnHeights)
        : getBestStartColumn(columnHeights, span);

    const y = (() => {
      let maxH = 0;
      for (let c = column; c < column + span; c++) {
        maxH = Math.max(maxH, columnHeights[c] ?? 0);
      }
      return maxH;
    })();

    const x = column * (columnWidth + gap);
    const newBottom = y + item.height + gap;

    for (let c = column; c < column + span; c++) {
      columnHeights[c] = newBottom;
    }

    return {
      index: item.index,
      x,
      y,
      width: itemWidth,
      height: item.height,
      column,
      span,
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
