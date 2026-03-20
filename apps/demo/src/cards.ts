export type CardType =
  | "gradient"
  | "metric"
  | "article"
  | "quote"
  | "code"
  | "profile"
  | "image"
  | "resizable"
  | "wide";

export interface DemoCard {
  id: number;
  type: CardType;
  // gradient
  gradient?: string;
  emoji?: string;
  // metric
  value?: string;
  delta?: string;
  deltaUp?: boolean;
  accentColor?: string;
  // article / quote / code
  category?: string;
  title?: string;
  excerpt?: string;
  readTime?: string;
  text?: string;
  author?: string;
  lang?: string;
  code?: string;
  // profile
  name?: string;
  role?: string;
  bio?: string;
  initials?: string;
  tags?: string[];
  // image – explicit pixel height for obvious masonry staggering
  height?: number;
  /** Optional column span (>1 = wide/multi-column card) */
  span?: number;
}

export const SEED_CARDS: DemoCard[] = [
  // ── image cards with explicit heights → anchors the masonry staggering ──
  {
    id: 1,
    type: "image",
    gradient: "from-violet-600 via-purple-700 to-indigo-800",
    emoji: "🏔️",
    title: "Alpine Peaks",
    height: 380,
  },
  {
    id: 2,
    type: "metric",
    value: "94.2%",
    delta: "+2.1%",
    deltaUp: true,
    title: "Satisfaction Rate",
    accentColor: "emerald",
  },
  {
    id: 3,
    type: "code",
    title: "useMasonry hook",
    lang: "tsx",
    code: `import { useMasonry } from "@tw-masonry/react";

function Gallery({ items }) {
  const ref = useMasonry({
    strategy: "js-masonry",
    observeResize: true,
    observeMutations: true,
  });

  return (
    <div
      ref={ref}
      style={{
        "--masonry-cols": "3",
        "--masonry-gap": "16px",
      }}
    >
      {items.map(item => (
        <div key={item.id} className="masonry-item">
          <Card {...item} />
        </div>
      ))}
    </div>
  );
}`,
  },
  {
    id: 4,
    type: "metric",
    value: "12,847",
    delta: "+348",
    deltaUp: true,
    title: "Monthly Downloads",
    accentColor: "sky",
  },
  // ── wide span-2 card: multi-column feature highlight ──
  {
    id: 19,
    type: "wide",
    span: 2,
    gradient: "from-violet-600 via-indigo-600 to-blue-700",
    emoji: "⚡",
    title: "Multi-column spanning",
    excerpt:
      "This card spans 2 columns. The layout engine finds the pair of adjacent columns with the lowest combined height and places the item there — same shortest-column heuristic, extended for spans.",
    tags: ["span-2", "js-masonry"],
  },
  {
    id: 5,
    type: "image",
    gradient: "from-emerald-500 via-teal-600 to-cyan-700",
    emoji: "🌿",
    title: "Misty Forest",
    height: 260,
  },
  // ── resizable card: live resize demo ──
  {
    id: 6,
    type: "resizable",
    title: "Drag to resize ↕",
    excerpt:
      "This card uses the native CSS resize handle. Drag the bottom-right corner — ResizeObserver fires and the masonry grid reflows in real time, no JS polling needed.",
  },
  {
    id: 7,
    type: "article",
    category: "CSS",
    title: "The Future of CSS Layout",
    excerpt:
      "Native masonry support is coming to browsers near you. Chrome has experimental support behind a flag, and the CSS Working Group has been refining the spec to support both row and column directions.",
    readTime: "4 min",
    tags: ["CSS", "Layout"],
  },
  {
    id: 8,
    type: "quote",
    text: '"Design is not just what it looks like and feels like. Design is how it works."',
    author: "Steve Jobs",
  },
  {
    id: 9,
    type: "image",
    gradient: "from-amber-400 via-orange-500 to-red-600",
    emoji: "🌅",
    title: "Desert Dunes",
    height: 320,
  },
  {
    id: 10,
    type: "profile",
    name: "Sofia Chen",
    role: "Senior Frontend Engineer",
    bio: "Building beautiful interfaces and obsessing over CSS layout specs. Creator of several open-source tools for the community.",
    initials: "SC",
    accentColor: "violet",
    tags: ["React", "CSS", "TypeScript"],
  },
  {
    id: 11,
    type: "metric",
    value: "1.2ms",
    delta: "-0.3ms",
    deltaUp: true,
    title: "Avg Layout Time",
    accentColor: "amber",
  },
  // ── second wide card: announcement banner ──
  {
    id: 20,
    type: "wide",
    span: 2,
    gradient: "from-emerald-500 via-teal-600 to-cyan-700",
    emoji: "🚀",
    title: "Zero-dependency, fully typed",
    excerpt:
      "@tw-masonry/core has no runtime dependencies. It ships as ESM + CJS with full TypeScript types. The DOM adapter weighs under 3 kB gzipped.",
    tags: ["0-deps", "TypeScript", "tree-shakeable"],
  },
  {
    id: 12,
    type: "article",
    category: "Performance",
    title: "Zero-dependency Masonry at Scale",
    excerpt:
      "When building layout libraries, every byte counts. We explore how to ship a tiny, tree-shakeable masonry engine without sacrificing features or developer experience. ResizeObserver, MutationObserver, and requestAnimationFrame scheduling combine to create a smooth layout engine.",
    readTime: "6 min",
    tags: ["Performance", "DX"],
  },
  // ── second resizable card ──
  {
    id: 13,
    type: "resizable",
    title: "Another resizable card ↕",
    excerpt:
      "Make this taller or shorter. Layout is scheduled with requestAnimationFrame so reflows are batched and smooth — no layout thrashing.",
  },
  {
    id: 14,
    type: "image",
    gradient: "from-rose-500 via-fuchsia-600 to-purple-700",
    emoji: "🌸",
    title: "Cherry Bloom",
    height: 190,
  },
  {
    id: 15,
    type: "gradient",
    gradient: "from-orange-500 via-rose-500 to-pink-600",
    emoji: "🌊",
    title: "Ocean Depths",
    tags: ["Photography", "Blue"],
  },
  {
    id: 16,
    type: "quote",
    text: '"Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away."',
    author: "Antoine de Saint-Exupéry",
  },
  {
    id: 17,
    type: "profile",
    name: "Marcus Osei",
    role: "Design Systems Lead",
    bio: "Bridging the gap between design and engineering. Passionate about accessible, systematic UI at scale.",
    initials: "MO",
    accentColor: "orange",
    tags: ["Design", "Accessibility", "Systems"],
  },
  {
    id: 18,
    type: "metric",
    value: "99.9%",
    delta: "uptime",
    deltaUp: true,
    title: "Zero-dep Core",
    accentColor: "indigo",
  },
];

