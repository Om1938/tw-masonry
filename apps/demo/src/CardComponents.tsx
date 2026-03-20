import type { DemoCard } from "./cards.js";

const ACCENT: Record<string, string> = {
  emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-500/30",
  sky: "text-sky-400 bg-sky-400/10 border-sky-500/30",
  violet: "text-violet-400 bg-violet-400/10 border-violet-500/30",
  amber: "text-amber-400 bg-amber-400/10 border-amber-500/30",
  orange: "text-orange-400 bg-orange-400/10 border-orange-500/30",
  indigo: "text-indigo-400 bg-indigo-400/10 border-indigo-500/30",
};

const ACCENT_BG: Record<string, string> = {
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  orange: "bg-orange-500",
  indigo: "bg-indigo-500",
};

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/70">
      {label}
    </span>
  );
}

interface CardFrameProps {
  card: DemoCard;
  children: React.ReactNode;
  isDragging?: boolean;
  isPlaceholder?: boolean;
  onHandlePointerDown?: (event: React.PointerEvent<HTMLButtonElement>) => void;
}

function CardFrame({
  card,
  children,
  isDragging = false,
  isPlaceholder = false,
  onHandlePointerDown,
}: CardFrameProps) {
  const title =
    card.title ??
    card.name ??
    card.category ??
    card.author ??
    card.role ??
    `card-${card.id}`;

  return (
    <div className={`group relative ${isDragging ? "cursor-grabbing" : ""}`}>
      {!isDragging ? (
        <button
          type="button"
          aria-label={`Drag ${title}`}
          onPointerDown={onHandlePointerDown}
          className={`absolute right-3 top-3 z-20 inline-flex h-9 w-9 touch-none select-none items-center justify-center rounded-xl border border-white/10 bg-black/30 text-white/70 shadow-lg backdrop-blur transition ${
            isPlaceholder
              ? "opacity-0"
              : "cursor-grab hover:bg-black/45 hover:text-white group-hover:opacity-100 md:opacity-0"
          }`}
        >
          <span className="grid grid-cols-2 gap-0.5 text-[8px] leading-none">
            <span>•</span>
            <span>•</span>
            <span>•</span>
            <span>•</span>
          </span>
        </button>
      ) : null}
      <div
        className={`${
          isDragging
            ? "rotate-[1.5deg] scale-[1.02] shadow-2xl shadow-black/50 ring-1 ring-violet-400/40"
            : ""
        } ${isPlaceholder ? "opacity-25 saturate-50" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}

export function GradientCard({ card }: { card: DemoCard }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-6 min-h-[240px] flex flex-col justify-between`}
    >
      <div className="text-5xl mb-4">{card.emoji}</div>
      <div>
        <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
        <div className="flex flex-wrap gap-1">
          {card.tags?.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
      </div>
      {/* decorative circles */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/10" />
    </div>
  );
}

export function MetricCard({ card }: { card: DemoCard }) {
  const accent = card.accentColor ?? "emerald";
  const cls = ACCENT[accent] ?? ACCENT.emerald;
  return (
    <div className="rounded-2xl bg-gray-900 border border-gray-800 p-6">
      <p className="text-sm text-gray-400 mb-3">{card.title}</p>
      <p className="text-4xl font-black text-white tracking-tight">
        {card.value}
      </p>
      <div className="mt-3 flex items-center gap-1.5">
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}
        >
          {card.deltaUp ? "▲" : "▼"} {card.delta}
        </span>
      </div>
    </div>
  );
}

export function ArticleCard({ card }: { card: DemoCard }) {
  return (
    <div className="rounded-2xl bg-gray-900 border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
          {card.category}
        </span>
        <span className="text-xs text-gray-500">{card.readTime}</span>
      </div>
      <h3 className="text-base font-bold text-white mb-2 leading-snug">
        {card.title}
      </h3>
      <p className="text-sm text-gray-400 leading-relaxed">{card.excerpt}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {card.tags?.map((t) => (
          <span
            key={t}
            className="rounded-full bg-gray-800 px-2.5 py-0.5 text-xs text-gray-300"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function QuoteCard({ card }: { card: DemoCard }) {
  return (
    <div className="rounded-2xl bg-gray-900 border border-gray-800 p-6">
      <div className="text-4xl text-violet-500 font-serif leading-none mb-3">
        "
      </div>
      <p className="text-sm font-medium text-gray-200 leading-relaxed italic">
        {card.text}
      </p>
      <p className="mt-4 text-xs text-gray-500 font-semibold">
        — {card.author}
      </p>
    </div>
  );
}

export function CodeCard({ card }: { card: DemoCard }) {
  return (
    <div className="rounded-2xl bg-gray-950 border border-gray-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 bg-gray-900">
        <span className="text-xs font-mono text-gray-400">{card.title}</span>
        <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[11px] font-mono text-violet-400">
          {card.lang}
        </span>
      </div>
      <pre className="p-4 text-xs font-mono text-gray-300 leading-relaxed overflow-x-auto whitespace-pre">
        <code>{card.code}</code>
      </pre>
    </div>
  );
}

export function ProfileCard({ card }: { card: DemoCard }) {
  const accent = card.accentColor ?? "violet";
  const avatarBg = ACCENT_BG[accent] ?? ACCENT_BG.violet;
  return (
    <div className="rounded-2xl bg-gray-900 border border-gray-800 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${avatarBg} text-sm font-bold text-white`}
        >
          {card.initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{card.name}</p>
          <p className="text-xs text-gray-400">{card.role}</p>
        </div>
      </div>
      <p className="text-sm text-gray-400 leading-relaxed">{card.bio}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {card.tags?.map((t) => (
          <span
            key={t}
            className="rounded-full bg-gray-800 px-2.5 py-0.5 text-xs text-gray-300"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function WideCard({ card }: { card: DemoCard }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${card.gradient} p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5`}
    >
      {/* decorative blobs */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -bottom-8 left-1/3 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />

      {/* icon */}
      <div className="relative z-10 flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 text-4xl shadow-lg">
        {card.emoji}
      </div>

      {/* text */}
      <div className="relative z-10 flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-mono font-semibold text-white/90 tracking-wide">
            span-{card.span ?? 2}
          </span>
          <span className="text-[11px] text-white/60">multi-column card</span>
        </div>
        <h3 className="text-xl font-black text-white tracking-tight">
          {card.title}
        </h3>
        <p className="mt-1.5 text-sm text-white/75 leading-relaxed line-clamp-2">
          {card.excerpt}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {card.tags?.map((t) => (
            <span
              key={t}
              className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white/90"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ImageCard({ card }: { card: DemoCard }) {
  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-br ${card.gradient} flex flex-col justify-end p-5 overflow-hidden`}
      style={{ height: card.height ?? 240 }}
    >
      <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
      <div className="absolute top-6 right-14 w-12 h-12 rounded-full bg-white/10" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
      <span className="text-4xl mb-2 relative z-10 drop-shadow-lg">
        {card.emoji}
      </span>
      <p className="text-base font-bold text-white relative z-10 tracking-tight drop-shadow">
        {card.title}
      </p>
    </div>
  );
}

export function ResizableCard({ card }: { card: DemoCard }) {
  return (
    <div
      className="rounded-2xl bg-gray-900 border border-violet-500/40 flex flex-col"
      style={{ resize: "vertical", overflow: "hidden", minHeight: 130 }}
    >
      <div className="px-4 py-2.5 border-b border-violet-500/20 bg-violet-950/50 flex items-center gap-2 flex-shrink-0">
        <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
        <span className="text-xs font-mono font-semibold text-violet-300">
          resize demo
        </span>
        <span className="ml-auto text-[11px] text-gray-500 select-none">
          ↕ drag corner
        </span>
      </div>
      <div className="p-4 flex-1">
        <p className="text-sm font-semibold text-white">{card.title}</p>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed">
          {card.excerpt}
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-violet-900/30 border border-violet-700/30 px-2.5 py-1">
          <span className="text-[11px] text-violet-300 font-mono">
            observeResize: true
          </span>
        </div>
      </div>
    </div>
  );
}

export function Card({
  card,
  isDragging = false,
  isPlaceholder = false,
  onHandlePointerDown,
}: {
  card: DemoCard;
  isDragging?: boolean;
  isPlaceholder?: boolean;
  onHandlePointerDown?: (event: React.PointerEvent<HTMLButtonElement>) => void;
}) {
  let content: React.ReactNode;

  switch (card.type) {
    case "gradient":
      content = <GradientCard card={card} />;
      break;
    case "metric":
      content = <MetricCard card={card} />;
      break;
    case "article":
      content = <ArticleCard card={card} />;
      break;
    case "quote":
      content = <QuoteCard card={card} />;
      break;
    case "code":
      content = <CodeCard card={card} />;
      break;
    case "profile":
      content = <ProfileCard card={card} />;
      break;
    case "image":
      content = <ImageCard card={card} />;
      break;
    case "resizable":
      content = <ResizableCard card={card} />;
      break;
    case "wide":
      content = <WideCard card={card} />;
      break;
  }

  return (
    <CardFrame
      card={card}
      isDragging={isDragging}
      isPlaceholder={isPlaceholder}
      onHandlePointerDown={onHandlePointerDown}
    >
      {content}
    </CardFrame>
  );
}
