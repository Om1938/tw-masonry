export function cssColumnsLayout(itemCount: number, columns: number): number[][] {
  const safeColumns = Math.max(1, columns);
  const result: number[][] = Array.from({ length: safeColumns }, () => []);

  for (let i = 0; i < itemCount; i += 1) {
    result[i % safeColumns]?.push(i);
  }

  return result;
}
