import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

/**
 * CodeBlock component with copy functionality, line numbers, and clean header
 */
function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split('\n');

  return (
    <div className="my-3 rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden shadow-sm text-xs sm:text-sm font-mono text-zinc-200">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900/90 border-b border-zinc-800 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-zinc-600" />
            <span className="w-2 h-2 rounded-full bg-zinc-600" />
            <span className="w-2 h-2 rounded-full bg-zinc-600" />
          </div>
          <span className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase ml-2 flex items-center gap-1">
            <Terminal className="w-3 h-3 text-zinc-400" />
            {language || 'code'}
          </span>
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body with Line Numbers */}
      <div className="p-3.5 overflow-x-auto scrollbar-thin">
        <pre className="flex leading-relaxed">
          {/* Line Numbers */}
          <span className="select-none pr-3.5 text-right text-zinc-600 font-mono shrink-0">
            {lines.map((_, i) => (
              <span key={i} className="block text-[12px]">
                {i + 1}
              </span>
            ))}
          </span>

          {/* Code Text */}
          <code className="text-zinc-100 font-mono text-[13px] whitespace-pre">
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}

/**
 * Parses inline formatting: backticks (`code`) and bold (**bold**)
 */
function renderInlineContent(text) {
  if (!text) return null;

  // Split by inline code: `code`
  const parts = text.split(/(`[^`]+`)/g);

  return parts.map((part, idx) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      const codeSnippet = part.slice(1, -1);
      return (
        <code
          key={idx}
          className="mx-1 px-1.5 py-0.5 rounded bg-zinc-800/90 border border-zinc-700/60 text-zinc-200 font-mono text-[0.9em] font-normal"
        >
          {codeSnippet}
        </code>
      );
    }

    // Handle **bold** text
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return (
      <React.Fragment key={idx}>
        {boldParts.map((sub, sIdx) => {
          if (sub.startsWith('**') && sub.endsWith('**') && sub.length > 4) {
            return (
              <strong key={sIdx} className="font-semibold text-zinc-100">
                {sub.slice(2, -2)}
              </strong>
            );
          }
          return sub;
        })}
      </React.Fragment>
    );
  });
}

/**
 * FormattedContent handles markdown code blocks (``` ... ```) and inline text
 */
export function FormattedContent({ content, className = '' }) {
  if (!content) return null;

  // Regex to match code blocks: ```lang\ncode\n```
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;

  const elements = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const textBefore = content.substring(lastIndex, match.index);
    if (textBefore.trim()) {
      elements.push(
        <div key={`text-${lastIndex}`} className="leading-relaxed whitespace-pre-line">
          {renderInlineContent(textBefore)}
        </div>
      );
    }

    const lang = match[1] || 'code';
    const code = match[2];
    elements.push(<CodeBlock key={`code-${match.index}`} code={code} language={lang} />);

    lastIndex = match.index + match[0].length;
  }

  const remainingText = content.substring(lastIndex);
  if (remainingText.trim()) {
    elements.push(
      <div key={`text-end`} className="leading-relaxed whitespace-pre-line">
        {renderInlineContent(remainingText)}
      </div>
    );
  }

  // If no code blocks were found, render inline text directly
  if (elements.length === 0) {
    return <div className={className}>{renderInlineContent(content)}</div>;
  }

  return <div className={`space-y-2 ${className}`}>{elements}</div>;
}
