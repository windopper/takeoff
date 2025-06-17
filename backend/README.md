# Takeoff Backend
해당 레포지토리는 Takeoff의 백엔드입니다.

## 개요
1시간마다 서브레딧을 Top 게시글을 읽은 후 생성형 AI를 통해 글을 작성 후 DB에 업로드.

서브레딧 목록은 다음과 같음.
- LocalLLaMA, singularity

## 주요 기능

### 1. Reddit 게시글 파싱
- Reddit RSS 피드를 통해 서브레딧의 인기 게시글을 자동으로 수집
- 지원 서브레딧: LocalLLaMA, singularity
- 각 서브레딧당 최대 5개의 게시글을 처리

### 2. AI 기반 게시글 정리
- **LangChain**과 **Google Gemini 2.5 Flash Preview**를 사용하여 Reddit 게시글을 한국어로 정리
- 원본 게시글의 핵심 내용을 요약하고 구조화
- 기술 용어의 한국어 번역 및 설명 추가
- 마크다운 형식으로 읽기 쉽게 포맷팅

### 3. 중복 게시글 방지
- 원본 URL을 기준으로 이미 처리된 게시글인지 확인
- 중복 게시글은 자동으로 건너뛰어 데이터베이스 효율성 유지

### 4. 자동화된 스케줄링
- Cloudflare Workers의 Cron Trigger를 사용하여 매시간 자동 실행
- 백그라운드에서 안정적으로 게시글 수집 및 처리

## API 엔드포인트

### GET /api/reddit
Reddit에서 파싱한 원본 게시글 목록을 반환합니다.
```json
[
  {
    "subreddit": "LocalLLaMA",
    "posts": [
      {
        "title": "원본 게시글 제목",
        "link": "https://reddit.com/...",
        "author": "reddit_user",
        "pubDate": "2024-01-01",
        "description": "게시글 내용",
        "category": "Technology"
      }
    ]
  }
]
```

### GET /api/posts
AI로 처리된 게시글 목록을 조회합니다.

**쿼리 파라미터:**
- `limit`: 조회할 게시글 수 (기본값: 10)
- `offset`: 페이지네이션 오프셋 (기본값: 0)
- `subreddit`: 특정 서브레딧 필터링 (선택사항)

**응답 예시:**
```json
{
  "posts": [
    {
      "id": 1,
      "title": "AI가 정리한 한국어 제목",
      "content": "마크다운으로 정리된 내용...",
      "author": "AI Assistant",
      "created_at": "2024-01-01T00:00:00Z",
      "original_url": "https://reddit.com/...",
      "category": "Technology",
      "subreddit": "LocalLLaMA",
      "original_title": "Original Reddit Title",
      "original_author": "reddit_user"
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "subreddit": null
  }
}
```

### POST /api/process-reddit
Reddit 게시글을 수동으로 처리하고 데이터베이스에 저장합니다.

**응답 예시:**
```json
{
  "success": true,
  "results": [
    {
      "subreddit": "LocalLLaMA",
      "processed": 3,
      "saved": 2,
      "skipped": 1,
      "filterStats": {
        "total": 10,
        "alreadyFiltered": 2,
        "scoreFiltered": 3,
        "aiFiltered": 2,
        "processed": 3
      }
    }
  ],
  "message": "Reddit 게시글 처리 및 저장 완료"
}
```

### GET /api/filtered-posts
저장된 필터링 기록의 통계 정보를 조회합니다.

**쿼리 파라미터:**
- `subreddit`: 특정 서브레딧 필터링 (선택사항)

**응답 예시:**
```json
{
  "success": true,
  "filterStats": [
    {
      "subreddit": "LocalLLaMA",
      "filter_type": "score",
      "filtered_count": 15,
      "avg_confidence": null,
      "latest_filtered": "2024-01-01T12:00:00Z"
    },
    {
      "subreddit": "LocalLLaMA", 
      "filter_type": "ai_relevance",
      "filtered_count": 8,
      "avg_confidence": 0.35,
      "latest_filtered": "2024-01-01T11:30:00Z"
    }
  ],
  "cleanedExpiredRecords": 3,
  "message": "필터링 통계 조회 완료"
}
```

### GET /api/filter-stats
실시간 필터링 테스트 및 통계 대시보드를 제공합니다.

**쿼리 파라미터:**
- `minScore`: 최소 추천 수 기준 (기본값: 100)

