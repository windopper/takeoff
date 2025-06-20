'use client';

import { useRouter, useSearchParams } from "next/navigation";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = (e.target as HTMLInputElement).value;
      if (value) {
        router.push(`/search?q=${value}`);
      }
    }
  }

  return (
    <div className="flex items-center gap-3">
      <input
        type="text"
        placeholder="검색"
        className="px-3 py-1.5 text-xs font-medium border-b text-zinc-600
                 dark:text-zinc-400 backdrop-blur-sm outline-none"
        onKeyUp={handleSearch}
        defaultValue={query || ''}
      />
    </div>
  );
}
