import { describe, expect, it, vi } from "vitest";
import { createEventBus } from "../src/events.js";

describe("createEventBus", () => {
  it("emits and unsubscribes handlers", () => {
    const bus = createEventBus<string>();
    const handler = vi.fn();

    const unsubscribe = bus.on(handler);
    bus.emit("hello");
    expect(handler).toHaveBeenCalledWith("hello");

    unsubscribe();
    bus.emit("world");
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("clears handlers on destroy", () => {
    const bus = createEventBus<string>();
    const handler = vi.fn();

    bus.on(handler);
    bus.destroy();
    bus.emit("ignored");

    expect(handler).not.toHaveBeenCalled();
  });
});
