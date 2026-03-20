import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  useMasonryController,
  type MasonryStrategy,
} from "@tw-masonry/react";
import { SEED_CARDS, generateCard } from "./cards.js";
import type { DemoCard } from "./cards.js";
import { Card } from "./CardComponents.js";

type GapKey = "tight" | "normal" | "loose";

interface DragState {
  id: number;
  pointerId: number;
  width: number;
  height: number;
  x: number;
  y: number;
  pointerOffsetX: number;
  pointerOffsetY: number;
}

interface GridProps {
  strategy: MasonryStrategy;
  columns: number;
  gap: string;
  cards: DemoCard[];
  setCards: React.Dispatch<React.SetStateAction<DemoCard[]>>;
}

const GAP_MAP: Record<GapKey, string> = {
  tight: "8px",
  normal: "16px",
  loose: "32px",
};

function moveCard(
  cards: DemoCard[],
  draggedId: number,
  rawIndex: number,
): DemoCard[] {
  const fromIndex = cards.findIndex((card) => card.id === draggedId);
  if (fromIndex === -1) {
    return cards;
  }

  const boundedIndex = Math.max(0, Math.min(rawIndex, cards.length));
  const next = cards.slice();
  const [movedCard] = next.splice(fromIndex, 1);

  if (!movedCard) {
    return cards;
  }

  const insertAt = fromIndex < boundedIndex ? boundedIndex - 1 : boundedIndex;
  if (insertAt === fromIndex) {
    return cards;
  }

  next.splice(insertAt, 0, movedCard);
  return next;
}

function SegmentButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
        active
          ? "bg-violet-600 text-white shadow-md shadow-violet-900/50"
          : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function PillButton({
  onClick,
  children,
  variant = "default",
}: {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "default" | "add" | "remove";
}) {
  const colors = {
    default: "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white",
    add: "border border-emerald-600/40 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30",
    remove:
      "border border-rose-600/40 bg-rose-600/20 text-rose-400 hover:bg-rose-600/30",
  };

  return (
    <button
      onClick={onClick}
      className={`cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${colors[variant]}`}
    >
      {children}
    </button>
  );
}

