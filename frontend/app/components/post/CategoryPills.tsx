'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CategoryPills({ categories }: { categories: string[] }) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showPlusButton, setShowPlusButton] = useState(true);
  
  if (categories.length === 0) return null;
  
  const firstCategory = categories[0];
  const remainingCategories = categories.slice(1);
  const hasMoreCategories = remainingCategories.length > 0;

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    setIsExpanded(true);
  };

  const handleClickCategory = (category: string, e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    router.push(`/search?category=${category}`);
    setIsExpanded(false);
  };

  const handleClose = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    setIsExpanded(false);
  };

  // 확장 시: +버튼 숨기기 → 카테고리 보여주기
  useEffect(() => {
    if (isExpanded) {
      setShowPlusButton(false);
      // +버튼이 사라질 시간을 기다린 후 카테고리 보여주기
      const timer = setTimeout(() => {
        setShowCategories(true);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      // 축소 시: 카테고리 숨기기 → +버튼 보여주기
      setShowCategories(false);
      // 카테고리가 사라질 시간을 기다린 후 +버튼 보여주기
      const timer = setTimeout(() => {
        setShowPlusButton(true);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  return (
    <div className="flex flex-wrap gap-2 relative">
      {/* 첫 번째 카테고리 (항상 표시) */}
      <span
        className="px-2.5 py-1 text-xs font-medium bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-lg cursor-pointer"
        onClick={(e) => handleClickCategory(firstCategory, e)}
      >
        {firstCategory}
      </span>

      {/* 나머지 카테고리 개수 표시 */}
      <AnimatePresence>
        {hasMoreCategories && showPlusButton && (
          <motion.span
            className="px-2.5 py-1 text-xs font-medium bg-gray-100/80 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 rounded-lg cursor-pointer transition-colors hover:bg-gray-200/80 dark:hover:bg-gray-700/50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={handleClick}
          >
            +{remainingCategories.length}
          </motion.span>
        )}
      </AnimatePresence>

      {/* 확장된 카테고리들 */}
      <AnimatePresence>
        {showCategories && hasMoreCategories && (
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
              staggerChildren: 0.05,
            }}
          >
            {remainingCategories.map((category, index) => (
              <motion.span
                key={category}
                className="px-2.5 py-1 text-xs font-medium bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-lg cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.15,
                  delay: index * 0.03,
                  ease: "easeOut",
                }}
                onClick={(e) => handleClickCategory(category, e)}
              >
                {category}
              </motion.span>
            ))}

            {/* 닫기 버튼 */}
            <motion.span
              className="px-2.5 py-1 text-xs font-medium bg-zinc-900/50 dark:bg-zinc-900/50 text-zinc-400 dark:text-zinc-400
               rounded-lg cursor-pointer transition-colors"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.15,
                delay: remainingCategories.length * 0.03,
                ease: "easeOut",
              }}
              onClick={handleClose}
            >
              ×
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}