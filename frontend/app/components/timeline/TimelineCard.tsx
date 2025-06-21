import Link from "next/link";

interface TimelineCardProps {
    title: string;
    description: string;
    link: string;
    date: string;
    isFocused?: boolean;
}

export default function TimelineCard({ title, description, link, date, isFocused = false }: TimelineCardProps) {
    return (
      <div className={`w-xl h-32 rounded-lg shadow-md p-4 backdrop-blur-2xl border transition-all duration-300 ${
        isFocused 
          ? 'dark:bg-zinc-800/80 border-zinc-400 dark:border-zinc-500 shadow-zinc-400/20 shadow-lg scale-105' 
          : 'dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800'
      }`}>
        <p className="text-sm text-zinc-500">{date}</p>
        <Link href={link} target="_blank" rel="noopener noreferrer">
          <h1 className="text-lg font-bold">{title}</h1>
        </Link>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>
    );
}