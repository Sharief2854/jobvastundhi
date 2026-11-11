import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Lightbulb, Loader2 } from 'lucide-react';
import { ImmediateFeedback } from './ImmediateFeedback';
import { FormattedContent } from './FormattedContent';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export function QuestionCard({
  question,
  questionNumber,
  difficulty,
  selectedOption,
  isAnswered,
  onSelectOption,
  onNext,
  onFinish,
  isLoadingNext,
}) {
  const [hintRevealedForId, setHintRevealedForId] = useState(null);
  const showHint = hintRevealedForId === question?.id;

  // Keyboard navigation for options: keys 1-4 or A-D
  useEffect(() => {
    if (isAnswered) return;

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const key = e.key.toUpperCase();
      let index = -1;

      if (['1', '2', '3', '4'].includes(key)) {
        index = parseInt(key, 10) - 1;
      } else if (['A', 'B', 'C', 'D'].includes(key)) {
        index = OPTION_LETTERS.indexOf(key);
      }

      if (index >= 0 && index < 4) {
        onSelectOption(index);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, onSelectOption]);

  if (!question) return null;

  const isCorrect = selectedOption === question.correctIndex;

  return (
    <article
      aria-labelledby="question-heading"
      className="max-w-2xl mx-auto w-full p-6 sm:p-7 rounded-xl bg-zinc-900 border border-zinc-800 shadow-sm space-y-6"
    >
      {/* Question Header & Meta */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        {/* Left Side: Difficulty Tag and Hint Button */}
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 text-xs font-medium uppercase tracking-wider">
            {difficulty}
          </span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-800/50 border border-zinc-700/40 text-zinc-400 uppercase">
            Single Choice
          </span>

          {question.hint && !isAnswered && (
            <button
              type="button"
              onClick={() =>
                setHintRevealedForId(showHint ? null : question.id)
              }
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition-colors cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>{showHint ? 'Hide hint' : 'Hint'}</span>
            </button>
          )}
        </div>

        {/* Right Side: Real-Time Exam Question Number */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-800/60 border border-zinc-700/40 text-zinc-400">
            +1.00 / 0.00
          </span>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 shadow-sm">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Question No.
            </span>
            <span className="inline-flex items-center justify-center gap-1.5 min-w-[1.75rem] px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700/80 text-white font-mono text-xs sm:text-sm font-bold">
              {isLoadingNext && <Loader2 className="w-3 h-3 text-indigo-400 animate-spin" />}
              <span>{String(questionNumber).padStart(2, '0')}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Hint Alert Box */}
      {showHint && !isAnswered && (
        <div
          role="note"
          className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start gap-2.5"
        >
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-amber-300">Clue:</span>
            <p className="text-zinc-300 leading-relaxed">{question.hint}</p>
          </div>
        </div>
      )}

      {/* Question Text */}
      <div className="space-y-2">
        <h2 id="question-heading" className="text-base sm:text-lg font-semibold text-zinc-100 leading-relaxed flex items-start gap-2.5">
          <span className="font-mono text-indigo-400 font-bold shrink-0 text-sm sm:text-base mt-0.5">
            Q{questionNumber}.
          </span>
          <span className="flex-1">
            <FormattedContent content={question.question} />
          </span>
        </h2>
      </div>

      {/* 4 Interactive Options */}
      <div
        role="radiogroup"
        aria-labelledby="question-heading"
        className="space-y-2.5 pt-1"
      >
        {question.options.map((optionText, index) => {
          const isThisSelected = selectedOption === index;
          const isThisCorrect = question.correctIndex === index;

          let optionStyle =
            'bg-zinc-950/60 hover:bg-zinc-850/80 border-zinc-800 text-zinc-200 hover:border-zinc-700';
          let badgeStyle = 'bg-zinc-800 text-zinc-400 border-zinc-700/80';

          if (isAnswered) {
            if (isThisCorrect) {
              optionStyle =
                'bg-emerald-950/40 border-emerald-500/80 text-emerald-100 ring-1 ring-emerald-500/30';
              badgeStyle = 'bg-emerald-500 text-white border-emerald-400 font-bold';
            } else if (isThisSelected && !isThisCorrect) {
              optionStyle =
                'bg-rose-950/40 border-rose-500/80 text-rose-100 ring-1 ring-rose-500/30';
              badgeStyle = 'bg-rose-500 text-white border-rose-400 font-bold';
            } else {
              optionStyle = 'bg-zinc-950/20 border-zinc-900 text-zinc-500 opacity-60';
              badgeStyle = 'bg-zinc-900 text-zinc-600 border-zinc-800';
            }
          }

          return (
            <button
              key={index}
              type="button"
              role="radio"
              aria-checked={isThisSelected}
              disabled={isAnswered}
              onClick={() => onSelectOption(index)}
              className={`w-full group text-left p-3.5 sm:p-4 rounded-xl border transition-colors flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${optionStyle}`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span
                  className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-mono font-semibold border shrink-0 transition-colors ${badgeStyle}`}
                >
                  {OPTION_LETTERS[index]}
                </span>
                <div className="flex-1 min-w-0">
                  <FormattedContent
                    content={optionText}
                    className="text-xs sm:text-sm font-medium leading-relaxed"
                  />
                </div>
              </div>

              {/* Status Icons or Keyboard Shortcut */}
              <div className="shrink-0 flex items-center gap-2">
                {!isAnswered && (
                  <span className="hidden sm:inline-block text-[11px] font-mono text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    [{index + 1}]
                  </span>
                )}
                {isAnswered && (
                  <>
                    {isThisCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isThisSelected && !isThisCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Immediate Feedback Card */}
      {isAnswered && (
        <ImmediateFeedback
          isCorrect={isCorrect}
          correctOptionText={question.options[question.correctIndex]}
          explanation={question.explanation}
          onNext={onNext}
          onFinish={onFinish}
          isLoadingNext={isLoadingNext}
        />
      )}
    </article>
  );
}
