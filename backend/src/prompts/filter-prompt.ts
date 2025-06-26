export interface FilterPromptParams {
  title: string;
  description: string;
}

export function generateFilterPrompt({ title, description }: FilterPromptParams): string {
  return `다음 게시글이 새로운 AI, LLM 모델 또는 AI/LLM을 활용한 소프트웨어에 관한 내용인지 판단해주세요.

제목: ${title}
내용: ${description}

판단 기준:
1. 새로운 AI/LLM 모델 출시 (GPT, Claude, Gemini, Llama 등)
2. AI/LLM 관련 연구 논문이나 학술 연구 발표
3. AI/LLM을 활용한 새로운 도구, 프레임워크, 라이브러리 출시
4. AI/LLM 기술의 혁신적인 발전이나 돌파구
5. AI/LLM을 활용한 새로운 소프트웨어, 앱, 서비스 런칭
6. AI/LLM 업계의 주요 발표나 업데이트

다음 중 하나에 해당하면 관련성이 높다고 판단:
- AI/ML 관련 arXiv, Nature, Science 등의 논문 링크
- AI/LLM 모델을 활용한 GitHub 새 릴리스나 새 프로젝트
- OpenAI, Anthropic, Google, Meta 등 AI 회사의 공식 발표
- 새로운 언어 모델이나 멀티모달 모델 출시
- AI 에이전트, AI 코딩 도구, AI 생성형 서비스
- ChatGPT, Claude, Copilot 등 AI 제품의 새로운 기능

관련성이 낮은 것들:
- AI와 관련 없는 일반적인 소프트웨어나 기술
- 단순한 업계 뉴스나 인사 소식
- AI가 아닌 다른 분야의 연구나 기술

응답 형식 (JSON):
{
  "reason": "판단 이유를 한 문장으로",
  "confidence": 0.0-1.0 (1에 가까울 수록 AI/LLM 관련성이 높다고 판단)
}`;
} 