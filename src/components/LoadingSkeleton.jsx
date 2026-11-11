import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';

export function LoadingSkeleton({ topic, questionNumber = 1, onCancel }) {
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCancel(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="max-w-2xl mx-auto w-full p-6 sm:p-7 rounded-xl bg-zinc-900 border border-zinc-800 shadow-sm space-y-5"
    >
      <span className="sr-only">Loading question {questionNumber}...</span>

      {/* Header: "Loading..." on left, "Question No. 0X" on right */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        {/* Left: Visible Loading Indicator */}
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
          <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
            Loading...
          </span>
        </div>

        {/* Right: Real-Time Exam Question Number */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 shadow-sm">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Question No.
          </span>
          <span className="inline-flex items-center justify-center gap-1.5 min-w-[1.75rem] px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700/80 text-white font-mono text-xs sm:text-sm font-bold">
            <Loader2 className="w-3 h-3 text-indigo-400 animate-spin" />
            <span>{String(questionNumber).padStart(2, '0')}</span>
          </span>
        </div>
      </div>

      {/* Status note */}
      <div className="flex items-center justify-between text-xs text-zinc-400 pt-0.5">
        <span>Preparing questions for instant practice...</span>
        {topic && <span className="text-zinc-500 font-mono text-[11px]">{topic}</span>}
      </div>

      {/* Question lines skeleton */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center gap-2 text-indigo-400 font-mono font-bold text-sm">
          <span>Q{questionNumber}.</span>
          <div className="h-4 w-11/12 bg-zinc-800/80 rounded animate-pulse" />
        </div>
        <div className="h-4 w-3/4 bg-zinc-800/80 rounded ml-7 animate-pulse" />
      </div>

      {/* 4 Option cards skeleton */}
      <div className="space-y-2.5 pt-2 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-12 w-full rounded-lg bg-zinc-950/40 border border-zinc-800/60 flex items-center px-4 gap-3"
          >
            <div className="w-6 h-6 rounded bg-zinc-800/80 shrink-0" />
            <div className={`h-3 bg-zinc-800/80 rounded ${i % 2 === 0 ? 'w-2/3' : 'w-1/2'}`} />
          </div>
        ))}
      </div>

      {/* Cancel button if taking longer than expected */}
      {showCancel && onCancel && (
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel and return to topics</span>
          </button>
        </div>
      )}
    </div>
  );
}
