import React, { useState, useEffect } from 'react';
import {
  Key,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
  ShieldCheck,
  X,
  Loader2,
  Trash2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from 'lucide-react';

export function ApiKeyModal({
  isOpen,
  onClose,
  currentKey,
  onSave,
  onClear,
  isValidating,
  validationError,
  canClose,
}) {
  const [inputValue, setInputValue] = useState(currentKey || '');
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  // Show instructions by default if no key is currently saved
  const [showInstructions, setShowInstructions] = useState(!currentKey);

  // Handle Escape key listener
  useEffect(() => {
    if (!isOpen || !canClose) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, canClose, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    const success = await onSave(inputValue);
    if (success) {
      setSuccessMessage('API key verified and saved.');
      setTimeout(() => {
        onClose();
      }, 600);
    }
  };

  const handleClear = () => {
    if (window.confirm('Remove saved Gemini API key from your browser?')) {
      onClear();
      setInputValue('');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-modal-title"
      aria-describedby="api-key-modal-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && canClose) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-lg rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl p-6 text-zinc-100 my-8">
        {/* Close Button */}
        {canClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-200 shrink-0">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <h2 id="api-key-modal-title" className="text-base font-semibold text-zinc-100">
              {currentKey ? 'API Key Settings' : 'Connect Google Gemini API Key'}
            </h2>
            <p id="api-key-modal-desc" className="text-xs text-zinc-400">
              JobVastundhi runs 100% in your browser • Free • Direct from Google AI Studio
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="gemini-api-key-input"
                className="block text-xs font-medium text-zinc-300"
              >
                Paste your API Key
              </label>
              <button
                type="button"
                onClick={() => setShowInstructions(!showInstructions)}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3 h-3 text-zinc-400" />
                <span>How to get a key?</span>
                {showInstructions ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            </div>

            <div className="relative">
              <input
                id="gemini-api-key-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="AIzaSy..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isValidating}
                className="w-full px-3 py-2 pr-10 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-zinc-600 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 outline-none transition font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-200 transition-colors"
                title={showPassword ? 'Hide key' : 'Show key'}
              >
                {showPassword ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Step-by-Step Instructions Panel (Expandable) */}
          {showInstructions && (
            <div className="rounded-lg bg-zinc-950/80 border border-zinc-800 p-4 space-y-3 text-xs animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-zinc-800 text-[10px] flex items-center justify-center font-bold text-zinc-300">
                    ℹ️
                  </span>
                  How to get your free key (3 easy steps):
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                  100% Free
                </span>
              </div>

              <ol className="space-y-2 text-zinc-300 leading-relaxed list-decimal list-inside">
                <li className="pl-1">
                  Open{' '}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-100 underline decoration-zinc-600 hover:decoration-white font-medium inline-flex items-center gap-1"
                  >
                    Google AI Studio
                    <ExternalLink className="w-3 h-3 inline" />
                  </a>{' '}
                  and sign in with your regular Google account.
                </li>
                <li className="pl-1">
                  Click the blue <strong className="text-white">"Create API key"</strong> button (select any project or "Create key in new project").
                </li>
                <li className="pl-1">
                  Copy the generated key (starts with <code className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-200 font-mono text-[11px]">AIzaSy...</code>) and paste it into the box above.
                </li>
              </ol>

              <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
                <span>💳 No credit card needed</span>
                <span>⚡ Instant activation</span>
              </div>
            </div>
          )}

          {/* Privacy Note */}
          <div className="p-3 rounded-lg bg-zinc-950/40 border border-zinc-800/80 text-xs text-zinc-400 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Your key is saved only in your browser's <code className="text-zinc-300">localStorage</code>. It is sent directly to Google's official endpoint and never stored on any server.
            </p>
          </div>

          {/* Error Message */}
          {validationError && (
            <div role="alert" className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <div className="space-y-0.5">
                <span className="font-medium">Verification failed:</span>
                <p className="opacity-90">{validationError}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-1">
            <button
              type="submit"
              disabled={isValidating || !inputValue.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-zinc-100 hover:bg-white disabled:opacity-40 disabled:pointer-events-none font-semibold text-xs text-zinc-950 shadow-sm transition-colors cursor-pointer"
            >
              {isValidating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Verifying with Google...
                </>
              ) : (
                'Save and verify key'
              )}
            </button>

            {currentKey && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isValidating}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-rose-950/40 hover:text-rose-400 border border-zinc-700/80 hover:border-rose-800 text-zinc-400 transition-colors cursor-pointer"
                title="Remove saved key"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Free API Key Direct Action Link */}
        <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span>Get your key from Google AI Studio:</span>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-750 text-zinc-200 hover:text-white font-medium transition-colors"
          >
            <span>Open Google AI Studio</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>
        </div>
      </div>
    </div>
  );
}
