import { PluginAPI, Config } from 'tailwindcss/plugin';

interface MasonryPluginOptions {
    /** Maximum number of columns to generate masonry-cols utilities for. Default: 12 */
    maxColumns?: number;
    /** Default column count applied via CSS variable. Default: 3 */
    defaultColumns?: number;
    /** Default gap applied via CSS variable. Default: '1rem' */
    defaultGap?: string;
}

/** Public shape of the plugin export — avoids referencing tailwindcss internals in .d.ts */
type MasonryPlugin = {
    (options?: MasonryPluginOptions): {
        handler: (api: PluginAPI) => void;
        config?: Partial<Config>;
    };
    __isOptionsFunction: true;
};
declare const _default: MasonryPlugin;

export { type MasonryPluginOptions, _default as default };
