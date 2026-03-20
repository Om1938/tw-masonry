import type { DirectiveBinding } from "vue";
import type { MasonryConfig, MasonryController } from "@tw-masonry/core";
declare global {
    interface HTMLDivElement {
        __masonryController?: MasonryController;
    }
}
/**
 * Vue directive for applying masonry layout: v-masonry="config"
 * @example
 * <div v-masonry="{ maxColumns: 4, order: 'dom' }">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </div>
 */
export declare const vMasonry: {
    mounted(el: HTMLDivElement, binding: DirectiveBinding<Partial<MasonryConfig>>): void;
    updated(el: HTMLDivElement, binding: DirectiveBinding<Partial<MasonryConfig>>): void;
    unmounted(el: HTMLDivElement): void;
};
//# sourceMappingURL=v-masonry.d.ts.map