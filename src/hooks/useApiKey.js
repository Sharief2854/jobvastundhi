import { useState, useCallback } from 'react';
import { validateGeminiKey } from '../services/gemini';

const STORAGE_KEY = 'gemini_student_api_key';

export function useApiKey() {
  const [apiKey, setApiKey] = useState(() => {
    return (
      localStorage.getItem(STORAGE_KEY) ||
      import.meta.env.VITE_GEMINI_API_KEY ||
      ''
    );
  });
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(() => {
    const existing =
      localStorage.getItem(STORAGE_KEY) ||
      import.meta.env.VITE_GEMINI_API_KEY;
    return !existing || existing.trim().length === 0;
  });

  const saveKey = useCallback(async (newKey) => {
    const trimmed = newKey.trim();
    if (!trimmed) {
      setValidationError('Please provide a valid API key.');
      return false;
    }

    setIsValidating(true);
    setValidationError(null);

    try {
      await validateGeminiKey(trimmed);
      localStorage.setItem(STORAGE_KEY, trimmed);
      setApiKey(trimmed);
      setIsModalOpen(false);
      return true;
    } catch (err) {
      setValidationError(err.message || 'Failed to validate API key.');
      return false;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const clearKey = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey('');
    setIsModalOpen(true);
    setValidationError(null);
  }, []);

  return {
    apiKey,
    isModalOpen,
    setIsModalOpen,
    isValidating,
    validationError,
    saveKey,
    clearKey,
    hasKey: Boolean(apiKey && apiKey.length > 5),
  };
}
