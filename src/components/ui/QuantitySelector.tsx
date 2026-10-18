"use client";

import { Minus, Plus } from "lucide-react";

export function QuantitySelector({ value, onChange, max = 99 }: { value: number; onChange: (n: number) => void; max?: number }) {
  return (
    <div className="inline-flex items-center border border-line bg-white">
      <button onClick={() => onChange(value - 1)} className="flex h-8 w-8 items-center justify-center hover:bg-cream" aria-label="Decrease quantity">
        <Minus className="h-3 w-3" />
      </button>
      <span className="w-8 text-center text-sm">{value}</span>
      <button
        onClick={() => onChange(Math.min(value + 1, max))}
        disabled={value >= max}
        className="flex h-8 w-8 items-center justify-center hover:bg-cream disabled:opacity-40"
        aria-label="Increase quantity"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}
