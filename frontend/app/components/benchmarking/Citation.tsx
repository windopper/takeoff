import { getTranslations } from "next-intl/server";

export default async function Citation({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'benchmarking.citation' });
  
  return (
    <div className="mt-8 p-4 border-t border-zinc-700 pt-8">
      <h3 className="text-sm font-semibold text-zinc-300 mb-3">{t('title')}</h3>
      <div className="text-sm text-zinc-400 space-y-2">
        <p>
          <strong className="text-zinc-300">{t('citationLabel')}</strong>{' '}
          Epoch AI, 'AI Benchmarking Hub'. Published online at epoch.ai. 
          Retrieved from{' '}
          <a 
            href="https://epoch.ai/data/ai-benchmarking-dashboard" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            https://epoch.ai/data/ai-benchmarking-dashboard
          </a>
          {' '}[online resource]. Accessed 9 Aug 2025.
        </p>
        <p>
          <strong className="text-zinc-300">{t('licenseLabel')}</strong>{' '}
          {t('licenseText')}
        </p>
      </div>
    </div>
  );
} 