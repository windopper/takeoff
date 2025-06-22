import { Fragment } from "react";

export default function TimelineYear({
  startYear,
  endYear,
  progress,
  currentYear,
  currentMonth,
}: {
  startYear: number;
  endYear: number;
  progress: number;
  currentYear?: number;
  currentMonth?: number;
}) {
  const years = [];
  for (let i = startYear; i <= endYear; i++) {
    years.push(i);
  }
  const months = ["Apr", "Jul", "Oct"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let nextTop = -32 * 4;

  const elements = years.map((year, index) => {
    nextTop += 32 * 4;
    const isCurrentYear = currentYear === year;

    return (
      <Fragment key={`${index}-year`}>
        <Year 
          year={year.toString()} 
          top={nextTop} 
          key={`${index}-year`} 
          isHighlighted={isCurrentYear}
        />
        {!isCurrentYear && months.map((month, monthIndex) => {
          const monthNum = ["Apr", "Jul", "Oct"].indexOf(month) * 3 + 4; // Apr=4, Jul=7, Oct=10
          const isCurrentMonth = isCurrentYear && currentMonth === monthNum;
          return (
            <Month 
              month={month} 
              top={nextTop + (monthIndex + 1) * 32} 
              key={`${index}-${monthIndex}-month`}
              isHighlighted={isCurrentMonth}
            />
          );
        })}
        {/* 현재 포커싱된 월이 표시된 3개 월(Apr, Jul, Oct)이 아닌 경우 별도 표시 */}
        {isCurrentYear && currentMonth && (
          <Month 
            month={monthNames[currentMonth - 1]} 
            top={nextTop + ((currentMonth - 1) % 12) / 3 * 32} 
            key={`${index}-current-month`}
            isHighlighted={true}
          />
        )}
      </Fragment>
    );
  });

  return elements;
}

function Year({ year, top, isHighlighted }: { year: string; top: number; isHighlighted?: boolean }) {
  return (
    <h1 
      className={`absolute text-xl flex items-center font-bold h-8 right-4 transition-colors duration-300 ${
        isHighlighted ? 'text-blue-400' : ''
      }`} 
      style={{ top: top }}
    >
      {year}
    </h1>
  );
}

function Month({ month, top, isHighlighted }: { month: string; top: number; isHighlighted?: boolean }) {
  return (
    <h1
      className={`absolute text-sm flex items-center font-bold h-8 left-4 transition-colors duration-300 ${
        isHighlighted ? 'text-blue-400' : 'text-zinc-500'
      }`}
      style={{ top: top }}
    >
      {month}
    </h1>
  );
}
