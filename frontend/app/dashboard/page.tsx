import AuthGuard from '../components/dashboard/AuthGuard';
import ThemeToggle from '../components/dashboard/ThemeToggle';
import ProcessingPanel from '../components/dashboard/ProcessingPanel';
import WebhookPanel from '../components/dashboard/WebhookPanel';
import PostsPanel from '../components/dashboard/PostsPanel';

export default function DashboardPage() {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* 헤더 */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">대시보드</h1>
                                <p className="text-zinc-600 dark:text-zinc-400 mt-2">Takeoff 백엔드 서비스 관리</p>
                            </div>
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* 그리드 레이아웃 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* 콘텐츠 처리 패널 */}
                        <div className="lg:col-span-1">
                            <ProcessingPanel />
                        </div>

                        {/* 웹훅 관리 패널 */}
                        <div className="lg:col-span-1">
                            <WebhookPanel />
                        </div>

                        {/* 포스트 관리 패널 - 전체 너비 */}
                        <div className="lg:col-span-2">
                            <PostsPanel />
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    )
}