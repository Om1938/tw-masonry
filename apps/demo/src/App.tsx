import { useMemo, useState } from "react";
import { useMasonry } from "@tw-masonry/react";
import type { MasonryStrategy } from "@tw-masonry/core";
import { SEED_CARDS, generateCard } from "./cards.js";
import type { DemoCard } from "./cards.js";
import { Card } from "./CardComponents.js";

// ─── Types ────────────────────────────────────────────────────────────────────

type GapKey = "tight" | "normal" | "loose";

const GAP_MAP: Record<GapKey, string> = {
    tight: "8px",
    normal: "16px",
    loose: "32px",
};

// ─── Grid ─────────────────────────────────────────────────────────────────────

interface GridProps {
    strategy: MasonryStrategy;
    columns: number;
    gap: string;
    cards: DemoCard[];
}

function MasonryGrid({ strategy, columns, gap, cards }: GridProps) {
    const config = useMemo(() => ({ strategy, observeMutations: true }), [strategy]);
    const ref = useMasonry(config);

    return (
        <div
            ref={ref}
            className="masonry"
            style={
                {
                    "--masonry-cols": String(columns),
                    "--masonry-gap": gap,
                } as React.CSSProperties
            }
        >
            {cards.map((card) => (
                <div
                    key={card.id}
                    className="masonry-item"
                    {...(card.span && card.span > 1
                        ? { "data-masonry-span": String(card.span) }
                        : {})}
                >
                    <Card card={card} />
                </div>
            ))}
        </div>
    );
}

// ─── Control helpers ──────────────────────────────────────────────────────────

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
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${active
                    ? "bg-violet-600 text-white shadow-md shadow-violet-900/50"
                    : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
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
        add: "bg-emerald-600/20 text-emerald-400 border border-emerald-600/40 hover:bg-emerald-600/30",
        remove: "bg-rose-600/20 text-rose-400 border border-rose-600/40 hover:bg-rose-600/30",
    };
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${colors[variant]}`}
        >
            {children}
        </button>
    );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
    const [strategy, setStrategy] = useState<MasonryStrategy>("js-masonry");
    const [columns, setColumns] = useState(3);
    const [gap, setGap] = useState<GapKey>("normal");
    const [cards, setCards] = useState<DemoCard[]>(SEED_CARDS);

    function addCard() {
        setCards((prev) => [...prev, generateCard()]);
    }

    function removeCard() {
        setCards((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
    }

    const strategies: { value: MasonryStrategy; label: string; desc: string }[] = [
        { value: "js-masonry", label: "JS Masonry", desc: "Shortest-column placement" },
        { value: "css-columns", label: "CSS Columns", desc: "Native multi-column" },
        { value: "auto", label: "Auto", desc: "Browser-best strategy" },
    ];

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* ── Header ── */}
            <header className="border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Brand row */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-800/40">
                        <div className="flex items-center gap-2.5">
                            <span className="text-xl">◈</span>
                            <span className="text-sm font-bold tracking-tight text-white">
                                tw-masonry
                            </span>
                            <span className="rounded-full bg-violet-600/20 border border-violet-600/40 px-2 py-0.5 text-[11px] font-mono text-violet-300">
                                v0.1.0
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>React · Vue · Svelte · Tailwind</span>
                        </div>
                    </div>

                    {/* Controls row */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3">
                        {/* Strategy */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                Strategy
                            </span>
                            <div className="flex gap-1">
                                {strategies.map((s) => (
                                    <SegmentButton
                                        key={s.value}
                                        active={strategy === s.value}
                                        onClick={() => setStrategy(s.value)}
                                    >
                                        {s.label}
                                    </SegmentButton>
                                ))}
                            </div>
                        </div>

                        {/* Columns */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                Cols
                            </span>
                            <div className="flex gap-1">
                                {[2, 3, 4, 5, 6].map((n) => (
                                    <SegmentButton
                                        key={n}
                                        active={columns === n}
                                        onClick={() => setColumns(n)}
                                    >
                                        {n}
                                    </SegmentButton>
                                ))}
                            </div>
                        </div>

                        {/* Gap */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                Gap
                            </span>
                            <div className="flex gap-1">
                                {(["tight", "normal", "loose"] as GapKey[]).map((g) => (
                                    <SegmentButton
                                        key={g}
                                        active={gap === g}
                                        onClick={() => setGap(g)}
                                    >
                                        {g}
                                    </SegmentButton>
                                ))}
                            </div>
                        </div>

                        {/* Add / Remove */}
                        <div className="flex gap-1.5 ml-auto">
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

            {/* ── Hero ── */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-6">
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                            Masonry{" "}
                            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                                Layout
                            </span>
                        </h1>
                        <p className="mt-2 text-gray-400 text-sm max-w-lg">
                            Progressive enhancement: CSS columns → JS waterfall → native
                            masonry. Works with React, Vue, Svelte, or raw DOM.
                        </p>
                    </div>
                    {/* Live stats badge */}
                    <div className="hidden sm:flex items-center gap-4 text-right">
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
                            <p className="text-sm font-mono font-bold text-white">{GAP_MAP[gap]}</p>
                            <p className="text-xs text-gray-500">gap</p>
                        </div>
                    </div>
                </div>

                {/* Strategy description */}
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-gray-900/60 border border-gray-800 px-4 py-3 text-sm">
                    <span className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
                    <span className="font-semibold text-violet-300">
                        {strategies.find((s) => s.value === strategy)?.label}
                    </span>
                    <span className="text-gray-400">—</span>
                    <span className="text-gray-400">
                        {strategies.find((s) => s.value === strategy)?.desc}
                    </span>
                    <span className="ml-auto text-xs text-gray-600 font-mono">
                        {strategy === "js-masonry" &&
                            "items placed left→right in shortest column"}
                        {strategy === "css-columns" &&
                            "CSS column-count: var(--masonry-cols)"}
                        {strategy === "auto" &&
                            "auto-detects native CSS masonry support"}
                    </span>
                </div>
            </section>

            {/* ── Grid ── */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
                {/* Resize tip */}
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-violet-800/40 bg-violet-950/30 px-4 py-2.5 text-xs text-violet-300">
                    <span className="text-violet-400">↕</span>
                    <span>
                        <span className="font-semibold">Resize demo:</span> drag the bottom-right corner of any{" "}
                        <span className="font-mono text-violet-200">resize demo</span> card — masonry reflows live via{" "}
                        <span className="font-mono text-violet-200">ResizeObserver</span>
                    </span>
                </div>
                <MasonryGrid
                    key={`${strategy}-${columns}-${gap}`}
                    strategy={strategy}
                    columns={columns}
                    gap={GAP_MAP[gap]}
                    cards={cards}
                />
            </main>

            {/* ── Footer ── */}
            <footer className="border-t border-gray-800/60 py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-600">
                    <span>
                        ◈ tw-masonry — <span className="font-mono">@tw-masonry/react</span> ·{" "}
                        <span className="font-mono">tailwindcss-masonry</span>
                    </span>
                    <span className="font-mono">
                        <span className="text-violet-500">useMasonry</span>
                        {"({ strategy: "}
                        <span className="text-amber-400">"{strategy}"</span>
                        {" })"}
                    </span>
                </div>
            </footer>
        </div>
    );
}
