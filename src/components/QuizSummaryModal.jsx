import React, { useState, useEffect } from 'react';
import {
  Flame,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  ChevronDown,
  ChevronUp,
  X,
  Download,
  FileText,
} from 'lucide-react';
import { FormattedContent } from './FormattedContent';
import { exportToPdf, exportToMarkdown } from '../utils/exportQuestions';

export function QuizSummaryModal({
  isOpen,
  stats,
  history,
  topic,
  difficulty,
  onRestartSameTopic,
  onChangeTopic,
}) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onChangeTopic();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onChangeTopic]);

  if (!isOpen) return null;

  const total = stats.attempted;
  const correct = stats.correct;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="summary-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-xl max-h-[85vh] flex flex-col rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl text-zinc-100 overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onChangeTopic}
          className="absolute top-4 right-4 p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors z-10"
          aria-label="Close summary"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-zinc-800 space-y-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
              <span className="font-bold text-zinc-200">Job<span className="text-emerald-400">Vastundhi</span></span>
              <span className="text-zinc-600">•</span>
              <span>Developed by <strong className="text-zinc-200">Sharief</strong></span>
            </div>
            <h2 id="summary-modal-title" className="text-xl font-semibold text-zinc-100">
              Session Performance Report
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              {topic} • <span className="uppercase text-zinc-500 font-medium">{difficulty}</span>
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2.5 max-w-sm mx-auto">
            <div className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800">
              <span className="text-[11px] font-medium text-zinc-500 block uppercase tracking-wider">
                Score
              </span>
              <span className="text-lg font-semibold text-emerald-400 tabular-nums">
                {correct} <span className="text-xs text-zinc-500">/ {total}</span>
              </span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800">
              <span className="text-[11px] font-medium text-zinc-500 block uppercase tracking-wider">
                Accuracy
              </span>
              <span className="text-lg font-semibold text-zinc-100 tabular-nums">
                {accuracy}%
              </span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800">
              <span className="text-[11px] font-medium text-zinc-500 block uppercase tracking-wider">
                Best Streak
              </span>
              <div className="flex items-center justify-center gap-1 text-lg font-semibold text-amber-400 tabular-nums">
                <Flame className="w-4 h-4 fill-amber-400/20" />
                <span>{stats.bestStreak}</span>
              </div>
            </div>
          </div>

          {/* Download Answered Questions Buttons */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block text-center">
              Download Answered Questions ({total}):
            </span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => exportToPdf({ questions: history, topic, stats, difficulty })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 text-xs font-medium transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Download PDF</span>
              </button>

              <button
                type="button"
                onClick={() => exportToMarkdown({ questions: history, topic, stats, difficulty })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 text-xs font-medium transition-colors cursor-pointer shadow-xs"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Download Markdown</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Question Review */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2.5 scrollbar-thin">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Question Review ({history.length})
            </h3>
            <span className="text-[11px] text-zinc-500">Click to expand</span>
          </div>

          {history.length === 0 ? (
            <p className="text-xs text-zinc-500 italic">No questions answered yet.</p>
          ) : (
            history.map((item, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-lg bg-zinc-950/60 border border-zinc-800/80 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleExpand(idx)}
                    className="w-full text-left p-3.5 flex items-center justify-between gap-3 hover:bg-zinc-800/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {item.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <span className="text-xs font-mono font-medium text-zinc-500 mr-2 shrink-0">
                          #{idx + 1}
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-zinc-200 truncate inline-block max-w-[240px] sm:max-w-xs">
                          {item.question.split('\n')[0]}
                        </span>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-3.5 pt-2 border-t border-zinc-800/80 space-y-3 text-xs bg-zinc-900/40">
                      {/* Full question */}
                      <div className="space-y-1">
                        <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">
                          Question:
                        </span>
                        <FormattedContent
                          content={item.question}
                          className="text-zinc-200 text-xs font-medium"
                        />
                      </div>

                      {/* Selected Option */}
                      <div className="space-y-1">
                        <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">
                          Your answer:
                        </span>
                        <div
                          className={`p-2 rounded-md border ${
                            item.isCorrect
                              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                              : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                          }`}
                        >
                          <FormattedContent content={item.options[item.selectedOption]} />
                        </div>
                      </div>

                      {/* Correct Option (if missed) */}
                      {!item.isCorrect && (
                        <div className="space-y-1">
                          <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">
                            Correct answer:
                          </span>
                          <div className="p-2 rounded-md border bg-emerald-950/30 border-emerald-500/30 text-emerald-300">
                            <FormattedContent content={item.options[item.correctIndex]} />
                          </div>
                        </div>
                      )}

                      {/* Explanation */}
                      <div className="p-3 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-300 space-y-1">
                        <span className="font-semibold text-zinc-400 block text-[11px] uppercase tracking-wider">
                          Rationale:
                        </span>
                        <FormattedContent
                          content={item.explanation}
                          className="leading-relaxed text-zinc-300 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={onChangeTopic}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white text-xs font-medium border border-zinc-700 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Choose different topic</span>
          </button>

          <button
            type="button"
            onClick={onRestartSameTopic}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Practice same topic</span>
          </button>
        </div>
      </div>
    </div>
  );
}