let _nextId = SEED_CARDS.length + 1;

const EXTRA_GRADIENTS = [
  "from-cyan-500 via-blue-500 to-indigo-600",
  "from-yellow-400 via-orange-500 to-red-500",
  "from-pink-500 via-rose-500 to-red-600",
  "from-lime-400 via-green-500 to-emerald-600",
];
const EXTRA_EMOJIS = ["🌅", "🪐", "🦋", "🌺", "🎭", "🚀", "🌙", "⚡"];
const EXTRA_TOPICS = [
  ["CSS Grid", "Layouts"],
  ["Web Perf", "Core Web Vitals"],
  ["TypeScript", "Types"],
  ["Animation", "Motion"],
];

export function generateCard(): DemoCard {
  const types: CardType[] = [
    "image",
    "metric",
    "article",
    "quote",
    "profile",
    "gradient",
  ];
  const type = types[_nextId % types.length]!;
  const id = _nextId++;

  if (type === "image") {
    const heights = [180, 240, 300, 360, 140, 280];
    return {
      id,
      type,
      gradient: EXTRA_GRADIENTS[id % EXTRA_GRADIENTS.length],
      emoji: EXTRA_EMOJIS[id % EXTRA_EMOJIS.length],
      title: `Photo #${id}`,
      height: heights[id % heights.length],
    };
  }
  if (type === "gradient") {
    return {
      id,
      type,
      gradient: EXTRA_GRADIENTS[id % EXTRA_GRADIENTS.length],
      emoji: EXTRA_EMOJIS[id % EXTRA_EMOJIS.length],
      title: `Card #${id}`,
      tags: EXTRA_TOPICS[id % EXTRA_TOPICS.length],
    };
  }
  if (type === "metric") {
    return {
      id,
      type,
      value: `${Math.floor(Math.random() * 900 + 100).toLocaleString()}`,
      delta: `+${Math.floor(Math.random() * 50)}`,
      deltaUp: true,
      title: `Metric #${id}`,
      accentColor: ["emerald", "sky", "violet", "amber"][id % 4],
    };
  }
  if (type === "quote") {
    return {
      id,
      type,
      text: `"Card #${id}: The best way to predict the future is to invent it."`,
      author: "Alan Kay",
    };
  }
  if (type === "profile") {
    return {
      id,
      type,
      name: `User #${id}`,
      role: "Contributor",
      bio: "Exploring the edges of CSS layout and open-source tooling.",
      initials: `U${id}`,
      accentColor: ["violet", "orange", "sky"][id % 3],
      tags: ["Open Source"],
    };
  }
  return {
    id,
    type: "article",
    category: "Web",
    title: `Article #${id}: Dynamic layouts with CSS`,
    excerpt:
      "Masonry layouts have been a staple of web design for years. Now with modern CSS and JavaScript, we can build them better than ever.",
    readTime: "3 min",
    tags: EXTRA_TOPICS[id % EXTRA_TOPICS.length],
  };
}
