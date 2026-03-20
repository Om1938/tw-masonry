function parseNumber(value) {
    if (!value) {
        return null;
    }
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
}
export function getItems(container, selector) {
    return Array.from(container.querySelectorAll(selector));
}
export function readCssLayoutVars(container, config) {
    const styles = getComputedStyle(container);
    const cssColumns = parseNumber(styles.getPropertyValue("--masonry-cols"));
    const cssGap = parseNumber(styles.getPropertyValue("--masonry-gap"));
    return {
        columns: Math.max(1, Math.floor(cssColumns ?? 1)),
        gap: Math.max(0, cssGap ?? config.gapPx ?? 16),
    };
}
export function measureItems(container, selector) {
    const items = getItems(container, selector);
    return items.map((element, index) => {
        const width = element.offsetWidth || element.getBoundingClientRect().width;
        const height = element.offsetHeight || element.getBoundingClientRect().height;
        return {
            element,
            index,
            width,
            height,
        };
    });
}
//# sourceMappingURL=measure.js.map