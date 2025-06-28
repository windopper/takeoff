import { getTranslations } from "next-intl/server";

export default async function BenchmarkHero({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'benchmarking' });
    
    return (
      <div className="flex flex-col w-screen items-center justify-center pb-16 pt-20 backdrop-blur-lg">
        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
        <p className="text-zinc-400 text-md">
          {t('description')}
        </p>
      </div>
    );
}