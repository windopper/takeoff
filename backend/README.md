# Takeoff Backend
해당 레포지토리는 Takeoff의 백엔드입니다.

## 개요
1시간마다 기술 커뮤니티의 인기글을 크롤링 후 생성형 AI를 통해 글 작성 후 DB에 업로드.

커뮤니티 목록은 다음과 같음.
- https://news.ycombinator.com/
- https://www.reddit.com/r/singularity/

## 주요 기능

### 1. 게시글 파싱
- RSS 피드를 통해 인기 게시글을 자동으로 수집

### 2. AI 기반 게시글 정리
- **LangChain**과 **Google Gemini 2.5 Flash Preview**를 사용하여 HackerNews 게시글의 원본 아티클을 한국어로 정리
- 원본 게시글의 핵심 내용을 요약하고 구조화
- 기술 용어의 한국어 번역 및 설명 추가
- 마크다운 형식으로 읽기 쉽게 포맷팅

### 3. 중복 게시글 방지
- 원본 URL을 기준으로 이미 처리된 게시글인지 확인
- 중복 게시글은 자동으로 건너뛰어 데이터베이스 효율성 유지

### 4. 자동화된 스케줄링
- Cloudflare Workers의 Cron Trigger를 사용하여 매시간 자동 실행
- 백그라운드에서 안정적으로 게시글 수집 및 처리

## 환경 설정

### Gemini API 키 설정

#### 1. Google AI Studio에서 API 키 발급
1. [Google AI Studio](https://aistudio.google.com/app/apikey)에 접속
2. 로그인 후 "Create API key" 클릭
3. 프로젝트 선택 후 API 키 생성
4. 생성된 API 키를 복사하여 보관

#### 2. wrangler.jsonc 파일에 API 키 설정
`.dev.vars` 파일에서 `GEMINI_API_KEY` 값을 업데이트하세요:
```yaml
GEMINI_API_KEY="여기에 실제 API키를 입력하세요"
TAKEOFF_API_KEY="여기에 실제 API키를 입력하세요"
```

#### 3. 보안이 중요한 프로덕션 환경에서는 Cloudflare Workers 시크릿 사용
```bash
# Gemini API 키를 시크릿으로 설정 (권장)
wrangler secret put GEMINI_API_KEY
```

### 사용 가능한 모델
- 기본 모델: `gemini-2.5-flash-preview-05-20`
- 기타 지원 모델: `gemini-pro`, `gemini-pro-vision` 등

## 기술 스택
- **Runtime**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **ORM**: Drizzle ORM
- **AI Framework**: LangChain
- **AI Model**: Google Gemini 2.5 Flash Preview
- **Language**: TypeScript
- **Testing**: Vitest

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

스키마 파일(`schema.ts`)을 수정 후 `npm run db:generate`로 마이그레이션 파일 생성 후 다음 명령어로 데이터베이스에 적용:

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