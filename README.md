<h1 align="center" style="border-bottom: none">
    <div>
        <a style="color:#36f" href="https://ai-takeoff.dev">
            <img src="/frontend/app/favicon.ico" width="80">
            <br>
            Takeoff.
        </a>
    </div>
</h1>

<p align='center'>
Takeoff는 AI 관련 아티클을 자동으로 정리 및 게시하는 서비스입니다
<p>

![Vercel Deploy](https://deploy-badge.vercel.app/vercel/takeoff)

## 주요 기능
- Hackernews/Reddit에서 인기있는 글에 대한 정리
- [2015-2025년 인공지능 타임라인](https://ai-takeoff.dev/timeline)
- [LLM 벤치마크](https://ai-takeoff.dev/benchmarking)
- Discord Webhook으로 새로운 글 업로드마다 실시간 알림

### 인공지능 타임라인
[인공지능 타임라인 바로가기](https://ai-takeoff.dev/timeline)

2015년부터 2025년까지 인공지능의 기술, 정책, 문화 등 다양한 분야에서 일어난 일들을 타임라인으로 정리

### LLM 벤치마크
[LLM 벤치마크 바로가기](https://ai-takeoff.dev/benchmarking)

GPQA, Frontier Math등 13종의 벤치마크 결과를 정리

### 디스코드 웹훅 등록
[웹훅 등록하기](https://ai-takeoff.dev/webhook)

Takeoff에서 새로운 글이 업로드될 때 디스코드 채널로 실시간 알림을 받을 수 있습니다.

### 주간 뉴스
[주간 뉴스 바로가기](https://ai-takeoff.dev/weeklynews)

AI가 일주일에 한 번 주간 뉴스를 정리하여 게시

## 로드맵
- [x] 유사 아티클이 이미 존재할 시 게시하지 않는 기능
- [x] AI 타임라인 페이지
- [x] 인공지능 벤치마크
    - [x] visx 그래프 작성 (scatter, boxplot)
    - [x] 벤치마크 데이터 별 필터 기능 적용
    - [x] 벤치마크 테이블 추가
    - [x] 벤치마크 별 설명 페이지 작성
- [x] 주간 뉴스 블로그
- [ ] 인공지능 모델 특징 및 비교 페이지
- [ ] Arxiv 논문 정리

## 기술 스택
### Frontend
<img src="https://img.shields.io/badge/nextjs-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" style="border-radius:10px"> <img src="https://img.shields.io/badge/vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" style="border-radius:10px"> <img src="https://img.shields.io/badge/visx-FF1231?style=for-the-badge&logo=visx&logoColor=white" style="border-radius:10px"> <img src="https://img.shields.io/badge/d3-F9A03C?style=for-the-badge&logo=d3&logoColor=white" style="border-radius:10px">

### Backend
<img src="https://img.shields.io/badge/langchain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white" style="border-radius:10px"> <img src="https://img.shields.io/badge/sqlite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" style="border-radius:10px"> <img src="https://img.shields.io/badge/cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" style="border-radius:10px"> <img src="https://img.shields.io/badge/drizzleorm-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black" style="border-radius:10px"> <img src="https://img.shields.io/badge/vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" style="border-radius:10px">