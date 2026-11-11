import React from 'react';
import { Key, Flame, ArrowLeft, Download } from 'lucide-react';
import { Logo } from './Logo';

export function Navbar({
  topic,
  stats,
  hasKey,
  onOpenKeyModal,
  onChangeTopic,
  isInQuiz,
  onDownload,
}) {
  const accuracy =
    stats.attempted > 0
      ? Math.round((stats.correct / stats.attempted) * 100)
      : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Sharief credit */}
        <div className="flex items-center gap-3">
          <button
            onClick={onChangeTopic}
            className="flex items-center gap-2.5 text-left group transition-opacity hover:opacity-90 cursor-pointer"
            aria-label="JobVastundhi Home"
          >
            <Logo size="sm" showTagline={true} />
          </button>
        </div>

        {/* Center: Quiz Status (When in Quiz) */}
        {isInQuiz && (
          <div className="flex items-center gap-3">
            {/* Back to Topics Button */}
            <button
              onClick={onChangeTopic}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors"
              title="Return to topic selection"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Topics</span>
            </button>

            {/* Topic Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs">
              <span className="text-zinc-500 font-medium">Topic:</span>
              <span className="font-semibold text-zinc-200 max-w-[140px] truncate">
                {topic}
              </span>
            </div>

            {/* Score & Accuracy Stats */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-medium tabular-nums">
              <span className="text-zinc-400">Score:</span>
              <span className="text-emerald-400 font-semibold">{stats.correct}</span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-300">{stats.attempted}</span>
              {stats.attempted > 0 && (
                <span className="text-zinc-500 ml-1">({accuracy}%)</span>
              )}
            </div>

            {/* Streak Counter (Clean, no pulsing) */}
            {stats.streak > 1 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-semibold text-amber-400 tabular-nums">
                <Flame className="w-3.5 h-3.5 fill-amber-400/20 text-amber-400" />
                <span>{stats.streak}</span>
              </div>
            )}

            {/* Quick Download PDF */}
            {stats.attempted > 0 && onDownload && (
              <button
                type="button"
                onClick={onDownload}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Download Questions as PDF"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden md:inline">PDF</span>
              </button>
            )}
          </div>
        )}

        {/* Right: API Key Settings */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenKeyModal}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              hasKey
                ? 'bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                : 'bg-zinc-100 hover:bg-white text-zinc-900 border-zinc-200 shadow-sm font-semibold'
            }`}
            aria-label="Gemini API Key Settings"
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {hasKey ? 'Gemini Key' : 'Connect API Key'}
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                hasKey ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
