'use client';

import { useState, useEffect } from 'react';
import { getTakeoffPosts, getTakeoffPostCount, deleteTakeoffPostById } from '../../action/takeoffPosts';
import { Post } from '@/app/types/post';

export default function PostsPanel() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const POSTS_PER_PAGE = 10;

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const [postsResult, countResult] = await Promise.all([
        getTakeoffPosts({
          limit: POSTS_PER_PAGE,
          offset: (currentPage - 1) * POSTS_PER_PAGE,
          query: searchQuery,
          category: selectedCategory,
        }),
        getTakeoffPostCount({
          query: searchQuery,
          category: selectedCategory,
        }),
      ]);
      
      setPosts(postsResult.posts || []);
      setTotalCount(countResult.count || 0);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('정말로 이 포스트를 삭제하시겠습니까?')) return;
    
    setIsDeleting(id);
    try {
      await deleteTakeoffPostById(id);
      await loadPosts();
    } catch (error) {
      console.error('Failed to delete post:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadPosts();
  };

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  useEffect(() => {
    loadPosts();
  }, [currentPage]);

  return (
    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">포스트 관리</h2>
      
      {/* 검색 및 필터 */}
      <div className="space-y-4 mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="제목 또는 내용 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
          >
            <option value="">모든 카테고리</option>
            <option value="hackernews">HackerNews</option>
            <option value="reddit">Reddit</option>
            <option value="arxiv">ArXiv</option>
          </select>
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-4 py-2 bg-zinc-900 dark:bg-zinc-600 text-white text-sm font-medium rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-500 disabled:bg-zinc-400 dark:disabled:bg-zinc-500 disabled:cursor-not-allowed transition-colors"
          >
            검색
          </button>
        </div>
        
        <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
          <span>총 {totalCount}개 포스트</span>
          <button
            onClick={loadPosts}
            disabled={isLoading}
            className="px-3 py-1 text-xs bg-zinc-200 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-500 disabled:opacity-50 transition-colors"
          >
            {isLoading ? '로딩 중...' : '새로고침'}
          </button>
        </div>
      </div>

      {/* 포스트 목록 */}
      {isLoading ? (
        <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">로딩 중...</div>
      ) : posts.length === 0 ? (
        <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">포스트가 없습니다.</div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-4 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 mb-2 line-clamp-3">
                    {post.content}
                  </p>
                  <a
                    href={post.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 underline truncate block"
                  >
                    {post.originalUrl}
                  </a>
                </div>
                <button
                  onClick={() => handleDeletePost(post.id.toString())}
                  disabled={isDeleting === post.id.toString()}
                  className="ml-3 px-3 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-50 transition-colors"
                >
                  {isDeleting === post.id.toString() ? '삭제 중...' : '삭제'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm bg-zinc-200 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            이전
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    currentPage === pageNum
                      ? 'bg-zinc-900 dark:bg-zinc-600 text-white'
                      : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm bg-zinc-200 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
} 