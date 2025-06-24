export type Benchmark =
  | "aider-polyglot"
  | "fiction-live-bench"
  | "vpct"
  | "gpqa-diamond"
  | "frontier-math"
  | "math-level-5"
  | "otis-mock-aime"
  | "swe-bench-verified"
  | "weird-ml"
  | "balrog"
  | "factorio"
  | "geo-bench"
  | "simple-bench";

export const benchmarkDisplayNames: Record<Benchmark, string> = {
  "aider-polyglot": "Aider Polyglot",
  "fiction-live-bench": "Fiction.LiveBench",
  vpct: "VPCT",
  "gpqa-diamond": "GPQA Diamond",
  "frontier-math": "Frontier Math",
  "math-level-5": "Math Level 5",
  "otis-mock-aime": "OTIS Mock AIME",
  "swe-bench-verified": "SWE Bench Verified",
  "weird-ml": "WeirdML",
  balrog: "Balrog",
  factorio: "Factorio",
  "geo-bench": "GeoBench",
  "simple-bench": "SimpleBench",
};

export const descriptions: Record<Benchmark, { md: string }> = {
  "simple-bench": {
    md: `[SimpleBench](https://simple-bench.com/)는 고등학교 수준의 일반인이 최첨단 AI 모델보다 더 좋은 성과를 내는 LLM 벤치마크입니다. 
    200개 이상의 다중선택 문제로 구성되어 있으며, 시공간 추론, 사회적 지능, 그리고 함정 질문에 대한 저항력을 측정합니다.

더 많은 정보와 퍼블릭 예제는 [SimpleBench](https://simple-bench.com/)를 참고하세요.
    `,
  },
  "fiction-live-bench": {
    md: `[Fiction.LiveBench](https://fiction.live/stories/Fiction-liveBench-Mar-25-2025/oQdzQvKHw8JyXbN87)는 최초의 실제 세계 장문 컨텍스트 벤치마크로, 
LLM이 복잡하고 긴 소설 텍스트를 얼마나 잘 이해하고 처리할 수 있는지를 평가하는 도구입니다.
Fiction.LiveBench는 [Fiction.live](https://fiction.live/) 플랫폼에서 개발되었으며, 작가들이 요약, 타임라인, 캐릭터 바이블을 만들고 통찰력 있는 방식으로 해당 문서를 반복함으로써 시간을 절약할 수 있도록 돕는 AI 도구를 위해 만들어졌습니다.

기존의 대부분 LLM들이 수만 개, 심지어 수십만 개의 맥락 토큰을 지원한다고 주장하지만, 실제로는 복잡하고 긴 스토리 콘텐츠를 제대로 처리하지 못한다는 문제를 해결하기 위해 개발되었습니다.
        `,
  },
  "vpct": {
    md: `[VPCT(Visual Physics Comprehension Test)](https://cbrower.dev/vpct)는 비전 모델이 기본 물리학에 대한 예측을 얼마나 잘 수행할 수 있는지 평가하도록 설계된 벤치마크입니다

공과 양동이 물리 시뮬레이션 이미지를 제시하고, AI 모델이 공이 최종적으로 어느 양동이에 떨어질지 예측하도록 요구합니다.
VPCT는 2025년에 Chase Brower에 의해 소개되었으며, 전체 데이터셋은 [Hugging Face](https://huggingface.co/datasets/camelCase12/vpct-1)에서 확인할 수 있습니다.
`
  },
  "aider-polyglot": {
    md: `[Aider Polyglot](https://aider.chat/2024/12/21/polyglot.html#the-polyglot-benchmark) 벤치마크는 LLM과 AI 코딩 에이전트의 실제 코딩 능력을 평가하기 위해 고안된 종합적이고 까다로운 벤치마크입니다.

C++, Go, Java, JavaScript, Python, Rust등 6개의 주요 프로그래밍 언어의 문제를 포함하며, [Exercism](https://exercism.org/) 플랫폼에서 가장 어려운 225개의 코딩 문제를 선별하여,
단순 코드 생성이 아니라 실제 개발 환경에서 필요한 문제 해결력과 코드 통합 능력을 평가합니다.    

공식 결과는 [Aider Polyglot](https://aider.chat/docs/leaderboards/)에서 확인할 수 있습니다.
`
  },
  "gpqa-diamond": {
    md: `
[GPQA](https://arxiv.org/abs/2311.12022)는 LLM의 고급 질문 응답 능력을 평가하기 위해 개발된 벤치마크입니다. 주로 생명과학, 물리학, 화학 등 전문 분야의 대학원 수준 문제로 구성되어 있으며, 단순 검색이나 표면적인 지식만으로는 답변이 어려운, 이른바 "Google-Proof"한 질문들로 이루어져 있습니다.

GPQA는 생명과학, 물리학, 화학 등 자연과학 분야에서 박사급 전문가가 직접 출제한 448개의 객관식 문제로 구성되어 있습니다.
문제는 단순 지식 암기나 웹 검색으로는 풀 수 없도록 설계되어 있으며, 실제로 비전문가가 인터넷을 자유롭게 활용해도 평균 34%의 정답률에 그쳤습니다. 반면, 해당 분야 박사급 전문가도 65% 수준의 정답률을 보였습니다.
    `
  },
  "math-level-5": {
    md: `
    
`
  },
  "balrog": {
    md: `
    
`
  },
  "frontier-math": {
    md: `
    
`
  },
  "otis-mock-aime": {
    md: `
`
  },
  "swe-bench-verified": {
    md: `
`
  },
  "weird-ml": {
    md: `
`
  },
  "factorio": {
    md: `
`
  },
  "geo-bench": {
    md: `
`
  }
};
