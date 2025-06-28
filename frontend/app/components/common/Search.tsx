'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const t = useTranslations('common');

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
        placeholder={t('search')}
        className="px-3 py-1.5 text-xs font-medium border-b text-zinc-600
                 dark:text-zinc-400 backdrop-blur-sm outline-none md:w-32 w-16"
        onKeyUp={handleSearch}
        defaultValue={query || ''}
      />
    </div>
  );
}
