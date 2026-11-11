import { useState, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { generateBatchMcqs } from '../services/gemini';

const STORAGE_KEY = 'gemini_student_api_key';
const SESSION_BUFFER_KEY = 'quiz_stored_questions_buffer';
const BATCH_SIZE = 5;

export function useQuizEngine(apiKey) {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [bufferedCount, setBufferedCount] = useState(0);
  const [error, setError] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [history, setHistory] = useState([]);

  const [stats, setStats] = useState({
    attempted: 0,
    correct: 0,
    streak: 0,
    bestStreak: 0,
  });

  // In-memory buffer of prepared questions waiting to be displayed
  const queueRef = useRef([]);
  // Track how many questions have been answered to trigger periodic auto-refills
  const answeredCountRef = useRef(0);
  // Flag to avoid duplicate background refill requests
  const isRefillingRef = useRef(false);
  // All questions generated in current session to prevent repeats
  const allSessionQuestionsRef = useRef([]);

  const getCleanKey = useCallback(() => {
    return (apiKey || localStorage.getItem(STORAGE_KEY))?.trim();
  }, [apiKey]);

  const triggerCelebration = useCallback((streak) => {
    try {
      confetti({
        particleCount: streak >= 3 ? 75 : 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#6366f1', '#f59e0b'],
      });
    } catch {
      // Ignore if canvas is unavailable
    }
  }, []);

  /**
   * Generates more questions in the background and stores them in the buffer
   */
  const refillBufferInBackground = useCallback(
    async (topicName, diffLevel) => {
      if (isRefillingRef.current) return;
      const cleanKey = getCleanKey();
      if (!cleanKey) return;

      isRefillingRef.current = true;
      setIsBuffering(true);
      try {
        console.log(`[QuizBuffer] Generating and storing ${BATCH_SIZE} more questions for "${topicName}"...`);
        const newBatch = await generateBatchMcqs({
          apiKey: cleanKey,
          topic: topicName,
          difficulty: diffLevel,
          count: BATCH_SIZE,
          previousQuestions: allSessionQuestionsRef.current,
        });

        // Store and append to buffer queue
        queueRef.current.push(...newBatch);
        allSessionQuestionsRef.current.push(...newBatch);
        setBufferedCount(queueRef.current.length);

        // Persist stored questions in sessionStorage
        try {
          sessionStorage.setItem(
            SESSION_BUFFER_KEY,
            JSON.stringify(queueRef.current)
          );
        } catch {
          // Ignore storage quota
        }

        console.log(
          `[QuizBuffer] Successfully stored ${newBatch.length} new questions. Total in buffer: ${queueRef.current.length}`
        );
      } catch (err) {
        console.warn('[QuizBuffer] Background question generation failed, will retry on next turn:', err.message);
      } finally {
        isRefillingRef.current = false;
        setIsBuffering(false);
      }
    },
    [getCleanKey]
  );

  /**
   * Starts a new quiz: loads the initial 5-question batch into buffer
   */
  const startQuiz = useCallback(
    async (newTopic, newDifficulty = 'intermediate') => {
      setTopic(newTopic);
      setDifficulty(newDifficulty);
      setHistory([]);
      setQuestionNumber(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsFinished(false);
      setError(null);
      setIsLoading(true);

      answeredCountRef.current = 0;
      queueRef.current = [];
      allSessionQuestionsRef.current = [];
      isRefillingRef.current = false;
      setIsBuffering(false);
      setBufferedCount(0);

      try {
        sessionStorage.removeItem(SESSION_BUFFER_KEY);
      } catch {
        // Ignore
      }

      setStats({
        attempted: 0,
        correct: 0,
        streak: 0,
        bestStreak: 0,
      });

      try {
        const cleanKey = getCleanKey();
        const initialBatch = await generateBatchMcqs({
          apiKey: cleanKey,
          topic: newTopic,
          difficulty: newDifficulty,
          count: BATCH_SIZE,
          previousQuestions: [],
        });

        // Set Question 1 immediately
        const firstQuestion = initialBatch[0];
        // Store remaining questions into the queue buffer
        queueRef.current = initialBatch.slice(1);
        allSessionQuestionsRef.current = [...initialBatch];
        setBufferedCount(queueRef.current.length);

        try {
          sessionStorage.setItem(
            SESSION_BUFFER_KEY,
            JSON.stringify(queueRef.current)
          );
        } catch {
          // Ignore
        }

        setCurrentQuestion(firstQuestion);
        setQuestionNumber(1);

        // Proactively generate the next batch of 5 questions (6-10) in the background
        refillBufferInBackground(newTopic, newDifficulty);
      } catch (err) {
        console.error('Failed to load initial quiz batch:', err);
        setError(err.message || 'Failed to start quiz. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [getCleanKey, refillBufferInBackground]
  );

  /**
   * Answers the current question
   */
  const answerQuestion = useCallback(
    (optionIndex) => {
      if (isAnswered || !currentQuestion || isLoading) return;

      const isAnswerCorrect = optionIndex === currentQuestion.correctIndex;
      setSelectedOption(optionIndex);
      setIsAnswered(true);
      answeredCountRef.current += 1;

      // Update statistics
      setStats((prev) => {
        const newCorrect = isAnswerCorrect ? prev.correct + 1 : prev.correct;
        const newStreak = isAnswerCorrect ? prev.streak + 1 : 0;
        const newBestStreak = Math.max(prev.bestStreak, newStreak);

        if (isAnswerCorrect) {
          triggerCelebration(newStreak);
        }

        return {
          attempted: prev.attempted + 1,
          correct: newCorrect,
          streak: newStreak,
          bestStreak: newBestStreak,
        };
      });

      setHistory((prev) => [
        ...prev,
        {
          ...currentQuestion,
          selectedOption: optionIndex,
          isCorrect: isAnswerCorrect,
        },
      ]);

      // TRIGGER: After completing 2 or 3 questions (or whenever buffer has <= 3 remaining),
      // generate more questions in background and store them!
      const shouldRefill =
        answeredCountRef.current % 2 === 0 ||
        queueRef.current.length <= 3;

      if (shouldRefill && !isRefillingRef.current) {
        refillBufferInBackground(topic, difficulty);
      }
    },
    [
      isAnswered,
      currentQuestion,
      isLoading,
      topic,
      difficulty,
      refillBufferInBackground,
      triggerCelebration,
    ]
  );

  /**
   * Advances to next question: pops immediately from stored buffer queue (0ms latency!)
   */
  const nextQuestion = useCallback(async () => {
    if (!topic) return;

    // Fast path: Question is already stored in memory buffer!
    if (queueRef.current.length > 0) {
      const nextMcq = queueRef.current.shift();
      setBufferedCount(queueRef.current.length);
      try {
        sessionStorage.setItem(
          SESSION_BUFFER_KEY,
          JSON.stringify(queueRef.current)
        );
      } catch {
        // Ignore
      }

      setCurrentQuestion(nextMcq);
      setQuestionNumber((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);

      // Check if buffer is getting low (<= 3 left) and trigger background refill
      if (queueRef.current.length <= 3 && !isRefillingRef.current) {
        refillBufferInBackground(topic, difficulty);
      }
      return;
    }

    // Fallback: Buffer was temporarily empty, fetch directly
    setIsLoading(true);
    setError(null);
    try {
      const cleanKey = getCleanKey();
      const freshBatch = await generateBatchMcqs({
        apiKey: cleanKey,
        topic,
        difficulty,
        count: BATCH_SIZE,
        previousQuestions: allSessionQuestionsRef.current,
      });

      const nextMcq = freshBatch[0];
      queueRef.current = freshBatch.slice(1);
      allSessionQuestionsRef.current.push(...freshBatch);
      setBufferedCount(queueRef.current.length);

      try {
        sessionStorage.setItem(
          SESSION_BUFFER_KEY,
          JSON.stringify(queueRef.current)
        );
      } catch {
        // Ignore
      }

      setCurrentQuestion(nextMcq);
      setQuestionNumber((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } catch (err) {
      console.error('Failed to fetch next question batch:', err);
      setError(err.message || 'Failed to generate next questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [topic, difficulty, getCleanKey, refillBufferInBackground]);

  const finishQuiz = useCallback(() => {
    setIsFinished(true);
  }, []);

  const resetToTopicSelection = useCallback(() => {
    answeredCountRef.current = 0;
    queueRef.current = [];
    allSessionQuestionsRef.current = [];
    isRefillingRef.current = false;
    setIsBuffering(false);
    setBufferedCount(0);
    try {
      sessionStorage.removeItem(SESSION_BUFFER_KEY);
    } catch {
      // Ignore
    }
    setTopic('');
    setCurrentQuestion(null);
    setQuestionNumber(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setError(null);
    setIsFinished(false);
    setHistory([]);
    setStats({
      attempted: 0,
      correct: 0,
      streak: 0,
      bestStreak: 0,
    });
  }, []);

  return {
    topic,
    difficulty,
    currentQuestion,
    questionNumber,
    selectedOption,
    isAnswered,
    isCorrect: selectedOption !== null && currentQuestion?.correctIndex === selectedOption,
    isLoading,
    isBuffering,
    bufferedCount,
    error,
    stats,
    history,
    isFinished,
    startQuiz,
    answerQuestion,
    nextQuestion,
    finishQuiz,
    resetToTopicSelection,
    retryCurrent: () => startQuiz(topic, difficulty),
  };
}
