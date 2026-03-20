import * as vue from 'vue';
import { DirectiveBinding } from 'vue';
import { MasonryConfig, MasonryController } from '@tw-masonry/core';
export { MasonryConfig, MasonryController, MasonryStrategy } from '@tw-masonry/core';

/**
 * Vue composable to apply masonry layout to a container element
 * @param config - partial masonry configuration
 * @returns ref object to attach to the container element
 */
declare function useMasonry(config?: Partial<MasonryConfig>): vue.Ref<HTMLDivElement | null, HTMLDivElement | null>;

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
declare const vMasonry: {
    mounted(el: HTMLDivElement, binding: DirectiveBinding<Partial<MasonryConfig>>): void;
    updated(el: HTMLDivElement, binding: DirectiveBinding<Partial<MasonryConfig>>): void;
    unmounted(el: HTMLDivElement): void;
};

export { useMasonry, vMasonry };
