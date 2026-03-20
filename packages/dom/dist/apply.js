function shouldReduceMotion() {
    if (typeof matchMedia !== "function") {
        return false;
    }
    return matchMedia("(prefers-reduced-motion: reduce)").matches;
}
export function clearItemPositionStyles(items) {
    items.forEach((item) => {
        item.style.position = "";
        item.style.left = "";
        item.style.top = "";
        item.style.transform = "";
        item.style.transition = "";
        item.style.width = "";
        item.style.marginBottom = "";
        item.style.breakInside = "";
    });
}
export function applyCssColumns(container, items, columns, gap) {
    container.style.position = "";
    container.style.height = "";
    container.style.columnCount = String(columns);
    container.style.columnGap = `${gap}px`;
    items.forEach((item) => {
        item.style.breakInside = "avoid";
        item.style.marginBottom = `${gap}px`;
    });
}
export function applyJsLayout(container, measuredItems, layout, config) {
    if (!container.style.position || container.style.position === "static") {
        container.style.position = "relative";
    }
    container.style.columnCount = "";
    container.style.columnGap = "";
    container.style.height = `${layout.containerHeight}px`;
    const transition = config.transition?.enabled && !shouldReduceMotion()
        ? `transform ${config.transition.durationMs}ms ${config.transition.easing}`
        : "";
    for (const layoutItem of layout.items) {
        const measured = measuredItems[layoutItem.index];
        if (!measured) {
            continue;
        }
        const element = measured.element;
        element.style.position = "absolute";
        element.style.width = `${layoutItem.width}px`;
        element.style.marginBottom = "";
        element.style.breakInside = "";
        element.style.transition = transition;
        if (config.useTransforms ?? true) {
            element.style.left = "0px";
            element.style.top = "0px";
            element.style.transform = `translate(${layoutItem.x}px, ${layoutItem.y}px)`;
        }
        else {
            element.style.transform = "";
            element.style.left = `${layoutItem.x}px`;
            element.style.top = `${layoutItem.y}px`;
        }
    }
}
//# sourceMappingURL=apply.js.map