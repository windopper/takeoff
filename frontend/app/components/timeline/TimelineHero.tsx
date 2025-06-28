import { motion } from "motion/react";
import { useTranslations } from "next-intl";

export default function TimelineHero() {
  const t = useTranslations('timeline');

  return (
    <motion.div className="mt-16 pt-16 h-64 p-4 flex items-center justify-center w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="flex flex-col items-center justify-center p-2">
        <motion.h1 className="sm:text-4xl text-2xl font-bold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {t('title')}
        </motion.h1>

        <motion.div className="sm:text-sm text-xs text-zinc-500 mt-4 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {t('description')}
          <br />
          {t('linkDescription')}
          <motion.p className="sm:text-xs text-xs text-zinc-500 mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {t('disclaimer')}
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