function MasonryGrid({ strategy, columns, gap, cards, setCards }: GridProps) {
  const config = useMemo(
    () => ({
      strategy,
      itemSelector: ".masonry-item",
      observeMutations: true,
    }),
    [strategy],
  );
  const { ref, controller } = useMasonryController(config);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const cardsRef = useRef(cards);
  const dragStateRef = useRef<DragState | null>(null);

  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  useEffect(() => {
    dragStateRef.current = dragState;
  }, [dragState]);

  useEffect(() => {
    controller.current?.layout(dragState ? "drag" : "cards-change");
  }, [cards, controller, dragState?.id]);

  useEffect(() => {
    if (!dragState) {
      return;
    }

    const previousUserSelect = document.body.style.userSelect;
    const previousCursor = document.body.style.cursor;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";

    const handlePointerMove = (event: PointerEvent): void => {
      const current = dragStateRef.current;
      const container = ref.current;
      if (!current || !container || event.pointerId !== current.pointerId) {
        return;
      }

      if (event.cancelable) {
        event.preventDefault();
      }

      const nextState: DragState = {
        ...current,
        x: event.clientX - current.pointerOffsetX,
        y: event.clientY - current.pointerOffsetY,
      };
      dragStateRef.current = nextState;
      setDragState(nextState);

      const hoveredItem = document
        .elementsFromPoint(event.clientX, event.clientY)
        .find((element) => {
          if (!(element instanceof HTMLElement)) {
            return false;
          }

          const cardElement = element.closest<HTMLElement>("[data-card-id]");
          return (
            cardElement !== null &&
            cardElement.dataset.cardId !== String(current.id)
          );
        })
        ?.closest<HTMLElement>("[data-card-id]");

      if (hoveredItem?.dataset.cardId) {
        const hoveredId = Number.parseInt(hoveredItem.dataset.cardId, 10);
        const hoveredRect = hoveredItem.getBoundingClientRect();
        const insertAfter =
          event.clientY > hoveredRect.top + hoveredRect.height / 2;

        setCards((previousCards) => {
          const hoveredIndex = previousCards.findIndex(
            (card) => card.id === hoveredId,
          );
          if (hoveredIndex === -1) {
            return previousCards;
          }

          return moveCard(
            previousCards,
            current.id,
            hoveredIndex + (insertAfter ? 1 : 0),
          );
        });
        return;
      }

      const containerRect = container.getBoundingClientRect();
      if (event.clientY <= containerRect.top) {
        setCards((previousCards) => moveCard(previousCards, current.id, 0));
        return;
      }

      if (event.clientY >= containerRect.bottom) {
        setCards((previousCards) =>
          moveCard(previousCards, current.id, previousCards.length),
        );
      }
    };

    const finishDrag = (event: PointerEvent): void => {
      const current = dragStateRef.current;
      if (!current || event.pointerId !== current.pointerId) {
        return;
      }

      dragStateRef.current = null;
      setDragState(null);
      controller.current?.layout("drag-end");
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: false,
    });
    window.addEventListener("pointerup", finishDrag);
    window.addEventListener("pointercancel", finishDrag);

    return () => {
      document.body.style.userSelect = previousUserSelect;
      document.body.style.cursor = previousCursor;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", finishDrag);
      window.removeEventListener("pointercancel", finishDrag);
    };
  }, [controller, dragState, ref, setCards]);

  function handleDragStart(
    cardId: number,
    event: ReactPointerEvent<HTMLButtonElement>,
  ): void {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    const item = event.currentTarget.closest<HTMLElement>("[data-card-id]");
    if (!item) {
      return;
    }

    event.preventDefault();

    const rect = item.getBoundingClientRect();
    const nextState: DragState = {
      id: cardId,
      pointerId: event.pointerId,
      width: rect.width,
      height: rect.height,
      x: rect.left,
      y: rect.top,
      pointerOffsetX: event.clientX - rect.left,
      pointerOffsetY: event.clientY - rect.top,
    };

    dragStateRef.current = nextState;
    setDragState(nextState);
    controller.current?.layout("drag-start");
  }

  const activeCard = dragState
    ? (cards.find((card) => card.id === dragState.id) ?? null)
    : null;

  return (
    <>
      <div
        ref={ref}
        className="masonry"
        style={
          {
            "--masonry-cols": String(columns),
            "--masonry-gap": gap,
          } as CSSProperties
        }
      >
        {cards.map((card) => {
          const isDragging = dragState?.id === card.id;

          return (
            <div
              key={card.id}
              className="masonry-item"
              data-card-id={card.id}
              {...(card.span && card.span > 1
                ? { "data-masonry-span": String(card.span) }
                : {})}
            >
              <Card
                card={card}
                isDragging={isDragging}
                isPlaceholder={isDragging}
                onHandlePointerDown={(event) => handleDragStart(card.id, event)}
              />
            </div>
          );
        })}
      </div>

      {activeCard && dragState ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-50"
          style={{
            width: `${dragState.width}px`,
            height: `${dragState.height}px`,
            transform: `translate(${dragState.x}px, ${dragState.y}px) rotate(1.5deg)`,
          }}
        >
          <Card card={activeCard} isDragging />
        </div>
      ) : null}
    </>
  );
}

