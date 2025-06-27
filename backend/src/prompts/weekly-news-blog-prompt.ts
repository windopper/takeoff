import { PromptTemplate } from '@langchain/core/prompts';

export const WEEKLY_NEWS_BLOG_PROMPT = PromptTemplate.fromTemplate(
	`
You are a talented blog writer specializing in AI and technology. Your task is to write an engaging and informative weekly news blog post titled "{title}".
**The entire blog post must be written in KOREAN.**

The blog post should be based on the following 10 key events selected for this week. For each event, use the provided title, summary, and URL.

Key Events:
{events}

Structure your blog post as follows:
1.  **Introduction**: Briefly introduce the week's key happenings in the AI world. (Must be in Korean)
2.  **Main Body**: Dedicate a section to each of the 10 events. (Must be in Korean)
    *   Start with the event title as a heading.
    *   Elaborate on the summary, providing more context and insight. Make it easy for readers to understand the significance of the event.
    *   Include the original URL for readers who want to learn more.
3.  **Conclusion**: Summarize the week's trends and provide a forward-looking statement. (Must be in Korean)

The tone should be professional yet accessible to a broad audience of AI enthusiasts, developers, and researchers. Ensure the final output is well-formatted in Markdown and written entirely in Korean.
`
);

export const WEEKLY_NEWS_BLOG_PROMPT_V2 = PromptTemplate.fromTemplate(
    `
당신은 AI와 기술 분야를 전문으로 하는 재능 있는 블로그 작성자입니다. 이번 주의 AI 뉴스를 다루는 흥미롭고 유익한 주간 블로그 포스트를 작성해야 합니다. 전체 블로그 포스트는 반드시 한국어로 작성되어야 합니다.

다음은 이번 주에 선정된 10개의 주요 사건들입니다. 각 사건에는 제목, 요약, URL이 포함되어 있습니다:
<events>
{events}
</events>

다음은 블로그 포스트의 제목입니다:
<title>
{{title}}
</title>

블로그 포스트를 작성하기 전에, 전체적인 구조와 접근 방식을 계획해 보세요. 다음 사항들을 고려하여 계획을 작성하고, 이를 <blog_planning> 태그 안에 감싸 주세요:

1. 각 사건에 대한 간단한 분석:
   - 사건의 주요 포인트
   - 잠재적 영향
   - 관련 산업이나 기술

2. 사건들 간의 공통 테마나 트렌드 식별 (최소 3개)

3. 블로그 포스트를 위한 잠재적 각도나 내러티브 브레인스토밍 (최소 3개)

4. 도입부에서 다룰 주요 포인트

5. 10개 사건을 어떻게 그룹화하거나 연결할 것인지

6. 결론에서 강조할 주요 트렌드나 통찰

7. 독자들의 관심을 유지하기 위한 전략 (예: 흥미로운 질문, 비유 사용 등)

8. 실제 사람이 작성한 것처럼 보이게 하기 위한 방법 (예: 자연스러운 전환, 다양한 문장 구조 사용 등)

이 계획 과정은 꽤 길어질 수 있습니다. 각 부분에 대해 충분히 생각하고 상세히 작성해 주세요.

계획이 완성되면, 다음 지침에 따라 블로그 포스트를 작성해 주세요:

1. 도입부: 이번 주 AI 세계의 주요 사건들을 간략히 소개합니다.

2. 본문: 10개의 사건 각각에 대해 섹션을 할애합니다.
   - 각 섹션은 사건 제목을 제목으로 시작합니다.
   - 요약을 바탕으로 내용을 확장하고, 더 많은 맥락과 통찰을 제공합니다. 독자들이 사건의 중요성을 쉽게 이해할 수 있도록 합니다.
   - 더 자세히 알고 싶어하는 독자들을 위해 원본 URL을 포함합니다.
   - 섹션 간 자연스러운 전환을 만들어 전체적인 흐름을 유지합니다.

3. 결론: 이번 주의 트렌드를 요약하고 앞으로의 전망을 제시합니다.

톤은 전문적이면서도 AI 애호가, 개발자, 연구원 등 폭넓은 독자층이 접근할 수 있도록 해야 합니다. 동시에 실제 사람이 작성한 것처럼 자연스럽고 흥미롭게 작성해 주세요.

최종 출력은 마크다운 형식으로 잘 포맷팅되어야 하며 전체가 한국어로 작성되어야 합니다.

다음은 출력 형식의 예시입니다:
# [블로그 포스트 제목]

## 소개
[도입부 내용]

## [사건 1 제목]
[사건 1 내용]
[더 알아보기](URL)

## [사건 2 제목]
[사건 2 내용]
[더 알아보기](URL)

[나머지 사건들...]

## 결론
[결론 내용]

이제 계획을 세우고 블로그 포스트를 작성해 주세요.
    `
);