import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChartLine, Table } from "lucide-react";
import { useTranslations } from "next-intl";
import { BenchmarkContext } from "../BenchmarkSelector";

export interface GraphFilterProps<T extends string> {
  name: string;
  contents: T[];
  selected: T;
  setSelected: Dispatch<SetStateAction<T>>;
}

export function GraphFilter<T extends string>({
  name,
  contents,
  selected,
  setSelected,
}: GraphFilterProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const openRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openRef.current && openRef.current.contains(event.target as Node)) {
        return;
      }

      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <motion.div 
      className="flex flex-col gap-2 px-3 py-2 z-30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <motion.span 
        className="text-lg font-medium text-zinc-200 whitespace-nowrap px-2"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.15, delay: 0.05, ease: "easeOut" }}
      >
        {name}
      </motion.span>
      <motion.div
        className="relative flex flex-row items-center justify-between rounded-full px-4 cursor-pointer transition-all duration-300 ease-out hover:bg-zinc-700/30 bg-zinc-800/60 
        border border-zinc-600/30 text-zinc-100 min-w-48 h-8 group"
        onClick={() => setIsOpen((prev) => !prev)}
        ref={openRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15, delay: 0.1, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-xs font-[PyeojinGothic] font-bold whitespace-nowrap text-zinc-200 group-hover:text-white transition-colors duration-200">
          {selected}
        </span>
        <motion.span
          className={`text-xs transition-all duration-300 ml-1 ${
            isOpen ? "rotate-180 text-zinc-300" : "text-zinc-400"
          }`}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          ▼
        </motion.span>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute top-[calc(100%+8px)] left-0 w-full backdrop-blur-md bg-zinc-900/80 border border-zinc-700/50 rounded-lg 
              shadow-2xl z-50 flex flex-col gap-1 py-2 overflow-y-auto max-h-48"
              ref={ref}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.1, ease: "easeOut" }}
            >
              {contents.map((content: T, index) => (
                <motion.div
                  key={content}
                  className="text-xs font-[PyeojinGothic-Regular] whitespace-nowrap px-4 py-1.5 cursor-pointer transition-all duration-200 hover:bg-zinc-700/50 hover:text-white text-zinc-300 rounded-md mx-1"
                  onClick={() => setSelected(content)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.1, delay: index * 0.02, ease: "easeOut" }}
                  whileHover={{ x: 4 }}
                >
                  {content}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export function ViewTypeSetting({
  viewType,
  setViewType,
}: {
  viewType: "table" | "graph";
  setViewType: (viewType: "table" | "graph") => void;
}) {
  const t = useTranslations('benchmarking.settings');
  
  return (
    <motion.div 
      className="flex flex-col gap-2 px-3 py-2 z-30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <motion.span 
        className="text-lg font-medium text-zinc-200 whitespace-nowrap px-2"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.15, delay: 0.05, ease: "easeOut" }}
      >
        {t('viewType')}
      </motion.span>
      
      <motion.div 
        className="flex flex-row gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, delay: 0.1, ease: "easeOut" }}
      >
        {[
          { key: "graph" as const, label: t('graph'), icon: <ChartLine className="w-4 h-4" /> },
          { key: "table" as const, label: t('table'), icon: <Table className="w-4 h-4" /> },
        ].map(({ key, label, icon }, index) => (
          <motion.div
            key={key}
            className={`flex flex-row items-center justify-center gap-2 px-3 py-1 rounded-lg cursor-pointer transition-all duration-300 ease-out border min-w-20 group ${
              viewType === key
                ? "bg-blue-600/20 border-blue-500/50 text-blue-200 shadow-lg ring-1 ring-blue-400/20"
                : "bg-zinc-800/40 border-zinc-700/30 text-zinc-400 hover:bg-zinc-700/30 hover:border-zinc-600/40 hover:text-zinc-200"
            }`}
            onClick={() => setViewType(key)}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.15, delay: 0.15 + index * 0.05, ease: "easeOut" }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span
              className={`flex flex-row items-center gap-1 text-xs font-medium transition-colors duration-200 ${
                viewType === key
                  ? "text-blue-200"
                  : "text-zinc-400 group-hover:text-zinc-200"
              }`}
            >
              {icon}
              <span className="text-xs font-medium">{label}</span>
            </span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export function GraphLabelGroupSetting({
  isGroupColorSetting,
  setIsGroupColorSetting,
  groupBy,
  setGroupBy,
}: {
  isGroupColorSetting: boolean;
  setIsGroupColorSetting: Dispatch<SetStateAction<boolean>>;
  groupBy: "organization" | "country" | "public";
  setGroupBy: Dispatch<SetStateAction<"organization" | "country" | "public">>;
}) {
  const t = useTranslations('benchmarking.settings');

  return (
    <motion.div 
      className="flex flex-col gap-2 px-3 py-2 z-30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.15, ease: "easeOut" }}
    >
      {/* Toggler */}
      <div className="flex flex-row gap-2 items-center">
        <motion.span 
          className="text-sm font-medium text-zinc-200 whitespace-nowrap px-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.15, delay: 0.2, ease: "easeOut" }}
        >
          {t('groupColorSetting')}
        </motion.span>

        {/* ON/OFF Toggle */}
        <motion.div
          className="flex flex-row gap-2 items-center cursor-pointer"
          onClick={() => setIsGroupColorSetting((prev) => !prev)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15, delay: 0.25, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div 
            className={`w-8 h-5 rounded-full relative transition-all duration-300 ease-out ${
              isGroupColorSetting ? "bg-blue-500/80 ring-2 ring-blue-400/50" : "bg-zinc-700/50 ring-2 ring-zinc-600/30"
            }`}
            animate={{ 
              backgroundColor: isGroupColorSetting ? "rgba(59, 130, 246, 0.8)" : "rgba(63, 63, 70, 0.5)" 
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <motion.div
              className="w-4 h-4 bg-zinc-200 rounded-full absolute top-1/2 -translate-y-1/2 shadow-sm ring-1 ring-white/10"
              animate={{ 
                x: isGroupColorSetting ? "12px" : "2px"
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            ></motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Grouping Selector */}
      <AnimatePresence>
        {isGroupColorSetting && (
          <motion.div 
            className="flex flex-col gap-3 mt-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <motion.span 
              className="text-sm font-medium text-zinc-300 px-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15, delay: 0.05, ease: "easeOut" }}
            >
              {t('groupBy')}
            </motion.span>
            <motion.div 
              className="flex flex-row gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15, delay: 0.1, ease: "easeOut" }}
            >
              {[
                { key: "country" as const, label: t('country')},
                { key: "organization" as const, label: t('organization')},
                // { key: "public" as const, label: t('public')},
              ].map(({ key, label }, index) => (
                <motion.div
                  key={key}
                  className={`flex flex-col items-center gap-2 p-1 rounded-lg cursor-pointer transition-all duration-300 ease-out border min-w-20 group ${
                    groupBy === key
                      ? "bg-zinc-700/60 border-zinc-500/50 text-zinc-100 shadow-lg"
                      : "bg-zinc-800/40 border-zinc-700/30 text-zinc-400 hover:bg-zinc-700/30 hover:border-zinc-600/40 hover:text-zinc-200"
                  }`}
                  onClick={() => setGroupBy(key)}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ duration: 0.15, delay: 0.15 + index * 0.05, ease: "easeOut" }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span
                    className={`text-xs font-medium transition-colors duration-200 ${
                      groupBy === key
                        ? "text-zinc-100"
                        : "text-zinc-400 group-hover:text-zinc-200"
                    }`}
                  >
                    {label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function LegendGroup({ legends }: { legends: { name: string; color: string }[] }) {
  return (
    <motion.div
      className="grid grid-rows-5 gap-x-3 gap-y-1.5"
      style={{
        gridTemplateColumns: `repeat(${Math.ceil(
          legends.length / 5
        )}, minmax(0, 1fr))`,
        gridAutoFlow: "column",
      }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <AnimatePresence>
        {legends.map((legend, index) => (
          <motion.div
            key={`${legend.name}-${index}`}
            className="flex flex-row gap-2 items-center justify-start"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.15, delay: index * 0.02, ease: "easeOut" }}
            whileHover={{ scale: 1.05, x: 4 }}
          >
            <motion.div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: legend.color }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.15, delay: index * 0.02, ease: "easeOut" }}
            ></motion.div>
            <motion.span 
              className="text-sm font-medium text-zinc-200 whitespace-nowrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, delay: index * 0.02, ease: "easeOut" }}
            >
              {legend.name}
            </motion.span>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

function LegendGroupMemoWithAnimatePresence({ legends, isGroupColorSetting }: { legends: { name: string; color: string }[], isGroupColorSetting: boolean }) {
  return (
    <AnimatePresence mode="wait">
    {isGroupColorSetting && legends.length > 0 && (
      <motion.div 
        className="flex flex-row flex-1 justify-end gap-2 px-3 py-2 z-30"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <LegendGroup 
          key={`legends-${legends.map(l => l.name).join('-')}`}
          legends={legends} 
        />
      </motion.div>
    )}
  </AnimatePresence>
  );
}

export function GraphSettingWrapper<T extends string>({
  filters,
  legends = []
}: {
  filters: GraphFilterProps<T>[];
  legends?: {
    name: string;
    color: string;
  }[];
}) {
  const { isMobile, viewType, setViewType, color, setColor, groupBy, setGroupBy } = useContext(BenchmarkContext);

  return (
    <motion.div
      className={`flex flex-col gap-2 max-w-6xl w-full m-auto rounded-2xl px-4 min-h-52 ${
        isMobile ? "hidden" : ""
      }`}
    >
      <motion.div className="flex flex-row gap-2 justify-between items-center ml-6 border-b border-zinc-700/50 pb-2">
        <motion.h1 className="text-lg font-bold">그래프 설정</motion.h1>
      </motion.div>
      <motion.div
        className="flex flex-row gap-2 w-full px-3 py-2 z-30 max-h-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <ViewTypeSetting viewType={viewType} setViewType={setViewType} />
        {viewType === "graph" && (
          <>
            {filters.map((filter, index) => (
              <motion.div
                key={filter.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.15,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
              >
                <GraphFilter {...filter} />
              </motion.div>
            ))}
            <GraphLabelGroupSetting
              isGroupColorSetting={color}
              setIsGroupColorSetting={setColor}
              groupBy={groupBy}
              setGroupBy={setGroupBy}
            />
            <LegendGroupMemoWithAnimatePresence
              legends={legends}
              isGroupColorSetting={color}
            />
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
