import type { PluginAPI, Config } from "tailwindcss/plugin";
import type { MasonryPluginOptions } from "./types.js";
/** Public shape of the plugin export — avoids referencing tailwindcss internals in .d.ts */
export type MasonryPlugin = {
    (options?: MasonryPluginOptions): {
        handler: (api: PluginAPI) => void;
        config?: Partial<Config>;
    };
    __isOptionsFunction: true;
};
declare const _default: MasonryPlugin;
export default _default;
//# sourceMappingURL=plugin.d.ts.map