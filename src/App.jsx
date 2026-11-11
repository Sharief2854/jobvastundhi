import React, { useState } from 'react';
import { useApiKey } from './hooks/useApiKey';
import { useQuizEngine } from './hooks/useQuizEngine';
import { Navbar } from './components/Navbar';
import { ApiKeyModal } from './components/ApiKeyModal';
import { TopicSelector } from './components/TopicSelector';
import { QuestionCard } from './components/QuestionCard';
import { QuestionPalette } from './components/QuestionPalette';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { QuizSummaryModal } from './components/QuizSummaryModal';
import { AchievementBoard } from './components/AchievementBoard';
import { exportToPdf } from './utils/exportQuestions';
import { AlertCircle, RotateCcw } from 'lucide-react';
import './App.css';

export default function App() {
  const {
    apiKey,
    isModalOpen,
    setIsModalOpen,
    isValidating,
    validationError,
    saveKey,
    clearKey,
    hasKey,
  } = useApiKey();

  const [selectedDifficulty, setSelectedDifficulty] = useState('intermediate');
  const [pendingTopic, setPendingTopic] = useState(null);
  const [activeMilestone, setActiveMilestone] = useState(null);
  const [celebratedMilestones, setCelebratedMilestones] = useState([]);

  const quiz = useQuizEngine(apiKey);

  // When user picks a topic from TopicSelector
  const handleSelectTopic = (topicName, difficulty) => {
    setActiveMilestone(null);
    setCelebratedMilestones([]);
    if (!hasKey) {
      setPendingTopic({ name: topicName, difficulty });
      setIsModalOpen(true);
      return;
    }
    quiz.startQuiz(topicName, difficulty);
  };

  // When user saves key, if they had picked a topic right before, automatically start!
  const handleSaveKey = async (newKey) => {
    const success = await saveKey(newKey);
    if (success && pendingTopic) {
      quiz.startQuiz(pendingTopic.name, pendingTopic.difficulty);
      setPendingTopic(null);
    }
    return success;
  };

  const handleRestartSameTopic = () => {
    setActiveMilestone(null);
    setCelebratedMilestones([]);
    quiz.startQuiz(quiz.topic, quiz.difficulty);
  };

  // Milestone gate after every 10 questions
  const handleNextQuestion = () => {
    const answeredCount = quiz.history.length;
    if (
      answeredCount > 0 &&
      answeredCount % 10 === 0 &&
      !celebratedMilestones.includes(answeredCount)
    ) {
      setActiveMilestone(answeredCount);
      setCelebratedMilestones((prev) => [...prev, answeredCount]);
      return;
    }
    quiz.nextQuestion();
  };

  const handleContinueMilestone = () => {
    setActiveMilestone(null);
    quiz.nextQuestion();
  };

  const handleFinishMilestone = () => {
    setActiveMilestone(null);
    quiz.finishQuiz();
  };

  const isInQuiz = Boolean(quiz.topic);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar
        topic={quiz.topic}
        stats={quiz.stats}
        hasKey={hasKey}
        onOpenKeyModal={() => setIsModalOpen(true)}
        onChangeTopic={quiz.resetToTopicSelection}
        isInQuiz={isInQuiz}
        onDownload={() =>
          exportToPdf({
            questions: quiz.history,
            topic: quiz.topic,
            stats: quiz.stats,
            difficulty: quiz.difficulty,
          })
        }
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        {!isInQuiz ? (
          /* Topic Selection Screen */
          <TopicSelector
            onSelectTopic={handleSelectTopic}
            selectedDifficulty={selectedDifficulty}
            onSelectDifficulty={setSelectedDifficulty}
            hasKey={hasKey}
            onOpenKeyModal={() => setIsModalOpen(true)}
          />
        ) : (
          /* Quiz Gameplay Screen - 2 Column Layout with Right-Side Question Numbers Palette */
          <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-start justify-center gap-6">
            {/* Left/Main Column: Question Card & Loading States */}
            <div className="flex-1 w-full max-w-2xl min-w-0 order-1 space-y-6">
              {/* Loading Skeleton */}
              {quiz.isLoading && (
                <LoadingSkeleton
                  topic={quiz.topic}
                  questionNumber={quiz.questionNumber || 1}
                  onCancel={quiz.resetToTopicSelection}
                />
              )}

              {/* Error State */}
              {quiz.error && !quiz.isLoading && (
                <div
                  role="alert"
                  className="p-6 sm:p-8 rounded-xl bg-zinc-900/80 border border-rose-900/40 text-center space-y-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-zinc-100">
                      Failed to Load Question
                    </h3>
                    <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                      {quiz.error}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={quiz.retryCurrent}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Try Again</span>
                    </button>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors cursor-pointer"
                    >
                      Change API Key
                    </button>
                    <button
                      onClick={quiz.resetToTopicSelection}
                      className="px-4 py-2 rounded-lg bg-transparent hover:bg-zinc-800/60 text-zinc-400 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                    >
                      Back to Topics
                    </button>
                  </div>
                </div>
              )}

              {/* Question Card Display */}
              {!quiz.isLoading && !quiz.error && quiz.currentQuestion && (
                <QuestionCard
                  question={quiz.currentQuestion}
                  questionNumber={quiz.questionNumber}
                  difficulty={quiz.difficulty}
                  selectedOption={quiz.selectedOption}
                  isAnswered={quiz.isAnswered}
                  onSelectOption={quiz.answerQuestion}
                  onNext={handleNextQuestion}
                  onFinish={quiz.finishQuiz}
                  isLoadingNext={quiz.isLoading}
                />
              )}
            </div>

            {/* Right Column: Question Numbers Palette (Real-Time Exam Sidebar) */}
            <aside className="w-full lg:w-80 lg:shrink-0 lg:sticky lg:top-20 order-2">
              <QuestionPalette
                currentQuestionNumber={quiz.questionNumber || 1}
                history={quiz.history}
                topic={quiz.topic}
                difficulty={quiz.difficulty}
                isLoading={quiz.isLoading}
                isBuffering={quiz.isBuffering}
                bufferedCount={quiz.bufferedCount}
              />
            </aside>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-zinc-400 text-xs">
            <span className="font-bold text-zinc-100">Job<span className="text-emerald-400">Vastundhi</span></span>
            <span className="text-zinc-600">•</span>
            <span>Developed by <strong className="text-zinc-200 font-semibold">Sharief</strong></span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="text-zinc-500 hidden sm:inline">100% Client-Side Engine</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <button
              onClick={() => setIsModalOpen(true)}
              className="hover:text-zinc-200 transition-colors cursor-pointer"
            >
              API Key Settings
            </button>
            <span className="text-zinc-700">•</span>
            <button
              onClick={quiz.resetToTopicSelection}
              className="hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Topics
            </button>
          </div>
        </div>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentKey={apiKey}
        onSave={handleSaveKey}
        onClear={clearKey}
        isValidating={isValidating}
        validationError={validationError}
        canClose={hasKey}
      />

      {/* 10-Question Milestone Achievement Board */}
      <AchievementBoard
        isOpen={Boolean(activeMilestone)}
        milestoneCount={activeMilestone || 10}
        stats={quiz.stats}
        history={quiz.history}
        topic={quiz.topic}
        difficulty={quiz.difficulty}
        onContinue={handleContinueMilestone}
        onFinish={handleFinishMilestone}
      />

      {/* Quiz Completion Summary Modal */}
      <QuizSummaryModal
        isOpen={quiz.isFinished}
        stats={quiz.stats}
        history={quiz.history}
        topic={quiz.topic}
        difficulty={quiz.difficulty}
        onRestartSameTopic={handleRestartSameTopic}
        onChangeTopic={quiz.resetToTopicSelection}
      />
    </div>
  );
}
