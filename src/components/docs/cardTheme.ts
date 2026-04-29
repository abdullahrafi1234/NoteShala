import {
  Atom,
  BrainCircuit,
  Code2,
  Cpu,
  FlaskConical,
  Globe,
  Rocket,
  Shield,
  Sparkles,
  TreePine,
} from "lucide-react";

const ICONS = [
  BrainCircuit,
  Atom,
  Rocket,
  FlaskConical,
  Globe,
  TreePine,
  Code2,
  Sparkles,
  Shield,
  Cpu,
];

const CARD_THEME = {
  gradient: "from-violet-500 via-purple-500 to-indigo-600",
  glow: "shadow-violet-500/25",
  ring: "ring-violet-400/50",
  progressBar: "from-violet-400 to-indigo-500",
  pill: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  accent: "text-violet-600 dark:text-violet-300",
  dot: "bg-violet-400",
  rowHover:
    "bg-violet-50/80 dark:bg-violet-900/20 ring-1 ring-violet-300/40 dark:ring-violet-700/40",
  innerBg: "bg-violet-50/60 dark:bg-violet-950/30",
  patternColor: "rgba(139,92,246,0.12)",
};

export function getTheme(index: number) {
  return { ...CARD_THEME, Icon: ICONS[index % ICONS.length] };
}
