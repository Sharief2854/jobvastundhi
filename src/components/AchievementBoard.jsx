import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, ArrowRight, Download, FileText, CheckCircle2, X } from 'lucide-react';
import { exportToPdf, exportToMarkdown } from '../utils/exportQuestions';

export function AchievementBoard({
  isOpen,
  milestoneCount = 10,
  stats = {},
  history = [],
  topic = '',
  difficulty = 'intermediate',
  onContinue,
  onFinish,
}) {
  useEffect(() => {
    if (!isOpen) return;

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
      });
    } catch {
      // Ignore if canvas unavailable
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const attempted = stats.attempted || milestoneCount;
  const correct = stats.correct || 0;
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  const milestoneLevel = Math.floor(milestoneCount / 10);

  // Badge tier calculation
  let badgeTitle = 'Apprentice Coder';
  let badgeDesc = 'Solid foundation built on core interview questions.';
  let badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';

  if (milestoneCount >= 30) {
    badgeTitle = 'Technical Specialist';
    badgeDesc = 'Exceptional stamina and deep command of technical concepts.';
    badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  } else if (milestoneCount >= 20) {
    badgeTitle = 'Interview Contender';
    badgeDesc = 'High readiness for entry-level technical screening rounds.';
    badgeColor = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
  }

  const handleDownloadPdf = () => {
    exportToPdf({
      questions: history,
      topic,
      stats,
      difficulty,
    });
  };

  const handleDownloadMd = () => {
    exportToMarkdown({
      questions: history,
      topic,
      stats,
      difficulty,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="milestone-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl p-6 sm:p-7 space-y-6 text-zinc-100">
        {/* Dismiss Button */}
        <button
          type="button"
          onClick={onContinue}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Close milestone"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Milestone Trophy Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
            <span className="font-bold text-zinc-200">job<span className="text-emerald-400">Vastadhi</span></span>
            <span className="text-zinc-600">•</span>
            <span>Developed by <strong className="text-zinc-200">Sharief</strong></span>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400 shadow-inner">
            <Trophy className="w-7 h-7" />
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
              Level {milestoneLevel} Milestone
            </span>
            <h2 id="milestone-title" className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {milestoneCount} Questions Completed!
            </h2>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Outstanding consistency in <span className="text-zinc-200 font-semibold">{topic}</span>. Here is your assessment summary so far:
            </p>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80">
            <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Score</span>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
              {correct} <span className="text-zinc-600 text-xs font-normal">/ {attempted}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80">
            <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Accuracy</span>
            <div className="text-lg font-bold font-mono text-indigo-400 mt-0.5">
              {accuracy}%
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80">
            <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Best Streak</span>
            <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">
              {stats.bestStreak || stats.streak || 0}
            </div>
          </div>
        </div>

        {/* Unlocked Badge Tier Box */}
        <div className={`p-3.5 rounded-xl border flex items-center gap-3.5 ${badgeColor}`}>
          <div className="w-9 h-9 rounded-lg bg-zinc-900/80 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-current" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-100">{badgeTitle}</span>
              <span className="text-[10px] uppercase px-1.5 py-0.2 rounded font-mono font-semibold bg-zinc-900 text-zinc-300">
                Tier {milestoneLevel}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{badgeDesc}</p>
          </div>
        </div>

        {/* Download Options */}
        <div className="space-y-2 pt-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
            Download Answered Questions ({attempted}):
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 text-xs font-medium transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadMd}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 text-xs font-medium transition-colors cursor-pointer shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download Markdown</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2 border-t border-zinc-800/80">
          <button
            type="button"
            onClick={onContinue}
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs shadow-sm transition-colors cursor-pointer"
          >
            <span>Continue to Questions {milestoneCount + 1}–{milestoneCount + 10}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onFinish}
            className="w-full text-center text-xs text-zinc-400 hover:text-zinc-200 transition-colors py-1 cursor-pointer"
          >
            Finish session and view full review
          </button>
        </div>
      </div>
    </div>
  );
}
