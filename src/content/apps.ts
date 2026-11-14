import {
  Brain, Bug, FlaskConical, Music, FolderHeart, Sparkles, FileText,
  Trash2, Terminal as TerminalIcon, Globe, SlidersHorizontal, FileCode,
} from "lucide-react";
import type { ComponentType } from "react";

export type AppColor = "elec" | "coral" | "lav" | "butter" | "sage" | "sand" | "dark" | "elecSoft";

export const colorMap: Record<AppColor, string> = {
  elec: "var(--elec)",
  coral: "var(--coral)",
  lav: "var(--lav)",
  butter: "var(--butter)",
  sage: "var(--sage)",
  sand: "var(--sand)",
  dark: "var(--term-bg)",
  elecSoft: "var(--elec-soft)",
};

export type AppId = string;

export const KNOWN_APPS: AppId[] = [
  "my_brain", "bugs_i_fixed", "experiments", "outside_the_terminal",
  "unnecessary_thoughts", "future.exe", "resume", "recycle bin",
  "terminal.exe", "37_tabs_open", "personality_settings.exe", "achievements",
];

export type AppDef = {
  id: AppId;
  title: string;
  subtitle?: string;
  icon: ComponentType<{ size?: number | string; color?: string }>;
  color: AppColor;
  textColor?: string;
};

export const APPS: AppDef[] = [
  { id: "my_brain", title: "my_brain // personality & storytelling", icon: Brain, color: "lav" },
  { id: "bugs_i_fixed", title: "bugs_i_fixed // case: the two-minute problem", icon: Bug, color: "coral" },
  { id: "experiments", title: "experiments // project lab", icon: FlaskConical, color: "elec" },
  { id: "outside_the_terminal", title: "outside_the_terminal // life beyond code", icon: Music, color: "butter" },
  { id: "unnecessary_thoughts", title: "unnecessary_thoughts // the humor folder", icon: FolderHeart, color: "coral" },
  { id: "future.exe", title: "future.exe // beta ambitions", icon: Sparkles, color: "lav" },
  { id: "resume", title: "resume_final_final_v7.pdf", icon: FileText, color: "sage" },
  { id: "recycle bin", title: "recycle bin // where drafts go", icon: Trash2, color: "sand" },
  { id: "terminal.exe", title: "terminal.exe — krithi.os shell", icon: TerminalIcon, color: "dark", textColor: "#fff" },
  { id: "37_tabs_open", title: "37_tabs_open — simulated browser", icon: Globe, color: "elecSoft" },
  { id: "personality_settings.exe", title: "personality_settings.exe", icon: SlidersHorizontal, color: "butter" },
  { id: "achievements", title: "achievements // progress tracker", icon: Sparkles, color: "sage" },
];

export const DESKTOP_ICONS: AppId[] = [
  "my_brain", "bugs_i_fixed", "experiments", "outside_the_terminal",
  "unnecessary_thoughts", "future.exe", "resume", "recycle bin",
  "terminal.exe", "37_tabs_open", "personality_settings.exe",
];

export function appDef(id: AppId): AppDef {
  const known = APPS.find((a) => a.id === id);
  if (known) return known;
  // custom windows (file:*, exp:*, perf:*) get a sensible fallback
  const pretty = id.replace(/^(file:|exp:|perf:)/, "").replace(/\.[a-z0-9]+$/i, "");
  return { id, title: pretty, icon: FileCode as any, color: "sand" };
}
