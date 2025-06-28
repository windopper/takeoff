import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface BenchmarkTableProps {
  data: { [key: string]: string | number | React.ReactNode | Date }[];
  viewFields: string[];
  defaultSortBy: string;
}

const ITEMS_PER_PAGE = 15;

export default function BenchmarkTable({ data, viewFields, defaultSortBy }: BenchmarkTableProps) {
  const t = useTranslations('benchmarking.table');
  const [sortBy, setSortBy] = useState<string>(defaultSortBy);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <span className="text-zinc-400 font-semibold">{t('noData')}</span>
      </div>
    );
  }


  useEffect(() => {
    setSortBy(defaultSortBy);
    setSortOrder('desc');
    setCurrentPage(1);
  }, [defaultSortBy]);

  const keys = viewFields;

  // 데이터 정렬
  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortOrder === 'desc' 
        ? bValue.getTime() - aValue.getTime() 
        : aValue.getTime() - bValue.getTime();
    }

    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();
    
    if (sortOrder === 'desc') {
      return bStr.localeCompare(aStr);
    }
    return aStr.localeCompare(bStr);
  });

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
    setCurrentPage(1); // 정렬 시 첫 페이지로 이동
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      let start = Math.max(1, currentPage - half);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const formatValue = (value: string | number | React.ReactNode | Date) => {
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    if (typeof value === 'number') {
      return value % 1 === 0 ? value.toString() : value.toFixed(2);
    }
    return value;
  };

  const getSortIcon = (key: string) => {
    if (sortBy !== key) {
      return <span className="text-zinc-500">↕</span>;
    }
    return sortOrder === 'desc' ? 
      <span className="text-zinc-300">↓</span> : 
      <span className="text-zinc-300">↑</span>;
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="overflow-x-auto rounded-lg border border-zinc-700 shadow-xl backdrop-blur-sm">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-zinc-600/20">
              {keys.map((key, index) => (
                <th
                  key={key}
                  className={`px-2 py-2 text-left text-zinc-400 font-semibold cursor-pointer hover:text-zinc-300 transition-colors select-none ${
                    index === 0 ? 'rounded-tl-lg' : ''
                  } ${index === keys.length - 1 ? 'rounded-tr-lg' : ''}`}
                  onClick={() => handleSort(key)}
                >
                  <div className="flex items-center gap-1">
                    <span className="truncate text-xs">{key}</span>
                    {getSortIcon(key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${
                  rowIndex % 2 === 0 ? "bg-zinc-800/20" : "bg-zinc-900/20"
                } hover:bg-zinc-700/30 transition-colors`}
              >
                {keys.map((key, colIndex) => (
                  <td
                    key={key}
                    className={`px-2 py-2 text-zinc-300 ${
                      rowIndex === paginatedData.length - 1 && colIndex === 0 ? 'rounded-bl-lg' : ''
                    } ${
                      rowIndex === paginatedData.length - 1 && colIndex === keys.length - 1 ? 'rounded-br-lg' : ''
                    }`}
                  >
                    <div className="text-wrap text-xs max-w-64 truncate">
                      {formatValue(row[key]) || (
                        <span className="text-zinc-400 font-semibold">--</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-xs text-zinc-400 hover:text-zinc-300 disabled:text-zinc-600 disabled:cursor-not-allowed transition-colors"
          >
            {t('previous')}
          </button>
          
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                currentPage === page
                  ? 'bg-zinc-600 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-xs text-zinc-400 hover:text-zinc-300 disabled:text-zinc-600 disabled:cursor-not-allowed transition-colors"
          >
            {t('next')}
          </button>
        </div>
      )}
      
      {/* 테이블 정보 */}
      <div className="mt-3 flex justify-between items-center text-xs text-zinc-400">
        <span>
          총 {sortedData.length}개 중 {startIndex + 1}-{Math.min(endIndex, sortedData.length)}번째 표시
        </span>
        <span>
          {sortBy}로 정렬됨 ({sortOrder === 'desc' ? '내림차순' : '오름차순'})
        </span>
      </div>
    </div>
  );
}
