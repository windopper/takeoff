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

export const descriptions: Record<Benchmark, { md: string; mdEn: string }> = {
  "simple-bench": {
    md: `[SimpleBench](https://simple-bench.com/)는 고등학교 수준의 일반인이 최첨단 AI 모델보다 더 좋은 성과를 내는 LLM 벤치마크입니다. 
    200개 이상의 다중선택 문제로 구성되어 있으며, 시공간 추론, 사회적 지능, 그리고 함정 질문에 대한 저항력을 측정합니다.

더 많은 정보와 퍼블릭 예제는 [SimpleBench](https://simple-bench.com/)를 참고하세요.
    `,
    mdEn: `[SimpleBench](https://simple-bench.com/) is an LLM benchmark where high school-level humans outperform state-of-the-art AI models. 
    It consists of over 200 multiple-choice questions that measure spatial-temporal reasoning, social intelligence, and resistance to trick questions.

For more information and public examples, see [SimpleBench](https://simple-bench.com/).
    `,
  },
  "fiction-live-bench": {
    md: `[Fiction.LiveBench](https://fiction.live/stories/Fiction-liveBench-Mar-25-2025/oQdzQvKHw8JyXbN87)는 최초의 실제 세계 장문 컨텍스트 벤치마크로, 
LLM이 복잡하고 긴 소설 텍스트를 얼마나 잘 이해하고 처리할 수 있는지를 평가하는 도구입니다.
Fiction.LiveBench는 [Fiction.live](https://fiction.live/) 플랫폼에서 개발되었으며, 작가들이 요약, 타임라인, 캐릭터 바이블을 만들고 통찰력 있는 방식으로 해당 문서를 반복함으로써 시간을 절약할 수 있도록 돕는 AI 도구를 위해 만들어졌습니다.

기존의 대부분 LLM들이 수만 개, 심지어 수십만 개의 맥락 토큰을 지원한다고 주장하지만, 실제로는 복잡하고 긴 스토리 콘텐츠를 제대로 처리하지 못한다는 문제를 해결하기 위해 개발되었습니다.
        `,
    mdEn: `[Fiction.LiveBench](https://fiction.live/stories/Fiction-liveBench-Mar-25-2025/oQdzQvKHw8JyXbN87) is the first real-world long-context benchmark that evaluates how well LLMs can understand and process complex, lengthy fictional texts.
Fiction.LiveBench was developed on the [Fiction.live](https://fiction.live/) platform to create AI tools that help writers save time by creating summaries, timelines, character bibles, and iterating on those documents in insightful ways.

It was developed to address the issue that most existing LLMs claim to support tens of thousands or even hundreds of thousands of context tokens, but in practice fail to properly process complex and lengthy story content.
        `,
  },
  "vpct": {
    md: `[VPCT(Visual Physics Comprehension Test)](https://cbrower.dev/vpct)는 비전 모델이 기본 물리학에 대한 예측을 얼마나 잘 수행할 수 있는지 평가하도록 설계된 벤치마크입니다

공과 양동이 물리 시뮬레이션 이미지를 제시하고, AI 모델이 공이 최종적으로 어느 양동이에 떨어질지 예측하도록 요구합니다.
VPCT는 2025년에 Chase Brower에 의해 소개되었으며, 전체 데이터셋은 [Hugging Face](https://huggingface.co/datasets/camelCase12/vpct-1)에서 확인할 수 있습니다.
`,
    mdEn: `[VPCT (Visual Physics Comprehension Test)](https://cbrower.dev/vpct) is a benchmark designed to evaluate how well vision models can make predictions about basic physics.

It presents images of ball and bucket physics simulations and asks AI models to predict which bucket the ball will ultimately fall into.
VPCT was introduced by Chase Brower in 2025, and the complete dataset can be found on [Hugging Face](https://huggingface.co/datasets/camelCase12/vpct-1).
`,
  },
  "aider-polyglot": {
    md: `[Aider Polyglot](https://aider.chat/2024/12/21/polyglot.html#the-polyglot-benchmark) 벤치마크는 LLM과 AI 코딩 에이전트의 실제 코딩 능력을 평가하기 위해 고안된 종합적이고 까다로운 벤치마크입니다.

C++, Go, Java, JavaScript, Python, Rust등 6개의 주요 프로그래밍 언어의 문제를 포함하며, [Exercism](https://exercism.org/) 플랫폼에서 가장 어려운 225개의 코딩 문제를 선별하여,
단순 코드 생성이 아니라 실제 개발 환경에서 필요한 문제 해결력과 코드 통합 능력을 평가합니다.    

공식 결과는 [Aider Polyglot](https://aider.chat/docs/leaderboards/)에서 확인할 수 있습니다.
`,
    mdEn: `The [Aider Polyglot](https://aider.chat/2024/12/21/polyglot.html#the-polyglot-benchmark) benchmark is a comprehensive and challenging benchmark designed to evaluate the real-world coding capabilities of LLMs and AI coding agents.

It includes problems in six major programming languages: C++, Go, Java, JavaScript, Python, and Rust, selecting the most difficult 225 coding problems from the [Exercism](https://exercism.org/) platform to evaluate not just simple code generation, but the problem-solving and code integration skills needed in real development environments.

Official results can be found at [Aider Polyglot](https://aider.chat/docs/leaderboards/).
`,
  },
  "gpqa-diamond": {
    md: `
[GPQA](https://arxiv.org/abs/2311.12022)는 LLM의 고급 질문 응답 능력을 평가하기 위해 개발된 벤치마크입니다. 주로 생명과학, 물리학, 화학 등 전문 분야의 대학원 수준 문제로 구성되어 있으며, 단순 검색이나 표면적인 지식만으로는 답변이 어려운, 이른바 "Google-Proof"한 질문들로 이루어져 있습니다.

GPQA는 생명과학, 물리학, 화학 등 자연과학 분야에서 박사급 전문가가 직접 출제한 448개의 객관식 문제로 구성되어 있습니다.
문제는 단순 지식 암기나 웹 검색으로는 풀 수 없도록 설계되어 있으며, 실제로 비전문가가 인터넷을 자유롭게 활용해도 평균 34%의 정답률에 그쳤습니다. 반면, 해당 분야 박사급 전문가도 65% 수준의 정답률을 보였습니다.
    `,
    mdEn: `
[GPQA](https://arxiv.org/abs/2311.12022) is a benchmark developed to evaluate the advanced question-answering capabilities of LLMs. It consists primarily of graduate-level problems in specialized fields such as life sciences, physics, and chemistry, composed of so-called "Google-Proof" questions that cannot be answered with simple searches or superficial knowledge.

GPQA consists of 448 multiple-choice questions directly created by PhD-level experts in natural science fields including life sciences, physics, and chemistry.
The questions are designed to be unsolvable through simple knowledge memorization or web searches. In fact, non-experts achieved only an average accuracy of 34% even with free access to the internet, while PhD-level experts in the respective fields achieved around 65% accuracy.
    `,
  },
  "math-level-5": {
    md: `
[Math Level 5](https://arxiv.org/abs/2103.03874)는 LLM의 수학적 추론 능력을 평가하는 도구로 미국 고등학교 수학 경시대회인 AMC 10, AMC 12, AIME
에서 출제된 도전적인 수학 문제들로 구성되어 있습니다.

이 데이터셋은 12500개의 문제로 구성되어 있으며, 각 문제들은 1에서 5사이의 난이도를 가지고 있습니다. Math Level 5는 그 중에서도 1324개의 문제가 포함되어 있으며 데이터셋에서 가장 어려운 문제입니다. 
`,
    mdEn: `
[Math Level 5](https://arxiv.org/abs/2103.03874) is a tool for evaluating the mathematical reasoning capabilities of LLMs, consisting of challenging math problems from American high school math competitions AMC 10, AMC 12, and AIME.

This dataset consists of 12,500 problems, each with a difficulty level between 1 and 5. Math Level 5 contains 1,324 problems and represents the most difficult problems in the dataset.
`,
  },
  "balrog": {
    md: `
[Balrog 벤치마크](https://balrogai.com/)(Benchmarking Agentic LLM and VLM Reasoning On Games)는 복잡하고 동적인 게임 환경에서 에이전트로서 대규모 언어 모델의 능력을 평가합니다. 이는 공간 추론, 체계적인 탐색, 장기적인 일관성 및 계획을 포함하여 실제 작업에 필요한 핵심 역량을 테스트합니다.

Balrog는 난이도가 다양한 여섯 가지 게임 환경을 포함합니다: BabyAI (자연어 지시를 통한 간단한 그리드 월드 탐색), Crafter (마인크래프트에서 영감을 받은 생존 게임), TextWorld (텍스트 기반 어드벤처 게임), Baba Is AI (조작 가능한 규칙이 있는 퍼즐 게임), MiniHack (탐색 및 기술 습득 작업), 그리고 NetHack 학습 환경(매우 도전적인 로그라이크 게임)입니다. 이 환경들은 완료하는 데 수십에서 수천 단계의 상호작용이 필요하며, 비전문가가 몇 초 안에 풀 수 있는 작업부터 인간 전문가가 숙달하는 데 수년이 걸리는 게임까지 다양합니다.

Balrog는 Paglieri 등이 2024년 "[Balrog: Benchmarking Agentic LLM and VLM Reasoning On Games](https://arxiv.org/abs/2411.13543)"를 통해 소개했습니다.
`,
    mdEn: `
The [Balrog benchmark](https://balrogai.com/) (Benchmarking Agentic LLM and VLM Reasoning On Games) evaluates the capabilities of large language models as agents in complex and dynamic gaming environments. It tests key competencies needed for real-world tasks, including spatial reasoning, systematic exploration, long-term consistency, and planning.

Balrog includes six gaming environments of varying difficulty: BabyAI (simple grid world navigation with natural language instructions), Crafter (Minecraft-inspired survival game), TextWorld (text-based adventure game), Baba Is AI (puzzle game with manipulable rules), MiniHack (exploration and skill acquisition tasks), and the NetHack Learning Environment (highly challenging roguelike game). These environments require tens to thousands of interaction steps to complete, ranging from tasks that non-experts can solve in seconds to games that take human experts years to master.

Balrog was introduced by Paglieri et al. in 2024 through "[Balrog: Benchmarking Agentic LLM and VLM Reasoning On Games](https://arxiv.org/abs/2411.13543)".
`,
  },
  "frontier-math": {
    md: `
[FrontierMath](https://epoch.ai/frontiermath)는 전문 수학자들이 직접 만들고 검증한 수백 개의 독창적이고 예외적으로 도전적인 수학 문제 벤치마크입니다. 이 문제들은 수론 및 실해석학의 계산 집약적인 문제부터 대수 기하학 및 범주론의 추상적인 질문에 이르기까지 현대 수학의 주요 분야 대부분을 다룹니다. 일반적인 문제를 해결하는 데에는 해당 수학 분야의 연구자가 여러 시간의 노력을 기울여야 하며, 최상위권 문제의 경우 며칠이 소요됩니다.

전체 FrontierMath 데이터셋은 300개의 문제를 포함합니다. 2025년 3월 4일 현재, 이 중 10개의 문제를 공개했습니다: 이 공개 세트를 frontiermath-2025-02-28-public이라 부르며, 나머지 290개 문제는 frontiermath-2025-02-28-private입니다. 명시적으로 다르게 언급되지 않는 한, 모든 수치는 frontiermath-2025-02-28-private에 대한 평가에 해당합니다. 공개 문제에 대한 자세한 정보는 [여기](https://epoch.ai/frontiermath/benchmark-problems)서 찾을 수 있습니다.
`,
    mdEn: `
[FrontierMath](https://epoch.ai/frontiermath) is a benchmark of hundreds of original and exceptionally challenging mathematical problems created and verified directly by professional mathematicians. These problems cover most major areas of modern mathematics, from computational problems in number theory and real analysis to abstract questions in algebraic geometry and category theory. Typical problems require researchers in the respective mathematical fields to invest several hours of effort, with top-tier problems taking days.

The complete FrontierMath dataset includes 300 problems. As of March 4, 2025, 10 of these problems have been made public: this public set is called frontiermath-2025-02-28-public, while the remaining 290 problems are frontiermath-2025-02-28-private. Unless explicitly stated otherwise, all figures correspond to evaluations on frontiermath-2025-02-28-private. Detailed information about the public problems can be found [here](https://epoch.ai/frontiermath/benchmark-problems).
`,
  },
  "otis-mock-aime": {
    md: `
Mock AIME 2024-2025는 2024년과 2025년 [OTIS Mock AIME](https://web.evanchen.cc/mockaime.html) 문제들을 모아놓은 것입니다. 
이 문제들은 [Olympiad Training for Individual Study (OTIS)](https://web.evanchen.cc/otis.html) 프로그램 학생들이 작성했습니다. OTIS 모의 AIME는 매년 실시되는 3시간 시험으로, 0에서 999 사이의 정수를 답으로 하는 15문제로 구성됩니다.

이 데이터셋은 3개의 시험에서 총 45문제를 포함합니다:
- [Mock AIME 2024](https://web.evanchen.cc/exams/OTIS-Mock-AIME-2024.pdf)에서 15문제 (해설은 [여기](https://web.evanchen.cc/exams/sols-OTIS-Mock-AIME-2024.pdf) 참조)
- [Mock AIME 2025 (I)](https://web.evanchen.cc/exams/OTIS-Mock-AIME-2025-I.pdf)에서 15문제 (해설은 [여기](https://web.evanchen.cc/exams/sols-OTIS-Mock-AIME-2025-I.pdf) 참조)
- [Mock AIME 2025 (II)](https://web.evanchen.cc/exams/OTIS-Mock-AIME-2025-II.pdf)에서 15문제 (해설은 [여기](https://web.evanchen.cc/exams/sols-OTIS-Mock-AIME-2025-II.pdf) 참조)

이 문제들은 MATH Level 5 문제들보다 어렵지만, FrontierMath 문제들보다는 쉽습니다.

이 데이터셋은 Huggingface에서 확인할 수 있습니다: [EpochAI/otis-mock-aime-24-25](https://huggingface.co/datasets/EpochAI/otis-mock-aime-24-25).
`,
    mdEn: `
Mock AIME 2024-2025 is a collection of problems from the 2024 and 2025 [OTIS Mock AIME](https://web.evanchen.cc/mockaime.html).
These problems were written by students in the [Olympiad Training for Individual Study (OTIS)](https://web.evanchen.cc/otis.html) program. The OTIS Mock AIME is an annual 3-hour exam consisting of 15 problems with integer answers between 0 and 999.

This dataset includes a total of 45 problems from three exams:
- 15 problems from [Mock AIME 2024](https://web.evanchen.cc/exams/OTIS-Mock-AIME-2024.pdf) (solutions [here](https://web.evanchen.cc/exams/sols-OTIS-Mock-AIME-2024.pdf))
- 15 problems from [Mock AIME 2025 (I)](https://web.evanchen.cc/exams/OTIS-Mock-AIME-2025-I.pdf) (solutions [here](https://web.evanchen.cc/exams/sols-OTIS-Mock-AIME-2025-I.pdf))
- 15 problems from [Mock AIME 2025 (II)](https://web.evanchen.cc/exams/OTIS-Mock-AIME-2025-II.pdf) (solutions [here](https://web.evanchen.cc/exams/sols-OTIS-Mock-AIME-2025-II.pdf))

These problems are harder than MATH Level 5 problems but easier than FrontierMath problems.

This dataset is available on Huggingface: [EpochAI/otis-mock-aime-24-25](https://huggingface.co/datasets/EpochAI/otis-mock-aime-24-25).
`,
  },
  "swe-bench-verified": {
    md: `
[SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/)는 오리지널 SWE-bench 데이터셋의 인간 검증(human-validated)된 하위 집합으로, AI 모델이 실제 소프트웨어 엔지니어링 문제를 해결하는 능력을 평가하는 500개의 샘플로 구성됩니다. 각 샘플은 12개의 오픈 소스 Python 저장소 중 하나에 있는 실제 GitHub 이슈에서 파생되었습니다.

평가 워크플로우는 다음과 같습니다: 모델은 코드 저장소와 해결해야 할 문제에 대한 설명에 접근 권한을 부여받습니다. 모델은 그 다음 이슈를 해결하기 위해 저장소 내 적절한 파일을 수정해야 합니다. 모델이 변경을 완료하면, 수정된 코드베이스에서 단위 테스트(unit tests)를 실행하여 솔루션이 평가됩니다. 두 가지 유형의 테스트가 있습니다:

- FAIL_TO_PASS 테스트: 이 테스트들은 처음에 실패하지만, 모델의 솔루션을 적용한 후에는 통과해야 하며, 이슈가 해결되었음을 검증합니다.
- PASS_TO_PASS 테스트: 이 테스트들은 솔루션 적용 전에도 통과하며, 솔루션 적용 후에도 계속 통과해야 회귀(regressions)가 발생하지 않았음을 보장합니다.

이 데이터셋은 93명의 소프트웨어 개발자가 참여한 엄격한 인간 주석(human annotation) 프로세스를 통해 신중하게 선별되었습니다. 각 샘플은 세 명의 별도 주석자가 검토하여 다음을 보장했습니다:
이슈 설명이 명확하고 성공적인 솔루션이 무엇을 구성하는지 잘 명시되어 있습니다.
솔루션을 평가하는 데 사용되는 단위 테스트가 적절하며 유효한 솔루션을 걸러내지 않습니다.
샘플에 평가를 신뢰할 수 없게 만들 수 있는 다른 주요 문제가 없습니다.

SWE-bench는 Jimenez 외 다수가 저술한 "[SWE-bench: Can Language Models Resolve Real-World GitHub Issues?](https://arxiv.org/abs/2310.06770)"를 통해 소개되었습니다. SWE-bench Verified는 OpenAI와 SWE-bench 저자들의 협력으로 만들어졌습니다.
`,
    mdEn: `
[SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/) is a human-validated subset of the original SWE-bench dataset, consisting of 500 samples that evaluate AI models' ability to solve real software engineering problems. Each sample is derived from actual GitHub issues in one of 12 open-source Python repositories.

The evaluation workflow is as follows: models are given access to a code repository and a description of the problem to solve. The model must then modify the appropriate files within the repository to resolve the issue. Once the model completes its changes, the solution is evaluated by running unit tests on the modified codebase. There are two types of tests:

- FAIL_TO_PASS tests: These tests initially fail but should pass after applying the model's solution, verifying that the issue has been resolved.
- PASS_TO_PASS tests: These tests pass before applying the solution and should continue to pass afterward to ensure no regressions have been introduced.

This dataset was carefully curated through a rigorous human annotation process involving 93 software developers. Each sample was reviewed by three separate annotators to ensure:
The issue description is clear and well-specified about what constitutes a successful solution.
The unit tests used to evaluate the solution are appropriate and do not filter out valid solutions.
The sample has no other major issues that could make evaluation unreliable.

SWE-bench was introduced through "[SWE-bench: Can Language Models Resolve Real-World GitHub Issues?](https://arxiv.org/abs/2310.06770)" by Jimenez et al. SWE-bench Verified was created through collaboration between OpenAI and the SWE-bench authors.
`,
  },
  "weird-ml": {
    md: `
[WeirdML 벤치마크](https://htihle.github.io/weirdml.html)는 표준적인 방법을 적용하기보다는 신중한 사고와 이해를 요구하는 새로운 기계 학습 작업을 모델이 해결하는 능력을 평가합니다. 이 벤치마크는 다음의 여섯 가지 다양한 작업을 통해 모델을 테스트합니다: 모양 인식(쉬움 및 어려움 변형), 이미지 패치 재구성(쉬움 및 어려움 변형), 체스 게임 결과 예측, 그리고 준지도 학습 숫자 분류입니다.

예를 들어, Shapes(쉬움) 작업에서 모델은 512개의 2D 좌표 세트에서 다섯 가지 모양(원, 사각형, 삼각형, 오각형, 별) 중 하나를 식별해야 합니다. 이 세트에서는 일부 점만 모양에 속하고 나머지는 노이즈입니다. 각 모양을 따라 점의 분포가 크게 달라지므로, 과제는 점의 순열에 불변하며 여러 점의 정보를 효과적으로 결합할 수 있는 데이터 인코딩 방식을 개발하는 데 있습니다. 모델은 학습을 위해 1000개의 훈련 샘플을 제공받습니다.

각 모델은 작업당 5번의 시도를 할 수 있으며, 시도 사이에 피드백이 제공됩니다. 따라서 이 벤치마크는 초기 문제 해결 능력과 실행 결과로부터 학습하는 능력 모두를 측정합니다. 이 벤치마크의 결과는 [공식 WeirdML 결과 페이지](https://htihle.github.io/weirdml.html#results)에서 가져옵니다. WeirdML은 노르웨이 국방 연구소(Norwegian Defence Research Establishment)의 Håvard Tveit Ihle에 의해 만들어졌습니다.
`,
    mdEn: `
The [WeirdML benchmark](https://htihle.github.io/weirdml.html) evaluates models' ability to solve novel machine learning tasks that require careful thinking and understanding rather than applying standard methods. This benchmark tests models through six diverse tasks: shape recognition (easy and hard variants), image patch reconstruction (easy and hard variants), chess game outcome prediction, and semi-supervised digit classification.

For example, in the Shapes (easy) task, models must identify one of five shapes (circle, square, triangle, pentagon, star) from a set of 512 2D coordinates. In this set, only some points belong to the shape while the rest are noise. Since the distribution of points along each shape varies significantly, the challenge lies in developing a data encoding scheme that is invariant to point permutations and can effectively combine information from multiple points. Models are provided with 1000 training samples for learning.

Each model can make 5 attempts per task, with feedback provided between attempts. Therefore, this benchmark measures both initial problem-solving ability and the ability to learn from execution results. Results for this benchmark are taken from the [official WeirdML results page](https://htihle.github.io/weirdml.html#results). WeirdML was created by Håvard Tveit Ihle from the Norwegian Defence Research Establishment.
`,
  },
  "factorio": {
    md: `
[팩토리오 학습 환경](https://jackhopkins.github.io/factorio-learning-environment/)(Factorio Learning Environment, FLE)은 건설 및 관리 시뮬레이션 게임인 팩토리오에서 에이전트로서 대규모 언어 모델의 능력을 평가합니다. 특히 복잡한 계획을 설계하고 실행하는 능력, 장기적인 일관성을 유지하는 능력, 정확한 코드를 작성하는 능력, 그리고 개방적이고 동적인 환경 내에서 공간적으로 추론하는 능력을 테스트합니다.

팩토리오는 플레이어가 외계 행성에 불시착하여 처음부터 자동화된 공장을 건설해야 하는 게임입니다. 기본적인 자원 수집과 수동 제작으로 시작하여, 플레이어는 점점 더 복잡한 아이템의 생성을 자동화하기 위해 정교한 생산 라인을 설계하며, 종종 우주로 로켓을 발사하는 것으로 마무리됩니다.

팩토리오 학습 환경에는 두 가지 주요 설정이 포함됩니다:
- Lab-play: 에이전트가 자원 제약 하에 특정 공장을 건설해야 하는 24가지 구조화된 작업입니다. 랩 플레이에서의 성능은 모델이 완료한 랩 작업의 비율로 측정됩니다.
- Open-play: 에이전트가 절차적으로 생성된 지도에서 가능한 가장 큰 공장을 건설하는 것을 목표로 하는 무제한 작업입니다. 성능은 생산 점수로 측정되며, 이는 지금까지 생산된 모든 품목의 가치를 합산하는 경제 활동 지표입니다.

FLE는 Hopkins 등이 2025년 "[Factorio Learning Environment](https://arxiv.org/abs/2503.09617)"를 통해 소개했습니다.
`,
    mdEn: `
The [Factorio Learning Environment](https://jackhopkins.github.io/factorio-learning-environment/) (FLE) evaluates the capabilities of large language models as agents in Factorio, a construction and management simulation game. It specifically tests the ability to design and execute complex plans, maintain long-term consistency, write accurate code, and reason spatially within an open and dynamic environment.

Factorio is a game where players crash-land on an alien planet and must build automated factories from scratch. Starting with basic resource gathering and manual crafting, players design sophisticated production lines to automate the creation of increasingly complex items, often culminating in launching a rocket into space.

The Factorio Learning Environment includes two main settings:
- Lab-play: 24 structured tasks where agents must build specific factories under resource constraints. Performance in lab-play is measured by the percentage of lab tasks completed by the model.
- Open-play: An unlimited task where agents aim to build the largest possible factory on a procedurally generated map. Performance is measured by production score, an economic activity indicator that sums the value of all items produced so far.

FLE was introduced by Hopkins et al. in 2025 through "[Factorio Learning Environment](https://arxiv.org/abs/2503.09617)".
`,
  },
  "geo-bench": {
    md: `
GeoBench는 AI 모델이 사진이 촬영된 세계의 위치를 파악할 수 있는지 테스트합니다. 이 챌린지는 온라인 게임인 GeoGuessr에서 영감을 받았습니다. GeoGuessr는 플레이어가 로드사인, 식생, 건축물, 차량 번호판과 같은 단서를 찾아 스트리트 뷰 이미지를 검토하여 지도상의 위치를 정확히 찾아내는 게임입니다.

이 벤치마크는 실제 GeoGuessr 커뮤니티 맵 5개에서 가져온 알려진 위치의 사진을 모델에게 제시합니다: "A Community World", "A Varied World", 도시 환경(도시 및 대도시 지역), 시골 환경(교외 및 외딴 지역), 그리고 사진(스트리트 뷰가 아닌 사용자가 업로드한 사진)입니다. 모델은 위도/경도 좌표와 국가 예측을 모두 제공해야 하며, 점수는 지리적 거리(킬로미터 단위)와 국가 정확도를 기반으로 산정됩니다.

GeoBench는 핵심 다중 모달 능력(multimodal capabilities)을 평가합니다: 지리적 특징(식생, 건축물, 기반 시설)의 시각적 인식, 텍스트 이해(다양한 글꼴의 표지판 읽기), 공간 추론, 그리고 여러 시각적 단서를 통합하여 위치 가설을 형성하는 능력입니다.
GeoBench는 [CCMDI 블로그](https://ccmdi.com/blog/GeoBench)에서 소개되었습니다.
`,
    mdEn: `
GeoBench tests whether AI models can identify where in the world a photo was taken. This challenge is inspired by the online game GeoGuessr, where players examine Street View images to find clues like road signs, vegetation, architecture, and vehicle license plates to pinpoint locations on a map.

This benchmark presents models with photos from known locations taken from five real GeoGuessr community maps: "A Community World", "A Varied World", Urban environments (cities and metropolitan areas), Rural environments (suburban and remote areas), and Photos (user-uploaded photos rather than Street View). Models must provide both latitude/longitude coordinates and country predictions, with scores calculated based on geographic distance (in kilometers) and country accuracy.

GeoBench evaluates core multimodal capabilities: visual recognition of geographic features (vegetation, architecture, infrastructure), text understanding (reading signs in various fonts), spatial reasoning, and the ability to integrate multiple visual cues to form location hypotheses.
GeoBench was introduced in the [CCMDI blog](https://ccmdi.com/blog/GeoBench).
`,
  }
};
