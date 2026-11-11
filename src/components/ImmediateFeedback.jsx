import React, { useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  CornerDownLeft,
  Loader2,
} from 'lucide-react';
import { FormattedContent } from './FormattedContent';

export function ImmediateFeedback({
  isCorrect,
  correctOptionText,
  explanation,
  onNext,
  onFinish,
  isLoadingNext,
}) {
  // Enter key listener for instant next
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (!isLoadingNext) {
          onNext();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, isLoadingNext]);

  return (
    <div
      role="region"
      aria-label="Answer evaluation"
      className={`p-4 sm:p-5 rounded-xl border transition-colors ${
        isCorrect
          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-100'
          : 'bg-rose-950/20 border-rose-500/30 text-rose-100'
      }`}
    >
      {/* Result Status Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {isCorrect ? (
            <div className="w-7 h-7 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-md bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <XCircle className="w-4 h-4" />
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold tracking-tight">
              {isCorrect ? 'Correct' : 'Incorrect'}
            </h3>
            {!isCorrect && (
              <p className="text-xs text-rose-300 mt-0.5">
                Expected answer:{' '}
                <span className="font-semibold text-zinc-100 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                  {correctOptionText}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Explanation Box */}
      <div className="mt-3 p-3.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80 text-zinc-300 text-xs sm:text-sm leading-relaxed space-y-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block">
          Rationale
        </span>
        <FormattedContent content={explanation} className="text-zinc-300 leading-relaxed" />
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onFinish}
          className="text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer order-2 sm:order-1"
        >
          Finish session & view summary
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={isLoadingNext}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-100 hover:bg-white disabled:opacity-50 text-zinc-950 font-semibold text-xs shadow-sm transition-colors cursor-pointer order-1 sm:order-2"
        >
          {isLoadingNext ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-900" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <span>Next Question</span>
              <ArrowRight className="w-3.5 h-3.5" />
              <span className="hidden sm:inline-flex items-center text-[10px] text-zinc-600 bg-zinc-200 px-1.5 py-0.5 rounded font-mono">
                <CornerDownLeft className="w-2.5 h-2.5 mr-0.5" /> Enter
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
