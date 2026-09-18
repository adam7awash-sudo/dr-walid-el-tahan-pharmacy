"use client";

import { Star, StarHalf } from "lucide-react";

export function RatingStars({ rating, size = 14 }: { rating: number; size?: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <Star key={i} size={size} className="fill-amber-400 text-amber-400" />;
        if (i === full && half) return <StarHalf key={i} size={size} className="fill-amber-400 text-amber-400" />;
        return <Star key={i} size={size} className="text-gray-300" />;
      })}
    </span>
  );
}
