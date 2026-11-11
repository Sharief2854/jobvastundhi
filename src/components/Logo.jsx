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
        <linearGradient id="logo-jv-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id="logo-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#18181b" />
          <stop offset="100%" stopColor="#09090b" />
        </linearGradient>
      </defs>
      {/* Outer rounded squircle */}
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="16"
        fill="url(#logo-bg-grad)"
        stroke="#27272a"
        strokeWidth="2.5"
      />
      {/* J Top & Stem */}
      <path
        d="M20 18h14"
        stroke="url(#logo-jv-grad)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M27 18v20c0 4.5-3 7.5-7.5 7.5-3.5 0-6.5-2-7.5-5"
        stroke="url(#logo-jv-grad)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      {/* Upward Career Checkmark */}
      <path
        d="M26 34l7 7 17-18"
        stroke="#10b981"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="23" r="2.5" fill="#34d399" />
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
            Job<span className="text-emerald-400">Vastundhi</span>
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
