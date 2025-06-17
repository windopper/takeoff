-- AI로 작성한 글을 저장하는 테이블
DROP TABLE IF EXISTS ai_posts;
DROP TABLE IF EXISTS ai_filtered;

CREATE TABLE IF NOT EXISTS ai_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    original_url TEXT,
    category TEXT NOT NULL,
    platform TEXT NOT NULL, -- 'reddit', 'hackernews', 'medium' 등
    community TEXT NOT NULL, -- subreddit 이름 또는 hackernews 등
    original_title TEXT,
    original_author TEXT,
    post_score INTEGER,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- AI 필터로 걸러진 게시글을 저장하는 테이블
CREATE TABLE IF NOT EXISTS ai_filtered (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_url TEXT NOT NULL UNIQUE,
    original_title TEXT NOT NULL,
    platform TEXT NOT NULL, -- 'reddit', 'hackernews', 'medium' 등
    community TEXT NOT NULL, -- subreddit 이름 또는 hackernews 등
    filter_reason TEXT NOT NULL,
    filter_type TEXT NOT NULL, -- 'score', 'ai_relevance', 'keyword' 등
    confidence REAL, -- AI 필터의 신뢰도 (0.0-1.0)
    post_score INTEGER,
    filtered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL -- 14일 후 자동 만료
);

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_ai_posts_category ON ai_posts(category);
CREATE INDEX IF NOT EXISTS idx_ai_posts_platform ON ai_posts(platform);
CREATE INDEX IF NOT EXISTS idx_ai_posts_community ON ai_posts(community);
CREATE INDEX IF NOT EXISTS idx_ai_posts_platform_community ON ai_posts(platform, community);
CREATE INDEX IF NOT EXISTS idx_ai_posts_created_at ON ai_posts(created_at);

-- 필터링 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_ai_filtered_url ON ai_filtered(original_url);
CREATE INDEX IF NOT EXISTS idx_ai_filtered_platform ON ai_filtered(platform);
CREATE INDEX IF NOT EXISTS idx_ai_filtered_community ON ai_filtered(community);
CREATE INDEX IF NOT EXISTS idx_ai_filtered_platform_community ON ai_filtered(platform, community);
CREATE INDEX IF NOT EXISTS idx_ai_filtered_expires ON ai_filtered(expires_at);
CREATE INDEX IF NOT EXISTS idx_ai_filtered_type ON ai_filtered(filter_type);

-- 카테고리별 통계를 위한 뷰 (선택사항)
CREATE VIEW IF NOT EXISTS ai_posts_stats AS
SELECT 
    category,
    platform,
    community,
    COUNT(*) as post_count,
    MAX(created_at) as latest_post,
    MIN(created_at) as first_post
FROM ai_posts 
GROUP BY category, platform, community;

-- 필터링 통계를 위한 뷰
CREATE VIEW IF NOT EXISTS ai_filter_stats AS
SELECT 
    platform,
    community,
    filter_type,
    COUNT(*) as filtered_count,
    AVG(confidence) as avg_confidence,
    MAX(filtered_at) as latest_filtered,
    MIN(filtered_at) as first_filtered
FROM ai_filtered 
WHERE expires_at > CURRENT_TIMESTAMP
GROUP BY platform, community, filter_type;

-- 14일 지난 필터링 기록을 자동으로 정리하는 트리거
CREATE TRIGGER IF NOT EXISTS cleanup_expired_filters
    AFTER INSERT ON ai_filtered
    BEGIN
        DELETE FROM ai_filtered WHERE expires_at <= CURRENT_TIMESTAMP;
    END;