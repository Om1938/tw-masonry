export interface MasonryPluginOptions {
  /** Maximum number of columns to generate masonry-cols utilities for. Default: 12 */
  maxColumns?: number;
  /** Default column count applied via CSS variable. Default: 3 */
  defaultColumns?: number;
  /** Default gap applied via CSS variable. Default: '1rem' */
  defaultGap?: string;
}