export default function App() {
  const [strategy, setStrategy] = useState<MasonryStrategy>("js-masonry");
  const [columns, setColumns] = useState(3);
  const [gap, setGap] = useState<GapKey>("normal");
  const [cards, setCards] = useState<DemoCard[]>(SEED_CARDS);

  function addCard() {
    setCards((previousCards) => [...previousCards, generateCard()]);
  }

  function removeCard() {
    setCards((previousCards) =>
      previousCards.length > 1 ? previousCards.slice(0, -1) : previousCards,
    );
  }

  const strategies: { value: MasonryStrategy; label: string; desc: string }[] =
    [
      {
        value: "js-masonry",
        label: "JS Masonry",
        desc: "Shortest-column placement",
      },
      {
        value: "css-columns",
        label: "CSS Columns",
        desc: "Native multi-column",
      },
      { value: "auto", label: "Auto", desc: "Browser-best strategy" },
    ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="sticky top-0 z-20 border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-b border-gray-800/40 py-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">◈</span>
              <span className="text-sm font-bold tracking-tight text-white">
                tw-masonry
              </span>
              <span className="rounded-full border border-violet-600/40 bg-violet-600/20 px-2 py-0.5 text-[11px] font-mono text-violet-300">
                v0.1.0
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>React · Vue · Svelte · Tailwind</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Strategy
              </span>
              <div className="flex gap-1">
                {strategies.map((option) => (
                  <SegmentButton
                    key={option.value}
                    active={strategy === option.value}
                    onClick={() => setStrategy(option.value)}
                  >
                    {option.label}
                  </SegmentButton>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Cols
              </span>
              <div className="flex gap-1">
                {[2, 3, 4, 5, 6].map((value) => (
                  <SegmentButton
                    key={value}
                    active={columns === value}
                    onClick={() => setColumns(value)}
                  >
                    {value}
                  </SegmentButton>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Gap
              </span>
              <div className="flex gap-1">
                {(["tight", "normal", "loose"] as GapKey[]).map((value) => (
                  <SegmentButton
                    key={value}
                    active={gap === value}
                    onClick={() => setGap(value)}
                  >
                    {value}
                  </SegmentButton>
                ))}
              </div>
            </div>

            <div className="ml-auto flex gap-1.5">
              <PillButton onClick={removeCard} variant="remove">
                − Remove
              </PillButton>
              <PillButton onClick={addCard} variant="add">
                + Add Card
              </PillButton>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 pb-6 pt-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              Masonry{" "}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Layout
              </span>
            </h1>
            <p className="mt-2 max-w-lg text-sm text-gray-400">
              Progressive enhancement: CSS columns → JS waterfall → native
              masonry. Drag a handle to reorder cards and watch the layout
              rebalance live.
            </p>
          </div>
          <div className="hidden items-center gap-4 text-right sm:flex">
            <div>
              <p className="text-2xl font-black text-white">{cards.length}</p>
              <p className="text-xs text-gray-500">cards</p>
            </div>
            <div className="h-8 w-px bg-gray-800" />
            <div>
              <p className="text-2xl font-black text-violet-400">{columns}</p>
              <p className="text-xs text-gray-500">columns</p>
            </div>
            <div className="h-8 w-px bg-gray-800" />
            <div>
              <p className="text-sm font-mono font-bold text-white">
                {GAP_MAP[gap]}
              </p>
              <p className="text-xs text-gray-500">gap</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900/60 px-4 py-3 text-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-violet-500" />
          <span className="font-semibold text-violet-300">
            {strategies.find((option) => option.value === strategy)?.label}
          </span>
          <span className="text-gray-400">—</span>
          <span className="text-gray-400">
            {strategies.find((option) => option.value === strategy)?.desc}
          </span>
          <span className="ml-auto text-xs font-mono text-gray-600">
            {strategy === "js-masonry" &&
              "pointer drag previews DOM reorder in real time"}
            {strategy === "css-columns" &&
              "column-count fallback still supports drag reordering"}
            {strategy === "auto" && "auto-detects native CSS masonry support"}
          </span>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-violet-800/40 bg-violet-950/30 px-4 py-2.5 text-xs text-violet-300">
          <span className="text-violet-400">⋮⋮</span>
          <span>
            <span className="font-semibold">Drag demo:</span> grab any card
            handle to reorder. The preview card follows your pointer while the
            masonry engine relayouts the remaining grid under it.
          </span>
        </div>
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-violet-800/40 bg-violet-950/20 px-4 py-2.5 text-xs text-violet-300">
          <span className="text-violet-400">↕</span>
          <span>
            <span className="font-semibold">Resize demo:</span> drag the
            bottom-right corner of any{" "}
            <span className="font-mono text-violet-200">resize demo</span> card.{" "}
            <span className="font-mono text-violet-200">ResizeObserver</span>{" "}
            keeps the layout in sync.
          </span>
        </div>
        <MasonryGrid
          key={`${strategy}-${columns}-${gap}`}
          strategy={strategy}
          columns={columns}
          gap={GAP_MAP[gap]}
          cards={cards}
          setCards={setCards}
        />
      </main>

      <footer className="border-t border-gray-800/60 py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 text-xs text-gray-600 sm:px-6 lg:px-8">
          <span>
            ◈ tw-masonry — <span className="font-mono">@tw-masonry/react</span>{" "}
            · <span className="font-mono">tailwindcss-masonry</span>
          </span>
          <span className="font-mono">
            <span className="text-violet-500">useMasonryController</span>
            {"({ strategy: "}
            <span className="text-amber-400">"{strategy}"</span>
            {" })"}
          </span>
        </div>
      </footer>
    </div>
  );
}
