export interface FilterPromptParams {
  title: string;
  description: string;
}

export function generateFilterPrompt({ title, description }: FilterPromptParams): string {
  return `다음 Reddit 게시글이 새로운 논문이나 새로운 기술에 관한 내용인지 판단해주세요.

제목: ${title}
내용: ${description}

판단 기준:
1. 새로운 연구 논문이나 학술 연구 발표
2. 새로운 기술, 도구, 프레임워크, 라이브러리 출시
3. 혁신적인 기술 발전이나 돌파구
4. 새로운 소프트웨어, 앱, 서비스 런칭
5. 기술 업계의 주요 발표나 업데이트

다음 중 하나에 해당하면 관련성이 높다고 판단:
- arXiv, Nature, Science 등의 논문 링크
- GitHub 새 릴리스나 새 프로젝트
- 회사의 공식 기술 발표
- 새로운 AI/ML 모델이나 알고리즘
- 새로운 프로그래밍 언어나 도구

응답 형식 (JSON):
{
  "reason": "판단 이유를 한 문장으로",
  "confidence": 0.0-1.0 (1에 가까울 수록 관련성이 높다고 판단)
}`;
} 