**응답 예시:**
```json
{
  "success": true,
  "filterSettings": {
    "minScore": 100,
    "aiConfidenceThreshold": 0.6
  },
  "totalStatistics": {
    "totalPosts": 20,
    "scoreFiltered": 8,
    "aiFiltered": 5,
    "passed": 7,
    "passRate": "35.0%"
  },
  "subredditBreakdown": [
    {
      "subreddit": "LocalLLaMA",
      "totalPosts": 10,
      "scoreFiltered": 4,
      "aiFiltered": 3,
      "passed": 3,
      "passRate": "30.0%"
    }
  ]
}
```

## 환경 설정

### Gemini API 키 설정

#### 1. Google AI Studio에서 API 키 발급
1. [Google AI Studio](https://aistudio.google.com/app/apikey)에 접속
2. 로그인 후 "Create API key" 클릭
3. 프로젝트 선택 후 API 키 생성
4. 생성된 API 키를 복사하여 보관

#### 2. wrangler.jsonc 파일에 API 키 설정
`wrangler.jsonc` 파일에서 `GEMINI_API_KEY` 값을 업데이트하세요:
```json
{
  "vars": { 
    "GEMINI_API_KEY": "여기에_실제_API_키를_입력하세요"
  }
}
```

#### 3. 보안이 중요한 프로덕션 환경에서는 Cloudflare Workers 시크릿 사용
```bash
# Gemini API 키를 시크릿으로 설정 (권장)
wrangler secret put GEMINI_API_KEY

# 설정 후 wrangler.jsonc에서 vars 섹션 제거하고 아래와 같이 수정:
# "vars": {},
```

### 사용 가능한 모델
- 기본 모델: `gemini-2.5-flash-preview-05-20`
- 기타 지원 모델: `gemini-pro`, `gemini-pro-vision` 등

### 환경 변수 옵션
- `GEMINI_API_KEY`: Google Gemini API 키 (필수)
- `GEMINI_MODEL`: 사용할 모델명 (선택사항, 기본값: gemini-2.5-flash-preview-05-20)
- `AI_TEMPERATURE`: AI 응답의 창의성 수준 (선택사항, 기본값: 0.7)

## 기술 스택
- **Runtime**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **AI Framework**: LangChain
- **AI Model**: Google Gemini 2.5 Flash Preview
- **Language**: TypeScript
- **Testing**: Jest

## 데이터 베이스 스키마

### ai_posts 테이블
AI로 작성한 글을 저장하는 메인 테이블입니다.

| 필드명 | 타입 | 설명 |
|--------|------|------|
| id | INTEGER PRIMARY KEY | 자동 증가하는 고유 ID |
| title | TEXT NOT NULL | AI가 생성한 글의 제목 |
| content | TEXT NOT NULL | AI가 생성한 글의 내용 |
| author | TEXT NOT NULL | AI 작성자 정보 |
| created_at | DATETIME | 글 생성 날짜 (기본값: 현재 시간) |
| original_url | TEXT | 원본 Reddit 게시글 URL |
| category | TEXT NOT NULL | 글의 카테고리 |
| subreddit | TEXT NOT NULL | 원본 서브레딧 이름 |
| original_title | TEXT | 원본 Reddit 게시글 제목 |
| original_author | TEXT | 원본 Reddit 게시글 작성자 |
| post_score | INTEGER | 원본 게시글의 점수 |
| updated_at | DATETIME | 마지막 수정 날짜 |

### 인덱스
- `idx_ai_posts_category`: 카테고리별 검색 최적화
- `idx_ai_posts_subreddit`: 서브레딧별 검색 최적화
- `idx_ai_posts_created_at`: 날짜별 검색 최적화

### 뷰
- `ai_posts_stats`: 카테고리 및 서브레딧별 통계 정보

### ai_filtered 테이블
AI에 의해 필터링되어 포스팅을 작성할 수 없는 것으로 판정된 게시글을 저장하는 테이블입니다. 최대 14일간 저장되며, 중복 처리를 방지합니다.

| 필드명 | 타입 | 설명 |
|--------|------|------|
| id | INTEGER PRIMARY KEY | 자동 증가하는 고유 ID |
| original_url | TEXT NOT NULL UNIQUE | 원본 Reddit 게시글 URL (중복 방지) |
| original_title | TEXT NOT NULL | 원본 게시글 제목 |
| subreddit | TEXT NOT NULL | 서브레딧 이름 |
| filter_reason | TEXT NOT NULL | 필터링된 이유 |
| filter_type | TEXT NOT NULL | 필터 타입 ('score', 'ai_relevance', 'keyword') |
| confidence | REAL | AI 필터의 신뢰도 (0.0-1.0) |
| post_score | INTEGER | 원본 게시글의 추천 수 |
| filtered_at | DATETIME | 필터링된 날짜 (기본값: 현재 시간) |
| expires_at | DATETIME NOT NULL | 만료 날짜 (14일 후) |

### 필터링 시스템 동작 방식

1. **기존 필터링 확인**: 처리 전에 해당 URL이 이미 필터링되었는지 확인
2. **점수 필터**: 추천 수가 최소 기준 미달시 `filter_type='score'`로 저장
3. **AI 관련성 필터**: AI가 관련성 없음으로 판단시 `filter_type='ai_relevance'`로 저장
4. **자동 정리**: 14일이 지난 필터링 기록은 자동으로 삭제
5. **통계 제공**: 서브레딧별, 필터 타입별 통계 정보 제공


## 데이터베이스 설정 및 스키마 관리

### 1. 데이터베이스 초기 설정

#### 로컬 개발 환경
```bash
# 로컬 D1 데이터베이스에 스키마 적용
npm run db:local-init

# 로컬 데이터베이스 테이블 확인
npm run db:local-shell
```

#### 프로덕션 환경
```bash
# 프로덕션 D1 데이터베이스에 스키마 적용
npm run db:init

# 프로덕션 데이터베이스 테이블 확인
npm run db:shell
```

### 2. 스키마 업데이트

스키마 파일(`schema.sql`)을 수정하거나 `migrations/` 폴더의 마이그레이션 파일을 생성한 후 다음 명령어로 데이터베이스에 적용:

#### 로컬 환경에서 스키마 업데이트
```bash
# 로컬 데이터베이스에 스키마 변경사항 적용
npm run db:local-migrate
```

#### 프로덕션 환경에서 스키마 업데이트
```bash
# 프로덕션 데이터베이스에 스키마 변경사항 적용
npm run db:migrate
```

### 3. 수동 데이터베이스 명령 실행

특정 SQL 명령을 직접 실행하려면 wrangler CLI를 사용:

```bash
# 로컬 환경에서 SQL 명령 실행
wrangler d1 execute takeoff --local --command="SELECT COUNT(*) FROM ai_posts;"

# 프로덕션 환경에서 SQL 명령 실행
wrangler d1 execute takeoff --command="SELECT COUNT(*) FROM ai_posts;"

# SQL 파일 실행
wrangler d1 execute takeoff --file=./custom-migration.sql

# 특정 마이그레이션 파일 실행
wrangler d1 execute takeoff --local --file=./migrations/001_initial_schema.sql
```

### 4. 데이터베이스 백업 및 복원

#### 데이터 내보내기
```bash
# 테이블 데이터를 SQL 형태로 내보내기
wrangler d1 export takeoff --output=backup.sql

# 로컬 데이터베이스에서 내보내기
wrangler d1 export takeoff --local --output=local-backup.sql
```

#### 데이터 가져오기
```bash
# 백업 파일에서 데이터 복원
wrangler d1 execute takeoff --file=./backup.sql
```

### 5. 데이터베이스 정보 확인

```bash
# 데이터베이스 목록 확인
wrangler d1 list

# 특정 데이터베이스 정보 확인
wrangler d1 info takeoff
```

## 개발 및 배포

### 로컬 개발
```bash
# 의존성 설치
npm install

# 로컬 D1 데이터베이스 초기화 (최초 1회)
npm run db:local-init

# 로컬 개발 서버 실행
npm run dev

# 테스트 실행
npm test
```

### 배포
```bash
# 프로덕션 D1 데이터베이스 초기화 (최초 1회)
npm run db:init

# Cloudflare Workers에 배포
npm run deploy
```

## AI 프롬프트 전략
AI는 다음 지침에 따라 Reddit 게시글을 정리합니다:

1. **제목 번역**: 원본 의미를 유지하면서 한국어로 자연스럽게 번역
2. **내용 요약**: 핵심 내용을 간결하고 이해하기 쉽게 정리
3. **기술 용어**: 한국어 번역과 함께 필요시 영어 원문 병기
4. **구조화**: 마크다운을 사용하여 읽기 쉽게 포맷팅
5. **출처 명시**: 원본 링크와 작성자 정보 포함