"use client";

import {
  Sparkles, Brush, Bath, Smile, Eye, Hand, Pill, Stethoscope, Palette,
  SprayCan, Baby, Flower2, FlaskConical, Home, HeartPulse, Activity, Shirt, Droplets, Leaf,
} from "lucide-react";

const MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles, Brush, Bath, Smile, Eye, Hand, Pill, Stethoscope, Palette,
  SprayCan, Baby, Flower2, FlaskConical, Home, HeartPulse, Activity, Shirt, Droplets, Leaf,
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = MAP[name] ?? Pill;
  return <Icon className={className} />;
}
