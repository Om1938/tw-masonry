import { beforeAll, describe, expect, it, vi } from "vitest";
import { createMasonry } from "../src/create-masonry.js";

class ResizeObserverMock {
  callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(): void {}

  unobserve(): void {}

  disconnect(): void {}
}

beforeAll(() => {
  vi.stubGlobal("ResizeObserver", ResizeObserverMock);
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    cb(0);
    return 1;
  });
  vi.stubGlobal("cancelAnimationFrame", () => {});
});

function defineBox(el: HTMLElement, width: number, height: number): void {
  Object.defineProperty(el, "offsetWidth", {
    configurable: true,
    get: () => width,
  });
  Object.defineProperty(el, "offsetHeight", {
    configurable: true,
    get: () => height,
  });
}

describe("createMasonry", () => {
  it("applies JS masonry positions", () => {
    const container = document.createElement("div");
    container.style.setProperty("--masonry-cols", "2");
    container.style.setProperty("--masonry-gap", "10");
    Object.defineProperty(container, "clientWidth", {
      configurable: true,
      get: () => 210,
    });

    const itemA = document.createElement("div");
    const itemB = document.createElement("div");
    const itemC = document.createElement("div");

    itemA.setAttribute("data-masonry-item", "");
    itemB.setAttribute("data-masonry-item", "");
    itemC.setAttribute("data-masonry-item", "");

    defineBox(itemA, 100, 100);
    defineBox(itemB, 100, 200);
    defineBox(itemC, 100, 80);

    container.append(itemA, itemB, itemC);
    document.body.appendChild(container);

    const masonry = createMasonry(container, {
      strategy: "js-masonry",
      itemSelector: "[data-masonry-item]",
      useTransforms: true,
    });

    masonry.layout("test");

    expect(itemA.style.transform).toContain("translate(0px, 0px)");
    expect(itemB.style.transform).toContain("translate(110px, 0px)");
    expect(itemC.style.transform).toContain("translate(0px, 110px)");
    expect(container.style.height).toBe("200px");

    masonry.destroy();
    document.body.removeChild(container);
  });

  it("applies CSS columns mode", () => {
    const container = document.createElement("div");
    container.style.setProperty("--masonry-cols", "3");
    container.style.setProperty("--masonry-gap", "8");

    const item = document.createElement("div");
    item.setAttribute("data-masonry-item", "");
    container.appendChild(item);
    document.body.appendChild(container);

    const masonry = createMasonry(container, {
      strategy: "css-columns",
      itemSelector: "[data-masonry-item]",
    });

    masonry.layout("test");

    expect(container.style.columnCount).toBe("3");
    expect(container.style.columnGap).toBe("8px");
    expect(item.style.breakInside).toBe("avoid");

    masonry.destroy();
    document.body.removeChild(container);
  });
});
