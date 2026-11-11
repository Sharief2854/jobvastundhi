import React, { useState } from 'react';
import {
  Code,
  Palette,
  FileCode2,
  Atom,
  Coffee,
  Terminal,
  Database,
  Binary,
  ShieldCheck,
  GitBranch,
  Brain,
  Calculator,
  ArrowRight,
  Search,
  Key,
} from 'lucide-react';
import { PREDEFINED_TOPICS, DIFFICULTIES } from '../constants/topics';
import { LogoIcon } from './Logo';

// Icon map for dynamic lookup
const ICON_MAP = {
  Code,
  Palette,
  FileCode2,
  Atom,
  Coffee,
  Terminal,
  Database,
  Binary,
  ShieldCheck,
  GitBranch,
  Brain,
  Calculator,
};

const SUGGESTED_TOPICS = [
  'HTML',
  'CSS',
  'JavaScript',
  'React.js',
  'Java',
  'Python',
  'SQL',
];

export function TopicSelector({
  onSelectTopic,
  selectedDifficulty,
  onSelectDifficulty,
  hasKey,
  onOpenKeyModal,
}) {
  const [customTopic, setCustomTopic] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Frontend', 'Programming', 'Databases', 'Core CS'];

  const filteredTopics =
    activeCategory === 'All'
      ? PREDEFINED_TOPICS
      : PREDEFINED_TOPICS.filter((t) => t.category === activeCategory);

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const trimmed = customTopic.trim();
    if (!trimmed) return;
    onSelectTopic(trimmed, selectedDifficulty);
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8 sm:py-12 space-y-8">
      {/* Editorial Header with JobVastundhi Brand & Sharief Credit */}
      <div className="space-y-3 text-center max-w-xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Fresher Placement Simulator</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400 font-medium">Developed by <strong className="text-zinc-200">Sharief</strong></span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <LogoIcon className="w-10 h-10 sm:w-12 sm:h-12" />
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Job<span className="text-emerald-400">Vastundhi</span>
          </h1>
        </div>

        <p className="text-sm text-zinc-400 leading-relaxed max-w-lg">
          టెన్షన్ పడకు... జాబ్ వచ్చేద్ది! Master the most-asked technical interview questions tested by top tech companies for entry-level roles.
        </p>
      </div>

      {/* Helper Banner when API Key is missing */}
      {!hasKey && (
        <div className="max-w-xl mx-auto p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs flex items-center justify-between gap-3 text-zinc-300 shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-300">
              <Key className="w-3.5 h-3.5" />
            </div>
            <span className="truncate">Need a free Gemini API key to practice?</span>
          </div>
          <button
            type="button"
            onClick={onOpenKeyModal}
            className="px-2.5 py-1 rounded bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-[11px] transition-colors shrink-0 shadow-sm cursor-pointer"
          >
            How to get a key →
          </button>
        </div>
      )}

      {/* Difficulty Segmented Control */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-xs font-medium text-zinc-400 mr-1">Difficulty:</span>
        <div
          role="group"
          aria-label="Quiz difficulty level"
          className="inline-flex p-1 rounded-lg bg-zinc-900 border border-zinc-800"
        >
          {DIFFICULTIES.map((diff) => {
            const isSelected = selectedDifficulty === diff.id;
            return (
              <button
                key={diff.id}
                type="button"
                onClick={() => onSelectDifficulty(diff.id)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/80'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title={diff.desc}
              >
                {diff.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Topic Input */}
      <div className="max-w-xl mx-auto space-y-2.5">
        <form
          onSubmit={handleCustomSubmit}
          className="relative flex items-center p-1 rounded-lg bg-zinc-900 border border-zinc-800 focus-within:border-zinc-600 transition-colors"
        >
          <div className="pl-3 pr-2 text-zinc-400">
            <Search className="w-4 h-4" />
          </div>
          <label htmlFor="custom-topic-input" className="sr-only">
            Enter custom topic
          </label>
          <input
            id="custom-topic-input"
            type="text"
            placeholder="Type any custom topic (e.g. Next.js, Kubernetes, Linux)..."
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            className="flex-1 bg-transparent py-2 px-2 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 outline-none"
          />
          <button
            type="submit"
            disabled={!customTopic.trim()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-zinc-100 hover:bg-white disabled:opacity-30 disabled:pointer-events-none text-zinc-950 text-xs font-semibold shadow-sm transition-colors cursor-pointer shrink-0"
          >
            <span>Start</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center text-xs text-zinc-400">
          <span className="text-[11px] text-zinc-400 mr-1">Suggestions:</span>
          {SUGGESTED_TOPICS.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => onSelectTopic(term, selectedDifficulty)}
              className="px-2 py-0.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-[11px] transition-colors cursor-pointer"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors shrink-0 cursor-pointer ${
              activeCategory === cat
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Predefined Topics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredTopics.map((topic) => {
          const IconComponent = ICON_MAP[topic.icon] || Sparkles;
          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => onSelectTopic(topic.name, selectedDifficulty)}
              className="group text-left p-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 transition-colors cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-md bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-300 group-hover:text-zinc-100 transition-colors">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
                    {topic.category}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors">
                    {topic.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {topic.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
