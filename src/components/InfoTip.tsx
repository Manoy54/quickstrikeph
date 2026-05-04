"use client";

import { useId } from "react";

interface InfoTipProps {
  term: string;
  children: string;
}

export default function InfoTip({ term, children }: InfoTipProps) {
  const id = useId();

  return (
    <span className="relative inline-flex align-baseline group">
      <button
        type="button"
        className="cursor-help border-b border-dotted border-current text-inherit focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        aria-describedby={id}
      >
        {term}
      </button>
      <span
        id={id}
        role="tooltip"
        className="invisible absolute bottom-full left-1/2 z-40 mb-2 w-56 -translate-x-1/2 rounded-md bg-text-secondary px-3 py-2 text-left text-xs leading-relaxed text-white opacity-0 shadow-md transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
      >
        {children}
      </span>
    </span>
  );
}
