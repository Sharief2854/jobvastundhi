import React, { useState, useEffect } from 'react';
import { LayoutGrid, Check, X, Timer, Eye, Download, FileText } from 'lucide-react';
import { FormattedContent } from './FormattedContent';
import { exportToPdf, exportToMarkdown } from '../utils/exportQuestions';

export function QuestionPalette({
  currentQuestionNumber = 1,
  history = [],
  topic = '',
  difficulty = 'intermediate',
  isLoading = false,
  isBuffering = false,
  bufferedCount = 0,
}) {
  const [reviewQuestion, setReviewQuestion] = useState(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Real-time exam session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const answeredCount = history.length;

  // The highest question index already in memory (answered + current + buffer queue)
  const highestLoaded = Math.max(currentQuestionNumber, answeredCount) + bufferedCount;

  // Next 5 questions that are actively loading or queued for loading
  const loadingStart = highestLoaded + 1;
  const loadingEnd = highestLoaded + 5;

  // Always round up to blocks of 10 so the UI displays full 10-slot exam groups (e.g. 10, 20, 30...)
  const totalSlots = Math.max(10, Math.ceil(loadingEnd / 10) * 10);
  const slots = Array.from({ length: totalSlots }, (_, i) => i + 1);

  // Calculate count of ready questions in queue
  const readyCount = Math.max(0, highestLoaded - Math.max(currentQuestionNumber, answeredCount));

  const handleSlotClick = (num) => {
    if (num <= answeredCount && history[num - 1]) {
      setReviewQuestion({
        number: num,
        data: history[num - 1],
      });
    }
  };

  return (
    <div
      role="region"
      aria-label="Question Palette"
      className="w-full rounded-xl bg-zinc-900 border border-zinc-800 shadow-sm p-4 space-y-4"
    >
      {/* Exam Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-300">
            <LayoutGrid className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-100">
              Question Palette
            </h2>
            <p className="text-[11px] text-zinc-400 font-medium truncate max-w-[150px]">
              {topic ? `${topic} • ${difficulty}` : 'Examination'}
            </p>
          </div>
        </div>

        {/* Live Session Timer */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono text-xs shadow-xs">
          <Timer className="w-3.5 h-3.5 text-zinc-400" />
          <span>{formatTime(secondsElapsed)}</span>
        </div>
      </div>

      {/* Meta Bar: Position & Real-time Buffer Status */}
      <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-lg p-2.5 space-y-1.5 text-[11px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400">Position:</span>
            <span className="font-mono font-bold text-indigo-400 text-xs">
              Q. {String(currentQuestionNumber).padStart(2, '0')}
            </span>
            <span className="text-zinc-600">/</span>
            <span className="font-mono text-zinc-400">{totalSlots}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-zinc-400">
            {isLoading && (
              <span className="inline-flex items-center gap-1 text-zinc-300 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span>Loading question</span>
              </span>
            )}
            {!isLoading && isBuffering && (
              <span className="inline-flex items-center gap-1.5 text-zinc-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse" />
                <span>Buffering next 5</span>
              </span>
            )}
            {!isLoading && !isBuffering && (
              <span className="text-zinc-400 font-mono">
                {answeredCount}/{totalSlots} Done
              </span>
            )}
          </div>
        </div>

        {/* Breakdown counters */}
        <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-850">
          <span>
            Answered: <strong className="text-emerald-400 font-mono">{answeredCount}</strong>
          </span>
          <span>
            Ready: <strong className="text-zinc-300 font-mono">{readyCount}</strong>
          </span>
          <span>
            Loading: <strong className="text-indigo-400 font-mono">5</strong>
          </span>
        </div>
      </div>

      {/* Question Numbers Grid (5 columns per row) */}
      <div className="space-y-1.5">
        <div className="grid grid-cols-5 gap-1.5">
          {slots.map((num) => {
            const isAnswered = num <= answeredCount;
            const answeredItem = isAnswered ? history[num - 1] : null;
            const isCorrect = answeredItem?.isCorrect;

            // 1. Current question loading
            const isLoadingCurrent =
              (num === currentQuestionNumber && isLoading) ||
              (currentQuestionNumber <= 1 && isLoading && num === 1);

            // 2. Upcoming buffer batch loading (e.g. 6-10 initially, or 16-20 after completing 10)
            const isLoadingBuffer = num >= loadingStart && num <= loadingEnd;

            // 3. Current active question
            const isCurrent = num === currentQuestionNumber && !isLoadingCurrent;

            // 4. Ready in buffer
            const isReady =
              num > currentQuestionNumber &&
              num <= highestLoaded &&
              !isLoadingBuffer;

            // Clean button styling (No AI slop, strict professional tokens)
            let buttonClass =
              'relative h-9 rounded-md flex items-center justify-center font-mono text-xs transition-colors ';

            if (isLoadingCurrent) {
              buttonClass +=
                'bg-zinc-800/40 border border-zinc-700/60 animate-pulse cursor-wait';
            } else if (isLoadingBuffer) {
              buttonClass +=
                'bg-zinc-850/50 border border-zinc-800/70 animate-pulse cursor-wait';
            } else if (isCurrent) {
              buttonClass +=
                'bg-indigo-600 text-white font-bold ring-1 ring-indigo-400 shadow-xs cursor-default';
            } else if (isAnswered) {
              if (isCorrect) {
                buttonClass +=
                  'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40 cursor-pointer';
              } else {
                buttonClass +=
                  'bg-rose-950/40 border border-rose-500/40 text-rose-300 hover:bg-rose-900/40 cursor-pointer';
              }
            } else if (isReady) {
              buttonClass +=
                'bg-zinc-900 border border-zinc-700/80 text-zinc-200 cursor-not-allowed';
            } else {
              buttonClass +=
                'bg-zinc-950/50 border border-zinc-900 text-zinc-600 cursor-not-allowed';
            }

            return (
              <button
                key={num}
                type="button"
                onClick={() => handleSlotClick(num)}
                disabled={!isAnswered && !isCurrent}
                aria-label={`Question ${num}${
                  isLoadingCurrent
                    ? ' (Loading Question)'
                    : isLoadingBuffer
                    ? ' (Loading next buffer batch)'
                    : isCurrent
                    ? ' (Current)'
                    : isAnswered
                    ? isCorrect
                      ? ' (Answered Correct)'
                      : ' (Answered Incorrect)'
                    : isReady
                    ? ' (Ready in buffer)'
                    : ' (Upcoming)'
                }`}
                title={
                  isLoadingCurrent
                    ? `Question ${num} is loading...`
                    : isLoadingBuffer
                    ? `Question ${num} is loading in background...`
                    : isAnswered
                    ? `Click to review Question ${num}`
                    : isCurrent
                    ? `Currently on Question ${num}`
                    : isReady
                    ? `Question ${num} is ready in buffer`
                    : `Question ${num} (Upcoming)`
                }
                className={buttonClass}
              >
                {/* Answered: Check or X icon */}
                {isAnswered && (
                  <span className="flex items-center gap-1 font-semibold">
                    {isCorrect ? (
                      <Check className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                    ) : (
                      <X className="w-3 h-3 text-rose-400 stroke-[2.5]" />
                    )}
                    <span>{String(num).padStart(2, '0')}</span>
                  </span>
                )}

                {/* Skeleton Loading State while buffering: gentle pulse, no spinning animation */}
                {(isLoadingCurrent || isLoadingBuffer) && (
                  <span className="flex items-center justify-center font-mono text-zinc-500 font-medium select-none">
                    {String(num).padStart(2, '0')}
                  </span>
                )}

                {/* Current, Ready, and Upcoming */}
                {!isAnswered && !isLoadingCurrent && !isLoadingBuffer && (
                  <span className={isCurrent ? 'font-bold' : 'font-medium'}>
                    {String(num).padStart(2, '0')}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-Time Exam Legend */}
      <div className="pt-3 border-t border-zinc-800/60 space-y-2 text-[11px] text-zinc-400">
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600 ring-1 ring-indigo-400 shrink-0" />
            <span className="text-zinc-300 truncate">Current</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-zinc-800 border border-zinc-700 animate-pulse shrink-0" />
            <span className="text-zinc-300 truncate">Buffering (Skeleton)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-950 border border-emerald-500/60 shrink-0" />
            <span className="text-zinc-300 truncate">Correct</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-950 border border-rose-500/60 shrink-0" />
            <span className="text-zinc-300 truncate">Incorrect</span>
          </div>
        </div>

        {answeredCount > 0 && (
          <div className="pt-2 border-t border-zinc-800/60 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-zinc-400">
              <span className="font-medium text-zinc-300">Answered Questions: {answeredCount}</span>
              <span className="text-emerald-400 font-mono">Ready to Save</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() =>
                  exportToPdf({
                    questions: history,
                    topic,
                    stats: {
                      attempted: answeredCount,
                      correct: history.filter((h) => h.isCorrect).length,
                    },
                    difficulty,
                  })
                }
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-[11px] text-zinc-200 hover:text-white transition-colors cursor-pointer shadow-xs"
                title="Download all answered questions as PDF"
              >
                <Download className="w-3 h-3 text-indigo-400 shrink-0" />
                <span>Download PDF</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  exportToMarkdown({
                    questions: history,
                    topic,
                    stats: {
                      attempted: answeredCount,
                      correct: history.filter((h) => h.isCorrect).length,
                    },
                    difficulty,
                  })
                }
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-[11px] text-zinc-200 hover:text-white transition-colors cursor-pointer shadow-xs"
                title="Download all answered questions as Markdown"
              >
                <FileText className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Markdown</span>
              </button>
            </div>

            <p className="text-zinc-500 text-[10px] text-center pt-0.5">
              Click any answered number to review
            </p>
          </div>
        )}
      </div>

      {/* Answered Question Review Modal */}
      {reviewQuestion && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm"
        >
          <div className="w-full max-w-lg rounded-xl bg-zinc-900 border border-zinc-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-zinc-100 font-mono">
                  Review: Question No. {String(reviewQuestion.number).padStart(2, '0')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewQuestion(null)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 cursor-pointer"
                aria-label="Close review"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div className="text-sm text-zinc-200 leading-relaxed font-medium">
                <FormattedContent content={reviewQuestion.data.question} />
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                  Options:
                </span>
                {reviewQuestion.data.options.map((opt, i) => {
                  const isUserSelection = reviewQuestion.data.selectedOption === i;
                  const isCorrectAnswer = reviewQuestion.data.correctIndex === i;

                  let optClass =
                    'p-2.5 rounded-lg border text-xs flex items-center justify-between ';
                  if (isCorrectAnswer) {
                    optClass +=
                      'bg-emerald-950/30 border-emerald-500/50 text-emerald-200 font-medium';
                  } else if (isUserSelection && !isCorrectAnswer) {
                    optClass +=
                      'bg-rose-950/30 border-rose-500/50 text-rose-200 line-through';
                  } else {
                    optClass += 'bg-zinc-950/50 border-zinc-800 text-zinc-400';
                  }

                  return (
                    <div key={i} className={optClass}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-zinc-300">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        <span>{opt}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px]">
                        {isUserSelection && (
                          <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px]">
                            Your pick
                          </span>
                        )}
                        {isCorrectAnswer && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                            Correct
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {reviewQuestion.data.explanation && (
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 space-y-1">
                  <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px] block">
                    Rationale
                  </span>
                  <FormattedContent content={reviewQuestion.data.explanation} />
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setReviewQuestion(null)}
                className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold cursor-pointer shadow-sm"
              >
                Back to Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
