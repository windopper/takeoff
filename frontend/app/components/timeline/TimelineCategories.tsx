import { CATEGORIES } from "@/data/timelineData";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

export default function TimelineCategories({
  setSelectedCategories,
  categories,
}: {
  setSelectedCategories: React.Dispatch<React.SetStateAction<CATEGORIES[]>>;
  categories: CATEGORIES[];
}) {
  const t = useTranslations('timeline.categories');

  const handleToggleCategories = (category: CATEGORIES) => {
    setSelectedCategories((prev: CATEGORIES[]) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      }
      return [...prev, category];
    });
  };

  return (
    <motion.div className="flex flex-row justify-center gap-2 w-full py-8 flex-wrap"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {Object.values(CATEGORIES).map((category) => (
        <button
          key={category}
          onClick={() => handleToggleCategories(category)}
          className={`${
            categories.includes(category) ? "bg-zinc-500/50 text-zinc-100" : "bg-zinc-200/50 text-zinc-800 backdrop-blur-2xl"
          } px-2 py-1 rounded-xl transition-all duration-150 text-xs font-medium cursor-pointer`}
        >
          {t(category)}
        </button>
      ))}
    </motion.div>
  );
}
