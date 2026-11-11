import React from 'react';

export function LogoIcon({ className = 'w-8 h-8' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0`}
      aria-hidden="true"
    >
      <defs>
        {/* Background Obsidian Gradient */}
        <linearGradient id="logo-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#18181b" />
          <stop offset="100%" stopColor="#09090b" />
        </linearGradient>

        {/* Ambient Center Glow */}
        <radialGradient id="logo-ambient-glow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>

        {/* Border Stroke Gradient */}
        <linearGradient id="logo-border-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3f3f46" />
          <stop offset="50%" stopColor="#27272a" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
        </linearGradient>

        {/* J Glyph Gradient (Tech Cyan to Indigo) */}
        <linearGradient id="logo-j-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>

        {/* V Glyph Gradient (Emerald to Luminous Mint) */}
        <linearGradient id="logo-v-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="45%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>

      {/* Squircle Base Frame */}
      <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#logo-bg)" />
      <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#logo-ambient-glow)" />
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="16"
        stroke="url(#logo-border-grad)"
        strokeWidth="1.75"
      />

      {/* J Glyph: Modern vertical column curving into bottom hook */}
      <path
        d="M21 16v19c0 5-4 9-9 9"
        stroke="url(#logo-j-grad)"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* V Glyph: Upward Victory / Career Success Checkmark */}
      <path
        d="M31 29l8 15 13-28"
        stroke="url(#logo-v-grad)"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ showTagline = true, size = 'md' }) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div className="flex items-center gap-3">
      <LogoIcon className={isSm ? 'w-7 h-7' : isLg ? 'w-11 h-11' : 'w-9 h-9'} />
      <div className="flex flex-col text-left">
        <div className="flex items-baseline gap-1">
          <span
            className={`font-black tracking-tight text-white ${
              isSm ? 'text-sm' : isLg ? 'text-2xl sm:text-3xl' : 'text-base sm:text-lg'
            }`}
          >
            Job<span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Vastundhi</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        {showTagline && (
          <span
            className={`font-medium text-zinc-400 leading-none ${
              isSm ? 'text-[9px]' : 'text-[11px]'
            }`}
          >
            Developed by <strong className="text-zinc-200 font-semibold">Sharief</strong>
          </span>
        )}
      </div>
    </div>
  );
}
