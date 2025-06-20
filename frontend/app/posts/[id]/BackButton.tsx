'use client';

export default function BackButton() {
  return (
    <button 
      onClick={() => window.history.back()}
      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-200"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      이전 페이지
    </button>
  );
} 