import { WeeklyNewsPost } from "@/app/types/weeklynews";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ReturnButton from "../common/ReturnButton";
import WeeklyNewsBackgroundSvg from "./WeeklyNewsBackgroundSvg";
import { getThemeById } from "./utils";

export default function WeeklyNewsViewer({ weeklyNews }: { weeklyNews: WeeklyNewsPost }) {
    const theme = getThemeById(weeklyNews.id);

    return (
        <div className="min-h-screen">
            {/* 헤더 섹션 */}
            <div className="relative w-full pt-8 pb-12 overflow-hidden">
                {/* 배경 그라데이션 효과 */}
                <div className={`absolute inset-0 ${theme.viewerBgGradient}`} />
                
                {/* 뉴스 테마 배경 SVG */}
                <WeeklyNewsBackgroundSvg
                    height={400}
                    className="absolute inset-0 w-full opacity-30"
                />
                
                {/* 배경 장식 요소 */}
                <div className={`absolute top-10 right-10 w-32 h-32 ${theme.viewerDecorPrimary} rounded-full blur-3xl`} />
                <div className={`absolute bottom-5 left-10 w-24 h-24 ${theme.viewerDecorSecondary} rounded-full blur-2xl`} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-lime-400/5 rounded-full blur-3xl" />
                
                {/* 헤더 콘텐츠 */}
                <div className="relative z-10 max-w-4xl mx-auto px-6 mt-12 pt-12">
                    <ReturnButton text="돌아가기" />
                    <div className="mt-8 text-center">
                        <h1 className={`text-3xl md:text-4xl font-bold ${theme.textHover} mb-4 text-shadow-[0_2px_8px_rgba(0,0,0,0.3)]`}>
                            📰 {weeklyNews.title}
                        </h1>
                        <div className={`inline-flex items-center px-4 py-2 ${theme.viewerBadgeBg} rounded-full border ${theme.viewerBorder}`}>
                            <span className={`${theme.viewerDateText} text-sm`}>
                                {new Date(weeklyNews.createdAt).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="relative max-w-6xl mx-auto px-6 pb-16 pt-12">
                {/* 콘텐츠 카드 */}
                <div className="relative backdrop-blur-sm rounded-2xl border border-zinc-700/50 overflow-hidden">
                    {/* 카드 배경 효과 */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${theme.viewerCardBg} via-transparent ${theme.viewerCardTo}`} />
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${theme.viewerTopBorder}`} />
                    
                    {/* 마크다운 콘텐츠 */}
                    <div className="relative z-10 p-8 md:p-12">
                        <div className={`prose prose-lg dark:prose-invert max-w-none
                            prose-headings:${theme.textHover} 
                            prose-p:text-zinc-300 prose-p:leading-relaxed
                            prose-strong:${theme.textPrimary}
                            ${theme.viewerProseA} prose-a:no-underline ${theme.viewerProseAHover} prose-a:break-words prose-a:overflow-wrap-anywhere
                            ${theme.viewerProseCode} prose-code:bg-zinc-800/50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:break-words
                            prose-pre:bg-zinc-800/50 prose-pre:border prose-pre:border-zinc-700/50 prose-pre:overflow-x-auto
                            ${theme.viewerProseBlockquote} ${theme.viewerProseBlockquoteText}
                            prose-li:text-zinc-300
                            prose-hr:border-zinc-700/50
                            break-words overflow-wrap-anywhere
                        `}>
                            <Markdown remarkPlugins={[remarkGfm]}>{weeklyNews.content}</Markdown>
                        </div>
                    </div>
                </div>

                {/* 하단 장식 요소 */}
                {/* <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-400/5 rounded-full blur-2xl" />
                <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-green-400/5 rounded-full blur-xl" /> */}
            </div>
        </div>
    )
}