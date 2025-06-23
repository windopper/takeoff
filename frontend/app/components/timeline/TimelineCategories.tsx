import { CATEGORIES } from "@/data/timelineData";

const CATEGORY_MAP = {
  [CATEGORIES.MODEL_RELEASE]: "Model Release",
  [CATEGORIES.CULTURE]: "Culture & Society",
  [CATEGORIES.BUSINESS]: "Business & Industry",
  [CATEGORIES.RESEARCH]: "Research & Development",
  [CATEGORIES.POLICY]: "Policy & Regulation",
}

export default function TimelineCategories({
  setSelectedCategories,
  categories,
}: {
  setSelectedCategories: React.Dispatch<React.SetStateAction<CATEGORIES[]>>;
  categories: CATEGORIES[];
}) {
  const handleToggleCategories = (category: CATEGORIES) => {
    setSelectedCategories((prev: CATEGORIES[]) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      }
      return [...prev, category];
    });
  };

  return (
    <div className="flex flex-row justify-center gap-2 w-full py-8 flex-wrap">
      {Object.values(CATEGORIES).map((category) => (
        <button
          key={category}
          onClick={() => handleToggleCategories(category)}
          className={`${
            categories.includes(category) ? "bg-zinc-500/50 text-zinc-100" : "bg-zinc-200/50 text-zinc-800 backdrop-blur-2xl"
          } px-2 py-1 rounded-xl transition-all duration-150 text-xs font-medium cursor-pointer`}
        >
          {CATEGORY_MAP[category]}
        </button>
      ))}
    </div>
  );
}
