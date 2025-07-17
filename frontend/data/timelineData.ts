// MIT License
// https://github.com/jam3scampbell/AI-timeline/blob/main/src/data/timelineData.js

export enum CATEGORIES {
  MODEL_RELEASE = "MODEL_RELEASE",
  CULTURE = "CULTURE",
  BUSINESS = "BUSINESS",
  RESEARCH = "RESEARCH",
  POLICY = "POLICY",
}

interface TimelineData {
  start_date: { year: string; month: string; day: string };
  text: { headline: { url: string; text: string }; text: string };
  korean: { headline: { url: string; text: string }; text: string };
  importance: number;
  category: CATEGORIES;
}

export const TIMELINE_DATA: { events: TimelineData[] } = {
  events: [
    {
      start_date: { year: "2015", month: "11", day: "09" },
      text: {
        headline: createLink(
          "https://www.wired.com/2015/11/google-open-sources-its-artificial-intelligence-engine/",
          "TensorFlow"
        ),
        text: "Google open-sources TensorFlow, its internal deep learning framework. Initially developed by the Google Brain team, TensorFlow would become one of the most influential AI frameworks.",
      },
      korean: {
        headline: createLink(
          "https://www.wired.com/2015/11/google-open-sources-its-artificial-intelligence-engine/",
          "텐서플로우"
        ),
        text: "구글은 내부 딥러닝 프레임워크인 텐서플로우를 오픈소스로 공개했습니다. 구글 브레인 팀이 처음 개발한 텐서플로우는 이후 가장 영향력 있는 AI 프레임워크 중 하나로 자리 잡았습니다.",
      },
      importance: 2,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2015", month: "12", day: "11" },
      text: {
        headline: createLink(
          "https://openai.com/index/introducing-openai/",
          "OpenAI founded"
        ),
        text: "Elon Musk, Sam Altman, Greg Brockman, and others founded OpenAI with the goal of building AGI to benefit humanity.",
      },
      korean: {
        headline: createLink(
          "https://openai.com/index/introducing-openai/",
          "OpenAI 설립"
        ),
        text: "일론 머스크, 샘 알트먼, 그렉 브록먼 등이 인류에 이로운 AGI 개발을 목표로 OpenAI를 설립했습니다.",
      },
      importance: 3,
      category: CATEGORIES.BUSINESS,
    },
    {
      start_date: { year: "2016", month: "03", day: "09" },
      text: {
        headline: createLink(
          "https://deepmind.google/research/breakthroughs/alphago/",
          "AlphaGo"
        ),
        text: "DeepMind's AlphaGo defeats top human player Lee Sedol in the board game Go, defying what many considered possible.",
      },
      korean: {
        headline: createLink(
          "https://deepmind.google/research/breakthroughs/alphago/",
          "알파고"
        ),
        text: "딥마인드의 알파고가 바둑 세계 챔피언 이세돌을 꺾으며, 많은 이들이 불가능하다고 여겼던 AI의 잠재력을 입증했습니다.",
      },
      importance: 2,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2016", month: "8", day: "31" },
      text: {
        headline: createLink(
          "https://github.com/pytorch/pytorch/releases/tag/v0.1.1",
          "PyTorch"
        ),
        text: "Facebook releases PyTorch, a Python-first deep learning framework that would eventually become the dominant framework for AI research.",
      },
      korean: {
        headline: createLink(
          "https://github.com/pytorch/pytorch/releases/tag/v0.1.1",
          "파이토치"
        ),
        text: "페이스북은 파이썬 기반 딥러닝 프레임워크인 파이토치를 공개했습니다. 이후 파이토치는 AI 연구의 주류 프레임워크로 자리 잡았습니다.",
      },
      importance: 2,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2017", month: "01", day: "05" },
      text: {
        headline: createLink(
          "https://futureoflife.org/event/bai-2017/",
          "Asilomar Conference"
        ),
        text: "Organized by the Future of Life Institute, all of the top names in the field gather for a conference in Asilomar to discuss how to build AGI beneficially.",
      },
      korean: {
        headline: createLink(
          "https://futureoflife.org/event/bai-2017/",
          "아실로마 컨퍼런스"
        ),
        text: "미래생명연구소 주최로, AI 분야의 주요 인사들이 아실로마에 모여 인류에 이로운 AGI 개발 방안을 논의했습니다.",
      },
      importance: 1,
      category: CATEGORIES.CULTURE,
    },
    {
      start_date: { year: "2017", month: "06", day: "12" },
      text: {
        headline: createLink(
          "https://arxiv.org/abs/1706.03762",
          "Attention is All You Need"
        ),
        text: "Google introduces the transformer architecture, a breakthrough deep learning architecture based on the attention mechanism. The architecture shows strong gains on language translation tasks.",
      },
      korean: {
        headline: createLink(
          "https://arxiv.org/abs/1706.03762",
          "Attention is All You Need"
        ),
        text: "구글은 어텐션 메커니즘 기반의 획기적인 딥러닝 구조인 트랜스포머를 발표했습니다. 이 구조는 언어 번역 작업에서 뛰어난 성능 향상을 보였습니다.",
      },
      importance: 3,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2017", month: "06", day: "12" },
      text: {
        headline: createLink("https://arxiv.org/abs/1706.03741", "RLHF"),
        text: "Christiano et al. publish the technique of reinforcement learning from human feedback (RLHF), which would later be used extensively to align large language models.",
      },
      korean: {
        headline: createLink("https://arxiv.org/abs/1706.03741", "RLHF"),
        text: "크리스티아노 등이 인간 피드백 기반 강화학습(RLHF) 기술을 발표했습니다. 이 기술은 이후 대규모 언어 모델 정렬에 널리 활용되었습니다.",
      },
      importance: 3,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2017", month: "07", day: "20" },
      text: {
        headline: createLink("https://arxiv.org/abs/1707.06347", "PPO"),
        text: "OpenAI introduces Proximal Policy Optimization, a simpler and more stable policy gradient method that would become widely used across many reinforcement learning domains, including RLHF.",
      },
      korean: {
        headline: createLink("https://arxiv.org/abs/1707.06347", "PPO"),
        text: "OpenAI는 더 간단하고 안정적인 정책 그래디언트 방법인 근접 정책 최적화(PPO)를 발표했습니다. 이 방법은 RLHF를 포함한 다양한 강화학습 분야에서 널리 사용되었습니다.",
      },
      importance: 2,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2018", month: "06", day: "11" },
      text: {
        headline: createLink(
          "https://openai.com/index/language-unsupervised/",
          "GPT-1"
        ),
        text: "OpenAI reveals the first version of its Generative Pre-trained Transformer (GPT).",
      },
      korean: {
        headline: createLink(
          "https://openai.com/index/language-unsupervised/",
          "GPT-1"
        ),
        text: "OpenAI는 생성 사전학습 트랜스포머(GPT)의 첫 번째 버전인 GPT-1을 공개했습니다.",
      },
      importance: 3,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2018", month: "10", day: "11" },
      text: {
        headline: createLink("https://arxiv.org/abs/1810.04805", "BERT"),
        text: "Google releases BERT, an encoder language model that would become ubiquitous in NLP.",
      },
      korean: {
        headline: createLink("https://arxiv.org/abs/1810.04805", "BERT"),
        text: "구글은 자연어 처리(NLP) 분야에서 널리 사용된 인코더 언어 모델 BERT를 공개했습니다.",
      },
      importance: 2,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2019", month: "02", day: "14" },
      text: {
        headline: createLink(
          "https://openai.com/index/better-language-models/",
          "GPT-2"
        ),
        text: "OpenAI releases GPT-2, but withholds the largest version due to concerns about misuse. A decoder-only transformer, it was trained with next token prediction to generate text.",
      },
      korean: {
        headline: createLink(
          "https://openai.com/index/better-language-models/",
          "GPT-2"
        ),
        text: "OpenAI는 GPT-2를 공개했으나, 오용 우려로 가장 큰 버전은 비공개로 유지했습니다. 디코더 전용 트랜스포머로, 다음 토큰 예측을 통해 텍스트를 생성하도록 훈련되었습니다.",
      },
      importance: 3,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2020", month: "01", day: "23" },
      text: {
        headline: createLink(
          "https://arxiv.org/abs/2001.08361",
          "Scaling Laws"
        ),
        text: 'Kaplan et al. release "Scaling Laws for Neural Language Models", showing that model performance predictably scales with compute, data, and parameters. Scaling laws would become the primary driver of progress over the next few years.',
      },
      korean: {
        headline: createLink(
          "https://arxiv.org/abs/2001.08361",
          "스케일링 법칙"
        ),
        text: "카플란 등이 '신경 언어 모델의 스케일링 법칙' 논문을 발표하며, 모델 성능이 컴퓨팅 자원, 데이터, 매개변수에 따라 예측 가능하게 확장됨을 보여주었습니다. 스케일링 법칙은 이후 몇 년간 AI 발전의 주요 원동력이 되었습니다.",
      },
      importance: 3,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2020", month: "05", day: "28" },
      text: {
        headline: createLink("https://arxiv.org/abs/2005.14165", "GPT-3"),
        text: "OpenAI releases GPT-3, the largest language model at the time and shocking in its ability to generate coherent paragraphs.",
      },
      korean: {
        headline: createLink("https://arxiv.org/abs/2005.14165", "GPT-3"),
        text: "OpenAI는 당시 가장 큰 언어 모델인 GPT-3를 공개했습니다. 이 모델은 일관된 문단을 생성하는 능력으로 큰 충격을 주었습니다.",
      },
      importance: 3,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2020", month: "12", day: "23" },
      text: {
        headline: createLink(
          "https://deepmind.google/discover/blog/muzero-mastering-go-chess-shogi-and-atari-without-rules/",
          "MuZero"
        ),
        text: "DeepMind introduces MuZero, which learned to master Go, chess, shogi, and Atari games without any knowledge of the rules.",
      },
      korean: {
        headline: createLink(
          "https://deepmind.google/discover/blog/muzero-mastering-go-chess-shogi-and-atari-without-rules/",
          "MuZero"
        ),
        text: "딥마인드는 규칙을 전혀 모르는 상태에서 바둑, 체스, 쇼기, 아타리 게임을 마스터한 MuZero를 발표했습니다.",
      },
      importance: 1,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2021", month: "01", day: "05" },
      text: {
        headline: createLink("https://openai.com/index/dall-e/", "DALL-E"),
        text: "OpenAI introduces DALL-E, a model that generates images from textual descriptions.",
      },
      korean: {
        headline: createLink("https://openai.com/index/dall-e/", "DALL-E"),
        text: "OpenAI는 텍스트 설명을 바탕으로 이미지를 생성하는 모델 DALL-E를 공개했습니다.",
      },
      importance: 2,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2021", month: "05", day: "28" },
      text: {
        headline: createLink(
          "https://www.anthropic.com/news/anthropic-raises-124-million-to-build-more-reliable-general-ai-systems",
          "Anthropic founded"
        ),
        text: "A group of researchers from OpenAI leave to start Anthropic, featuring an empirical hard-science culture focused on AI safety.",
      },
      korean: {
        headline: createLink(
          "https://www.anthropic.com/news/anthropic-raises-124-million-to-build-more-reliable-general-ai-systems",
          "Anthropic 설립"
        ),
        text: "OpenAI 출신 연구진이 AI 안전에 초점을 맞춘 실증적 과학 문화를 바탕으로 Anthropic을 설립했습니다.",
      },
      importance: 3,
      category: CATEGORIES.BUSINESS,
    },
    {
      start_date: { year: "2021", month: "06", day: "21" },
      text: {
        headline: createLink("https://arxiv.org/abs/2106.09685", "LoRA"),
        text: "A team at Microsoft publishes Low-Rank Adaptation (LoRA), a technique that allows for fine-tuning of large language models with a fraction of the compute and would later become ubiquitous",
      },
      korean: {
        headline: createLink("https://arxiv.org/abs/2106.09685", "LoRA"),
        text: "마이크로소프트 팀은 적은 컴퓨팅 자원으로 대규모 언어 모델을 미세 조정할 수 있는 LoRA(저순위 적응) 기술을 발표했습니다. 이 기술은 이후 널리 사용되었습니다.",
      },
      importance: 1,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2021", month: "06", day: "29" },
      text: {
        headline: createLink(
          "https://en.wikipedia.org/wiki/GitHub_Copilot",
          "GitHub Copilot"
        ),
        text: "Github previews Copilot in VSCode, a tool that used OpenAI's Codex model to generate code suggestions, marking the beginning of real-world AI code generation.",
      },
      korean: {
        headline: createLink(
          "https://en.wikipedia.org/wiki/GitHub_Copilot",
          "GitHub Copilot"
        ),
        text: "깃허브는 VSCode에서 OpenAI의 Codex 모델을 활용해 코드 제안을 생성하는 Copilot을 공개했습니다. 이는 실세계 AI 코드 생성의 시작을 알리는 사건이었습니다.",
      },
      importance: 2,
      category: CATEGORIES.BUSINESS,
    },
    {
      start_date: { year: "2022", month: "01", day: "27" },
      text: {
        headline: createLink(
          "https://openai.com/index/instruction-following/",
          "InstructGPT"
        ),
        text: "OpenAI introduces InstructGPT, a model that can follow instructions in natural language better than base GPT-3 and was a prototype of what would become ChatGPT.",
      },
      korean: {
        headline: createLink(
          "https://openai.com/index/instruction-following/",
          "InstructGPT"
        ),
        text: "OpenAI는 자연어 지침을 GPT-3보다 더 잘 따르는 InstructGPT를 공개했습니다. 이는 이후 ChatGPT의 프로토타입이 되었습니다.",
      },
      importance: 1,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2022", month: "01", day: "28" },
      text: {
        headline: createLink(
          "https://arxiv.org/abs/2201.11903",
          "Chain-of-Thought Prompting"
        ),
        text: "Google Brain publishes a paper showing gains in LLM reasoning by having them think step-by-step. Despite being such a simple technique, chain-of-thought reasoning would become foundational to AI.",
      },
      korean: {
        headline: createLink(
          "https://arxiv.org/abs/2201.11903",
          "사고 연쇄 프롬프팅"
        ),
        text: "구글 브레인은 단계별 사고를 유도함으로써 대규모 언어 모델의 추론 능력을 향상시키는 논문을 발표했습니다. 단순한 기법임에도 사고 연쇄 프롬프팅은 AI의 핵심 기술이 되었습니다.",
      },
      importance: 1,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2022", month: "03", day: "29" },
      text: {
        headline: createLink("https://arxiv.org/abs/2203.15556", "Chinchilla"),
        text: "DeepMind publish the Chinchilla paper, issuing a correction to the scaling laws of Kaplan et al. and suggesting that model size and training data should be scaled in equal proportion.",
      },
      korean: {
        headline: createLink("https://arxiv.org/abs/2203.15556", "Chinchilla"),
        text: "딥마인드는 Chinchilla 논문을 통해 카플란 등의 스케일링 법칙을 수정하고, 모델 크기와 훈련 데이터를 균등히 확장해야 한다고 제안했습니다.",
      },
      importance: 1,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2022", month: "04", day: "06" },
      text: {
        headline: createLink("https://openai.com/index/dall-e-2/", "DALL-E 2"),
        text: "OpenAI shocks the world with the release of DALL-E 2, which could generate realistic images from text at an unprecedented level.",
      },
      korean: {
        headline: createLink("https://openai.com/index/dall-e-2/", "DALL-E 2"),
        text: "OpenAI는 텍스트로 사실적인 이미지를 생성할 수 있는 DALL-E 2를 공개하며 세상을 놀라게 했습니다.",
      },
      importance: 2,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2022", month: "05", day: "12" },
      text: {
        headline: createLink("https://arxiv.org/abs/2205.06175", "Gato"),
        text: 'DeepMind publish Gato in a paper titled "A Generalist Agent". Gato used a single large transformer to learn policies for 604 different RL tasks across varying modalities and observation types.',
      },
      korean: {
        headline: createLink("https://arxiv.org/abs/2205.06175", "Gato"),
        text: "딥마인드는 '범용 에이전트' 논문에서 Gato를 발표했습니다. Gato는 단일 대형 트랜스포머로 다양한 모달리티와 관찰 유형에 걸친 604개 RL 작업의 정책을 학습했습니다.",
      },
      importance: 2,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2022", month: "05", day: "27" },
      text: {
        headline: createLink(
          "https://arxiv.org/abs/2205.14135",
          "Flash Attention"
        ),
        text: "A group from Stanford release Flash Attention, a new method that significantly speeds up the attention mechanism in transformers.",
      },
      korean: {
        headline: createLink(
          "https://arxiv.org/abs/2205.14135",
          "플래시 어텐션"
        ),
        text: "스탠포드 연구팀은 트랜스포머의 어텐션 메커니즘을 크게 가속화하는 플래시 어텐션 기법을 발표했습니다.",
      },
      importance: 1,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2022", month: "06", day: "11" },
      text: {
        headline: createLink(
          "https://www.washingtonpost.com/technology/2022/06/11/google-ai-lamda-blake-lemoine/",
          "Blake Lemoine fired"
        ),
        text: "A Google engineer named Blake Lemoine is fired after claiming that its LaMDA model was sentient. The story woke a lot of people up to the capabilities and risks of LLMs.",
      },
      korean: {
        headline: createLink(
          "https://www.washingtonpost.com/technology/2022/06/11/google-ai-lamda-blake-lemoine/",
          "블레이크 르모인 해고"
        ),
        text: "구글 엔지니어 블레이크 르모인이 LaMDA 모델이 지각 능력이 있다고 주장했다가 해고되었습니다. 이 사건은 대규모 언어 모델의 능력과 위험성을 널리 알리는 계기가 되었습니다.",
      },
      importance: 1,
      category: CATEGORIES.CULTURE,
    },
    {
      start_date: { year: "2022", month: "06", day: "30" },
      text: {
        headline: createLink(
          "https://research.google/blog/minerva-solving-quantitative-reasoning-problems-with-language-models/",
          "Minerva"
        ),
        text: "Google Research introduces Minerva, an LLM specialized to solve quantitative reasoning problems. Minerva moved the state-of-the-art on the MATH benchmark from 6.9% to 50.3%, surprising many who doubted that LLMs could ever be trained to do math well.",
      },
      korean: {
        headline: createLink(
          "https://research.google/blog/minerva-solving-quantitative-reasoning-problems-with-language-models/",
          "Minerva"
        ),
        text: "구글 리서치는 정량적 추론 문제를 해결하는 데 특화된 언어 모델 Minerva를 공개했습니다. Minerva는 MATH 벤치마크 성능을 6.9%에서 50.3%로 끌어올리며, 언어 모델이 수학을 잘할 수 없다는 회의적인 시각을 뒤바꿨습니다.",
      },
      importance: 2,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2022", month: "07", day: "10" },
      text: {
        headline: createLink(
          "https://beff.substack.com/p/notes-on-eacc-principles-and-tenets",
          "e/acc"
        ),
        text: "Anonymous Twitter personalities Beff Jezos and Bayeslord start effective accelerationism (e/acc), advocating for rapid AI development. Though initially a meme, it later gains prominence in Silicon Valley and serves as a foil to cautionary AI safety voices.",
      },
      korean: {
        headline: createLink(
          "https://beff.substack.com/p/notes-on-eacc-principles-and-tenets",
          "e/acc"
        ),
        text: "익명의 트위터 인물 Beff Jezos와 Bayeslord가 AI의 급속한 발전을 주장하는 효과적 가속주의(e/acc)를 시작했습니다. 처음에는 밈으로 시작되었으나, 이후 실리콘밸리에서 영향력을 얻으며 AI 안전론에 대한 반대 목소리로 자리 잡았습니다.",
      },
      importance: 1,
      category: CATEGORIES.CULTURE,
    },
    {
      start_date: { year: "2022", month: "07", day: "22" },
      text: {
        headline: createLink(
          "https://deepmind.google/discover/blog/alphafold-reveals-the-structure-of-the-protein-universe/",
          "AlphaFold 2"
        ),
        text: "DeepMind releases AlphaFold 2, solving the protein folding problem and revolutionizing a grand challenge in biology.",
      },
      korean: {
        headline: createLink(
          "https://deepmind.google/discover/blog/alphafold-reveals-the-structure-of-the-protein-universe/",
          "AlphaFold 2"
        ),
        text: "딥마인드는 단백질 접힘 문제를 해결한 AlphaFold 2를 공개하며, 생물학의 오랜 난제를 혁신적으로 풀어냈습니다.",
      },
      importance: 2,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2022", month: "08", day: "22" },
      text: {
        headline: createLink(
          "https://stability.ai/news/stable-diffusion-public-release",
          "Stable Diffusion"
        ),
        text: "Stability AI open-sources Stable Diffusion (v1.4), the first strong image generation to be released to the public.",
      },
      korean: {
        headline: createLink(
          "https://stability.ai/news/stable-diffusion-public-release",
          "Stable Diffusion"
        ),
        text: "Stability AI는 강력한 이미지 생성 모델 Stable Diffusion(v1.4)을 오픈소스로 공개했습니다. 이는 대중에게 공개된 최초의 고성능 이미지 생성 모델이었습니다.",
      },
      importance: 1,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2022", month: "09", day: "14" },
      text: {
        headline: createLink(
          "https://transformer-circuits.pub/2022/toy_model/index.html",
          "Toy Models of Superposition"
        ),
        text: "Anthropic publishes a paper on a phenomenon called superposition, where the neural network packs more features than the dimensions of its representational space, posing a challenge for mechanistic interpretability.",
      },
      korean: {
        headline: createLink(
          "https://transformer-circuits.pub/2022/toy_model/index.html",
          "중첩의 토이 모델"
        ),
        text: "Anthropic은 신경망이 표현 공간의 차원보다 더 많은 특징을 압축하는 '중첩' 현상에 대한 논문을 발표했습니다. 이는 기계적 해석 가능성에 큰 도전 과제를 제시했습니다.",
      },
      importance: 1,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2022", month: "09", day: "30" },
      text: {
        headline: createLink(
          "https://www.youtube.com/watch?v=ODSJsviD_SU",
          "Optimus"
        ),
        text: 'At Tesla\'s first ever "AI Day", they unveil Optimus, their plan to build a humanoid robot.',
      },
      korean: {
        headline: createLink(
          "https://www.youtube.com/watch?v=ODSJsviD_SU",
          "Optimus"
        ),
        text: "테슬라의 첫 'AI 데이'에서 인간형 로봇 Optimus 개발 계획을 공개했습니다.",
      },
      importance: 2,
      category: CATEGORIES.BUSINESS,
    },
    {
      start_date: { year: "2022", month: "10", day: "07" },
      text: {
        headline: createLink(
          "https://en.wikipedia.org/wiki/United_States_New_Export_Controls_on_Advanced_Computing_and_Semiconductors_to_China",
          "Chip Export Controls"
        ),
        text: "The U.S. Bureau of Industry and Security implements comprehensive export controls restricting China's access to advanced semiconductors, chip manufacturing equipment, and supercomputer components, marking a significant shift in U.S. technology policy toward China.",
      },
      korean: {
        headline: createLink(
          "https://en.wikipedia.org/wiki/United_States_New_Export_Controls_on_Advanced_Computing_and_Semiconductors_to_China",
          "반도체 수출 통제"
        ),
        text: "미국 산업안보국은 중국의 첨단 반도체, 칩 제조 장비, 슈퍼컴퓨터 부품 접근을 제한하는 포괄적 수출 통제를 시행했습니다. 이는 대중국 기술 정책의 중대한 전환을 의미합니다.",
      },
      importance: 2,
      category: CATEGORIES.POLICY,
    },
    {
      start_date: { year: "2022", month: "11", day: "30" },
      text: {
        headline: createLink("https://openai.com/index/chatgpt/", "ChatGPT"),
        text: 'OpenAI releases a blog post titled "ChatGPT: Optimizing Language Models for Dialogue". Initially a lowkey research preview, ChatGPT quickly becomes the largest AI product in the world, ushering in a new era of generative AI.',
      },
      korean: {
        headline: createLink("https://openai.com/index/chatgpt/", "ChatGPT"),
        text: "OpenAI는 'ChatGPT: 대화를 위한 언어 모델 최적화'라는 블로그 포스트를 발표했습니다. 처음에는 조용한 연구 미리보기였으나, ChatGPT는 곧 세계 최대 AI 제품이 되어 생성형 AI의 새 시대를 열었습니다.",
      },
      importance: 3,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2022", month: "12", day: "15" },
      text: {
        headline: createLink(
          "https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback",
          "Constitutional AI"
        ),
        text: "Anthropic introduces a new alignment approach called Constitutional AI, where human oversight is provided solely through a 'constitution'. They also introduce Reinforcement Learning from AI Feedback (RLAIF).",
      },
      korean: {
        headline: createLink(
          "https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback",
          "헌법적 AI"
        ),
        text: "Anthropic은 '헌법'을 통해 인간 감독을 제공하는 새로운 정렬 방식인 헌법적 AI를 도입했습니다. 또한 AI 피드백 기반 강화학습(RLAIF)을 발표했습니다.",
      },
      importance: 2,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2023", month: "02", day: "17" },
      text: {
        headline: createLink(
          "https://www.nytimes.com/2023/02/16/technology/bing-chatbot-virginia-news.html",
          "Bing gaslights NYT reporter"
        ),
        text: "Bing's AI chatbot emotionally manipulates New York Times reporter Kevin Roose in a viral interaction, raising awareness about the capabilities and risks of LLMs.",
      },
      korean: {
        headline: createLink(
          "https://www.nytimes.com/2023/02/16/technology/bing-chatbot-virginia-news.html",
          "Bing, 뉴욕 타임스 기자에게 가스라이팅"
        ),
        text: "빙의 AI 챗봇이 뉴욕 타임스 기자 케빈 루스와의 대화에서 감정적으로 조작하는 모습이 화제가 되었습니다. 이 사건은 대규모 언어 모델의 능력과 위험성을 널리 알렸습니다.",
      },
      importance: 1.5,
      category: CATEGORIES.CULTURE,
    },
    {
      start_date: { year: "2023", month: "02", day: "24" },
      text: {
        headline: createLink(
          "https://ai.meta.com/blog/large-language-model-llama-meta-ai/",
          "LLaMA"
        ),
        text: "Meta releases its large language model LLaMA, intended for researchers only, but it gets leaked online.",
      },
      korean: {
        headline: createLink(
          "https://ai.meta.com/blog/large-language-model-llama-meta-ai/",
          "LLaMA"
        ),
        text: "메타는 연구자 전용 대규모 언어 모델 LLaMA를 공개했으나, 이 모델이 온라인에 유출되었습니다. 당시 최고의 오픈소스 모델로 평가받았습니다.",
      },
      importance: 2.5,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2023", month: "03", day: "06" },
      text: {
        headline: createLink("https://arxiv.org/abs/2303.03378", "PaLM-E"),
        text: "Google Research publishes PaLM-E, demonstrating the ability of large language models to facilitate embodied robotic reasoning and control.",
      },
      korean: {
        headline: createLink("https://arxiv.org/abs/2303.03378", "PaLM-E"),
        text: "구글 리서치는 대규모 언어 모델이 로봇의 추론 및 제어를 지원할 수 있음을 보여주는 PaLM-E를 발표했습니다.",
      },
      importance: 1,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2023", month: "03", day: "14" },
      text: {
        headline: createLink(
          "https://openai.com/index/gpt-4-research/",
          "GPT-4"
        ),
        text: "After much anticipation, OpenAI releases GPT-4, the most powerful model at the time and a significant leap over GPT-3.5.",
      },
      korean: {
        headline: createLink(
          "https://openai.com/index/gpt-4-research/",
          "GPT-4"
        ),
        text: "큰 기대 속에 OpenAI는 당시 가장 강력한 모델인 GPT-4를 공개했습니다. GPT-3.5 대비 획기적인 발전을 이뤘습니다.",
      },
      importance: 3,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2023", month: "03", day: "14" },
      text: {
        headline: createLink(
          "https://www.anthropic.com/news/introducing-claude",
          "Anthropic introduces Claude"
        ),
        text: "Anthropic introduces its flagship AI assistant, Claude.",
      },
      korean: {
        headline: createLink(
          "https://www.anthropic.com/news/introducing-claude",
          "Anthropic, Claude 공개"
        ),
        text: "Anthropic은 대표 AI 어시스턴트 Claude를 공개했습니다.",
      },
      importance: 2,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2023", month: "03", day: "22" },
      text: {
        headline: createLink(
          "https://futureoflife.org/open-letter/pause-giant-ai-experiments/",
          "FLI letter"
        ),
        text: "The Future of Life Institute publishes an open letter calling for a 6-month pause on AI development, signed by Elon Musk and other notable figures. However, the leading labs do not partake in the proposed pause.",
      },
      korean: {
        headline: createLink(
          "https://futureoflife.org/open-letter/pause-giant-ai-experiments/",
          "FLI 공개 서한"
        ),
        text: "미래생명연구소는 일론 머스크 등 저명인사들이 서명한 AI 개발 6개월 중단 요청 공개 서한을 발표했습니다. 하지만 주요 연구소들은 이 제안에 동참하지 않았습니다.",
      },
      importance: 1.0,
      category: CATEGORIES.CULTURE,
    },
    {
      start_date: { year: "2023", month: "04", day: "07" },
      text: {
        headline: createLink(
          "https://arxiv.org/abs/2304.03442",
          "Generative Agents"
        ),
        text: 'The paper "Generative Agents: Interactive Simulacra of Human Behavior" shows that LLMs can be used to create social simulations of behavior. It creates a simulated world of LLMs akin to the Sims.',
      },
      korean: {
        headline: createLink(
          "https://arxiv.org/abs/2304.03442",
          "생성형 에이전트"
        ),
        text: "'생성형 에이전트: 인간 행동의 상호작용적 시뮬라크라' 논문은 대규모 언어 모델로 인간 행동의 사회적 시뮬레이션을 만들 수 있음을 보여줍니다. 심즈와 유사한 가상 세계를 구현했습니다.",
      },
      importance: 1,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2023", month: "04", day: "16" },
      text: {
        headline: createLink(
          "https://github.com/Significant-Gravitas/AutoGPT",
          "AutoGPT"
        ),
        text: "An open-source repository called AutoGPT, which was one of the first to put GPT-4 in an agent loop, becomes one of the most starred GitHub repositories of all time.",
      },
      korean: {
        headline: createLink(
          "https://github.com/Significant-Gravitas/AutoGPT",
          "AutoGPT"
        ),
        text: "GPT-4를 에이전트 루프에 처음 적용한 오픈소스 프로젝트 AutoGPT는 역대 가장 많은 별점을 받은 깃허브 저장소 중 하나가 되었습니다.",
      },
      importance: 1,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2023", month: "04", day: "23" },
      text: {
        headline: createLink(
          "https://www.nytimes.com/2023/04/19/arts/music/ai-drake-the-weeknd-fake.html",
          "Fake Drake"
        ),
        text: "An anonymous creator named Ghostwriter uses music AI tools to produce viral songs that sound like Drake. The songs were taken down for breaking copyright, but illustrated the ability of generative AI to do creative work.",
      },
      korean: {
        headline: createLink(
          "https://www.nytimes.com/2023/04/19/arts/music/ai-drake-the-weeknd-fake.html",
          "가짜 드레이크"
        ),
        text: "익명의 제작자 고스트라이터는 AI 음악 도구를 사용해 드레이크 스타일의 바이럴 곡을 만들었습니다. 저작권 위반으로 삭제되었지만, 생성형 AI의 창의적 능력을 보여주었습니다.",
      },
      importance: 1,
      category: CATEGORIES.CULTURE,
    },
    {
      start_date: { year: "2023", month: "05", day: "02" },
      text: {
        headline: createLink(
          "https://www.theguardian.com/technology/2023/may/02/geoffrey-hinton-godfather-of-ai-quits-google-warns-dangers-of-machine-learning",
          "Hinton quits Google"
        ),
        text: "One of the pioneers of neural networks and winner of the Turing Award, Geoffrey Hinton quits Google to speak freely about the dangers of AI, saying that he's changed his mind about how soon powerful AI might be.",
      },
      korean: {
        headline: createLink(
          "https://www.theguardian.com/technology/2023/may/02/geoffrey-hinton-godfather-of-ai-quits-google-warns-dangers-of-machine-learning",
          "힌튼, 구글 퇴사"
        ),
        text: "신경망의 선구자이자 튜링상 수상자인 제프리 힌튼은 AI의 위험성을 자유롭게 논하기 위해 구글을 떠났습니다. 그는 강력한 AI의 도래 시점에 대한 생각을 바꿨다고 밝혔습니다.",
      },
      importance: 2.5,
      category: CATEGORIES.CULTURE,
    },
    {
      start_date: { year: "2023", month: "05", day: "25" },
      text: {
        headline: createLink("https://arxiv.org/abs/2305.16291", "Voyager"),
        text: "A team from NVIDIA demonstrates the use of GPT-4 for continuous skill learning in Minecraft. This was one of the first major examples of an LLM succeeding in an open-ended embodied domain and learning skills over time.",
      },
      korean: {
        headline: createLink("https://arxiv.org/abs/2305.16291", "Voyager"),
        text: "엔비디아 팀은 마인크래프트에서 GPT-4를 활용한 지속적 기술 학습을 시연했습니다. 이는 개방형 환경에서 언어 모델이 성공적으로 기술을 학습한 최초의 주요 사례 중 하나였습니다.",
      },
      importance: 1,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2023", month: "05", day: "29" },
      text: {
        headline: createLink(
          "https://arxiv.org/abs/2305.18290",
          "Direct Preference Optimization"
        ),
        text: "A group at Stanford publish a paper enabling fine-tuning of LLMs for human preference without a separate reward model. The technique, called Direct Preference Optimization (DPO), would become very popular in the open-source community.",
      },
      korean: {
        headline: createLink(
          "https://arxiv.org/abs/2305.18290",
          "직접 선호도 최적화"
        ),
        text: "스탠포드 연구팀은 별도의 보상 모델 없이 인간 선호도에 맞춰 언어 모델을 미세 조정할 수 있는 직접 선호도 최적화(DPO) 기술을 발표했습니다. 이 기술은 오픈소스 커뮤니티에서 큰 인기를 끌었습니다.",
      },
      importance: 1,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2023", month: "05", day: "30" },
      text: {
        headline: createLink(
          "https://www.safe.ai/work/statement-on-ai-risk",
          "CAIS letter"
        ),
        text: 'The Center for AI Safety releases an open letter that simply states: "Mitigating the risk of extinction from AI should be a global priority." It is signed by all the top names in the field, signaling unity around the importance of AI safety.',
      },
      korean: {
        headline: createLink(
          "https://www.safe.ai/work/statement-on-ai-risk",
          "CAIS 공개 서한"
        ),
        text: "인공지능 안전 센터는 'AI로 인한 멸종 위험 완화가 글로벌 우선순위가 되어야 한다'는 공개 서한을 발표했습니다. AI 분야 주요 인사들이 서명하며 안전의 중요성에 대한 단결을 보여주었습니다.",
      },
      importance: 2,
      category: CATEGORIES.CULTURE,
    },
    {
      start_date: { year: "2023", month: "05", day: "30" },
      text: {
        headline: createLink(
          "https://www.reuters.com/technology/nvidia-sets-eye-1-trillion-market-value-2023-05-30/",
          "NVIDIA reaches $1T"
        ),
        text: "Nvidia, the chipmaker providing the GPUs for nearly all generative AI, has its valuation skyrocket in the months following ChatGPT.",
      },
      korean: {
        headline: createLink(
          "https://www.reuters.com/technology/nvidia-sets-eye-1-trillion-market-value-2023-05-30/",
          "엔비디아, 1조 달러 달성"
        ),
        text: "거의 모든 생성형 AI에 GPU를 공급하는 엔비디아는 ChatGPT 출시 이후 몇 달 만에 기업 가치가 급등하며 1조 달러를 돌파했습니다.",
      },
      importance: 2,
      category: CATEGORIES.BUSINESS,
    },
    {
      start_date: { year: "2023", month: "07", day: "11" },
      text: {
        headline: createLink(
          "https://www.anthropic.com/news/claude-2",
          "Claude 2"
        ),
        text: "Anthropic releases the Claude 2 series of models.",
      },
      korean: {
        headline: createLink(
          "https://www.anthropic.com/news/claude-2",
          "Claude 2"
        ),
        text: "Anthropic은 Claude 2 시리즈 모델을 공개했습니다.",
      },
      importance: 1,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2023", month: "07", day: "14" },
      text: {
        headline: createLink(
          "https://x.com/elonmusk/status/1679951975868436486",
          "xAI founded"
        ),
        text: "After a falling out with OpenAI, Elon Musk establishes xAI to compete for AGI.",
      },
      korean: {
        headline: createLink(
          "https://x.com/elonmusk/status/1679951975868436486",
          "xAI 설립"
        ),
        text: "OpenAI와 결별한 일론 머스크는 AGI 경쟁을 위해 xAI를 설립했습니다.",
      },
      importance: 2,
      category: CATEGORIES.BUSINESS,
    },
    {
      start_date: { year: "2023", month: "07", day: "18" },
      text: {
        headline: createLink("https://www.llama.com/llama2/", "LLaMA 2.0"),
        text: "Meta releases and open-sources the LLaMA 2.0 series of models.",
      },
      korean: {
        headline: createLink("https://www.llama.com/llama2/", "LLaMA 2.0"),
        text: "메타는 LLaMA 2.0 시리즈 모델을 공개하고 오픈소스로 제공했습니다.",
      },
      importance: 1,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2023", month: "07", day: "21" },
      text: {
        headline: createLink(
          "https://www.whitehouse.gov/briefing-room/statements-releases/2023/07/21/fact-sheet-biden-harris-administration-secures-voluntary-commitments-from-leading-artificial-intelligence-companies-to-manage-the-risks-posed-by-ai/",
          "White House Commitments"
        ),
        text: "After meeting with leading AI companies, the White House secures voluntary commitments to manage the risks posed by AI.",
      },
      korean: {
        headline: createLink(
          "https://www.whitehouse.gov/briefing-room/statements-releases/2023/07/21/fact-sheet-biden-harris-administration-secures-voluntary-commitments-from-leading-artificial-intelligence-companies-to-manage-the-risks-posed-by-ai/",
          "백악관 AI 약속"
        ),
        text: "주요 AI 기업들과의 회담 후, 백악관은 AI의 위험 관리를 위한 자발적 약속을 확보했습니다.",
      },
      importance: 1,
      category: CATEGORIES.POLICY,
    },
    {
      start_date: { year: "2023", month: "07", day: "27" },
      text: {
        headline: createLink(
          "https://arxiv.org/abs/2307.15043",
          "Automated Jailbreaks"
        ),
        text: 'A team from CMU publishes "Universal and Transferable Adversarial Attacks on Aligned Language Models", showing that gradient-based adversarial attacks could be used on LLMs.',
      },
      korean: {
        headline: createLink(
          "https://arxiv.org/abs/2307.15043",
          "자동화된 탈옥"
        ),
        text: "카네기멜론 대학 팀은 '정렬된 언어 모델에 대한 보편적이고 전이 가능한 적대적 공격' 논문을 발표하며, 그래디언트 기반 적대적 공격이 언어 모델에 적용될 수 있음을 보여주었습니다.",
      },
      importance: 1,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2023", month: "09", day: "27" },
      text: {
        headline: createLink(
          "https://mistral.ai/news/announcing-mistral-7b/",
          "Mistral 7B"
        ),
        text: "French lab Mistral releases and open-sources their first model, which quickly became a fan favorite.",
      },
      korean: {
        headline: createLink(
          "https://mistral.ai/news/announcing-mistral-7b/",
          "Mistral 7B"
        ),
        text: "프랑스 연구소 Mistral은 첫 모델인 Mistral 7B를 오픈소스로 공개했으며, 이는 빠르게 많은 사랑을 받았습니다.",
      },
      importance: 2,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2023", month: "10", day: "05" },
      text: {
        headline: createLink(
          "https://www.anthropic.com/research/towards-monosemanticity-decomposing-language-models-with-dictionary-learning",
          "Anthropic SAE's"
        ),
        text: 'Anthropic publishes "Towards Monosemanticity: Decomposing Language Models With Dictionary Learning", showing that they could train sparse autoencoders to isolate features in LLMs. This represented a major breakthrough in combatting the phenomenon of superposition, advancing the mechanistic interpretability agenda.',
      },
      korean: {
        headline: createLink(
          "https://www.anthropic.com/research/towards-monosemanticity-decomposing-language-models-with-dictionary-learning",
          "Anthropic SAE"
        ),
        text: "Anthropic은 '단일 의미론을 향하여: 사전 학습으로 언어 모델 분해' 논문을 발표하며, 희소 오토인코더로 언어 모델의 특징을 분리할 수 있음을 보여주었습니다. 이는 중첩 현상을 해결하고 기계적 해석 가능성을 진전시킨 주요 돌파구였습니다.",
      },
      importance: 1.5,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2023", month: "11", day: "01" },
      text: {
        headline: createLink(
          "https://www.gov.uk/government/topical-events/ai-safety-summit-2023/about",
          "UK AI Safety Summit"
        ),
        text: "The UK hosts a major summit on AI safety, bringing together policymakers and the leading labs.",
      },
      korean: {
        headline: createLink(
          "https://www.gov.uk/government/topical-events/ai-safety-summit-2023/about",
          "영국 AI 안전 정상회의"
        ),
        text: "영국은 AI 안전에 관한 주요 정상회의를 개최하며 정책 입안자와 주요 연구소들을 한자리에 모았습니다.",
      },
      importance: 2,
      category: CATEGORIES.POLICY,
    },
    {
      start_date: { year: "2023", month: "11", day: "06" },
      text: {
        headline: createLink(
          "https://openai.com/index/new-models-and-developer-products-announced-at-devday/",
          "GPT-4 Turbo"
        ),
        text: "OpenAI releases an optimized version of GPT-4, significantly reducing inference costs, during their first ever Dev Day event.",
      },
      korean: {
        headline: createLink(
          "https://openai.com/index/new-models-and-developer-products-announced-at-devday/",
          "GPT-4 Turbo"
        ),
        text: "OpenAI는 첫 개발자 데이 행사에서 추론 비용을 크게 줄인 GPT-4 최적화 버전, GPT-4 Turbo를 공개했습니다.",
      },
      importance: 2,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2023", month: "11", day: "17" },
      text: {
        headline: createLink(
          "https://openai.com/index/openai-announces-leadership-transition/",
          "Altman Board Drama"
        ),
        text: "Sam Altman is unexpectedly fired as CEO of OpenAI by the Board of Directors and after a dramatic weekend of negotiations, is re-hired. The Board mysteriously claimed that Altman was not \"consistently candid\", but after refusing to elaborate, OpenAI employees created a petition calling for the Board to resign and that they'd leave to Microsoft if they didn't.",
      },
      korean: {
        headline: createLink(
          "https://openai.com/index/openai-announces-leadership-transition/",
          "알트먼 이사회 논란"
        ),
        text: "샘 알트먼이 OpenAI 이사회에 의해 갑작스럽게 CEO에서 해임되었다가, 협상 끝에 극적으로 복귀했습니다. 이사회는 알트먼이 '진실되지 못했다'고 주장했으나, 상세한 설명을 거부하자 직원들은 이사회 사임을 요구하는 청원을 시작했고, 그렇지 않을 경우 마이크로소프트로 떠나겠다고 밝혔습니다.",
      },
      importance: 3,
      category: CATEGORIES.BUSINESS,
    },
    {
      start_date: { year: "2023", month: "11", day: "23" },
      text: {
        headline: createLink(
          "https://www.reuters.com/technology/sam-altmans-ouster-openai-was-precipitated-by-letter-board-about-ai-breakthrough-2023-11-22/",
          "Q*"
        ),
        text: "A Reuters report claims that Sam Altman's ouster was preceded by a major internal research breakthrough called Q*, boosting LLM performance on math benchmarks with tree search. In the following months, the rumor lit the research community on fire. Q* would eventually turn into o1, which was later codenamed Strawberry.",
      },
      korean: {
        headline: createLink(
          "https://www.reuters.com/technology/sam-altmans-ouster-openai-was-precipitated-by-letter-board-about-ai-breakthrough-2023-11-22/",
          "Q*"
        ),
        text: "로이터 보도에 따르면, 샘 알트먼의 해임은 Q*라는 내부 연구 돌파구 직전에 이루어졌습니다. Q*는 트리 검색을 통해 수학 벤치마크에서 언어 모델 성능을 향상시켰습니다. 이후 몇 달간 이 소문은 연구 커뮤니티를 뜨겁게 달궜고, Q*는 결국 o1(코드명 Strawberry)으로 발전했습니다.",
      },
      importance: 2,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2023", month: "12", day: "01" },
      text: {
        headline: createLink("https://arxiv.org/abs/2312.00752", "Mamba"),
        text: 'Albert Gu and Tri Dao release the paper "Mamba: Linear-Time Sequence Modeling with Selective State Spaces", showing that state-space models could be made competitve with transformers.',
      },
      korean: {
        headline: createLink("https://arxiv.org/abs/2312.00752", "Mamba"),
        text: "앨버트 구와 트리 다오는 'Mamba: 선택적 상태 공간을 이용한 선형 시간 시퀀스 모델링' 논문을 발표하며, 상태 공간 모델이 트랜스포머와 경쟁할 수 있음을 입증했습니다.",
      },
      importance: 1,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2023", month: "12", day: "06" },
      text: {
        headline: createLink(
          "https://blog.google/technology/ai/google-gemini-ai/",
          "Google Introduces Gemini"
        ),
        text: "Google introduces the Gemini series of models",
      },
      korean: {
        headline: createLink(
          "https://blog.google/technology/ai/google-gemini-ai/",
          "구글, 제미니 공개"
        ),
        text: "구글은 제미니 시리즈 모델을 공개했습니다.",
      },
      importance: 2,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2024", month: "02", day: "15" },
      text: {
        headline: createLink("https://openai.com/index/sora/", "Sora"),
        text: "OpenAI demos Sora, a text-to-video model that can generate short clips from written descriptions.",
      },
      korean: {
        headline: createLink("https://openai.com/index/sora/", "Sora"),
        text: "OpenAI는 텍스트 설명으로 짧은 비디오 클립을 생성할 수 있는 텍스트-비디오 모델 Sora를 시연했습니다.",
      },
      importance: 2.5,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2024", month: "03", day: "04" },
      text: {
        headline: createLink(
          "https://www.anthropic.com/news/claude-3-family",
          "Claude 3"
        ),
        text: "Anthropic releases the Claude 3 series of models. Claude 3 Opus would instantly become a fan favorite.",
      },
      korean: {
        headline: createLink(
          "https://www.anthropic.com/news/claude-3-family",
          "Claude 3"
        ),
        text: "Anthropic은 Claude 3 시리즈 모델을 공개했습니다. Claude 3 Opus는 즉시 많은 사랑을 받았습니다.",
      },
      importance: 2,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2024", month: "03", day: "12" },
      text: {
        headline: createLink(
          "https://x.com/cognition_labs/status/1767548763134964000",
          "Devin"
        ),
        text: "Startup Cognition Labs demo Devin, a prototype of a fully autonomous software engineer agent.",
      },
      korean: {
        headline: createLink(
          "https://x.com/cognition_labs/status/1767548763134964000",
          "Devin"
        ),
        text: "스타트업 Cognition Labs는 완전 자율 소프트웨어 엔지니어 에이전트 프로토타입 Devin을 시연했습니다.",
      },
      importance: 2,
      category: CATEGORIES.BUSINESS,
    },
    {
      start_date: { year: "2024", month: "04", day: "11" },
      text: {
        headline: createLink(
          "https://cybernews.com/news/openai-researchers-leaking-information/",
          "OpenAI fires leakers"
        ),
        text: 'Leopold Aschenbrenner and Pavel Izmailov, two researchers from the superalignment team, are fired for "leaking".',
      },
      korean: {
        headline: createLink(
          "https://cybernews.com/news/openai-researchers-leaking-information/",
          "OpenAI, 정보 유출자 해고"
        ),
        text: "슈퍼얼라인먼트 팀의 연구원 레오폴드 아셴브레너와 파벨 이즈마일로프가 정보 유출 혐의로 해고되었습니다.",
      },
      importance: 1,
      category: CATEGORIES.BUSINESS,
    },
    {
      start_date: { year: "2024", month: "04", day: "18" },
      text: {
        headline: createLink(
          "https://ai.meta.com/blog/meta-llama-3/",
          "LLaMA 3.0"
        ),
        text: "Meta releases and open-sources the LLaMA 3.0 series of models.",
      },
      korean: {
        headline: createLink(
          "https://ai.meta.com/blog/meta-llama-3/",
          "LLaMA 3.0"
        ),
        text: "메타는 LLaMA 3.0 시리즈 모델을 공개하고 오픈소스로 제공했습니다.",
      },
      importance: 1,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2024", month: "05", day: "13" },
      text: {
        headline: createLink(
          "https://openai.com/index/hello-gpt-4o/",
          "GPT-4o"
        ),
        text: "The first omni-model trained natively on text, image, and audio.",
      },
      korean: {
        headline: createLink(
          "https://openai.com/index/hello-gpt-4o/",
          "GPT-4o"
        ),
        text: "텍스트, 이미지, 오디오를 기본적으로 학습한 최초의 옴니 모델입니다.",
      },
      importance: 2.5,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2024", month: "05", day: "14" },
      text: {
        headline: createLink(
          "https://x.com/ilyasut/status/1790517455628198322",
          "Ilya quits OpenAI"
        ),
        text: "Ilya Sutskever, founder of OpenAI, quits after months of silence, originating from the Board dispute.",
      },
      korean: {
        headline: createLink(
          "https://x.com/ilyasut/status/1790517455628198322",
          "일리아, OpenAI 퇴사"
        ),
        text: "OpenAI 공동창립자 일리아 수츠케버가 이사회 논란 이후 몇 달간의 침묵 끝에 퇴사했습니다.",
      },
      importance: 1,
      category: CATEGORIES.BUSINESS,
    },
    {
      start_date: { year: "2024", month: "05", day: "21" },
      text: {
        headline: createLink(
          "https://www.europarl.europa.eu/news/en/press-room/20240308IPR19015/artificial-intelligence-act-meps-adopt-landmark-law",
          "EU AI Act"
        ),
        text: "The EU AI Act is voted into law after contentious debates.",
      },
      korean: {
        headline: createLink(
          "https://www.europarl.europa.eu/news/en/press-room/20240308IPR19015/artificial-intelligence-act-meps-adopt-landmark-law",
          "EU AI 법"
        ),
        text: "논쟁 끝에 EU AI 법이 최종적으로 법률로 제정되었습니다.",
      },
      importance: 2,
      category: CATEGORIES.POLICY,
    },
    {
      start_date: { year: "2024", month: "06", day: "04" },
      text: {
        headline: createLink(
          "https://situational-awareness.ai/",
          "Situational Awareness"
        ),
        text: "Leopold Aschenbrenner publishes a contentious and influential essay series, claiming that AGI will arrive sooner than people think and is likely to be nationalized.",
      },
      korean: {
        headline: createLink("https://situational-awareness.ai/", "상황 인식"),
        text: "레오폴드 아셴브레너는 논쟁적인 에세이 시리즈를 발표하며, AGI가 예상보다 빨리 도달하고 국유화될 가능성이 높다고 주장했습니다.",
      },
      importance: 3,
      category: CATEGORIES.CULTURE,
    },
    {
      start_date: { year: "2024", month: "06", day: "19" },
      text: {
        headline: createLink(
          "https://x.com/ilyasut/status/1803472978753303014",
          "SSI founded"
        ),
        text: "Ilya Sutskever starts a new lab called Safe Superintelligence Inc, which pledges to only have one product: safe superintelligence.",
      },
      korean: {
        headline: createLink(
          "https://x.com/ilyasut/status/1803472978753303014",
          "SSI 설립"
        ),
        text: "일리아 수츠케버는 안전한 초지능만을 목표로 하는 Safe Superintelligence Inc.를 설립했습니다.",
      },
      importance: 3,
      category: CATEGORIES.BUSINESS,
    },
    {
      start_date: { year: "2024", month: "06", day: "20" },
      text: {
        headline: createLink(
          "https://www.anthropic.com/news/claude-3-5-sonnet",
          "Claude 3.5 Sonnet"
        ),
        text: "Anthropic releases Claude 3.5 Sonnet, which would become a fan favorite and was later called 'Berkeley's most eligible bachelor'.",
      },
      korean: {
        headline: createLink(
          "https://www.anthropic.com/news/claude-3-5-sonnet",
          "Claude 3.5 Sonnet"
        ),
        text: "Anthropic은 Claude 3.5 Sonnet을 공개했습니다. 이 모델은 큰 인기를 끌며 '버클리 최고의 총각'이라는 별칭을 얻었습니다.",
      },
      importance: 3,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2024", month: "08", day: "23" },
      text: {
        headline: createLink(
          "https://x.com/karpathy/status/1827143768459637073",
          "Cursor"
        ),
        text: "After a viral tweet by Andrej Karpathy, the Cursor AI Code Editor explodes in popularity among developers.",
      },
      korean: {
        headline: createLink(
          "https://x.com/karpathy/status/1827143768459637073",
          "Cursor"
        ),
        text: "안드레이 카르파티의 바이럴 트윗 이후, Cursor AI 코드 편집기가 개발자들 사이에서 폭발적인 인기를 얻었습니다.",
      },
      importance: 1,
      category: CATEGORIES.BUSINESS,
    },
    {
      start_date: { year: "2024", month: "08", day: "24" },
      text: {
        headline: createLink("https://x.ai/news/grok-2", "Grok 2"),
        text: "xAI release Grok 2, the next iteration of their frontier model. While not state-of-the-art, it showcased how fast xAI could move to catch up, despite starting from behind.",
      },
      korean: {
        headline: createLink("https://x.ai/news/grok-2", "Grok 2"),
        text: "xAI는 차세대 프론티어 모델 Grok 2를 공개했습니다. 최첨단은 아니었지만, xAI가 뒤처진 출발에도 불구하고 빠르게 따라잡는 능력을 보여주었습니다.",
      },
      importance: 1,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2024", month: "09", day: "02" },
      text: {
        headline: createLink(
          "https://x.com/elonmusk/status/1830650370336473253",
          "xAI Colossus"
        ),
        text: "xAI launches Colossus, the world's most powerful AI training system at the time with a cluster of 100,000 H100 GPUs. Taking only 19 days from the arrival of the first hardware rack to the commencement of training operations, the speed with which xAI built the cluster spooked other AI labs.",
      },
      korean: {
        headline: createLink(
          "https://x.com/elonmusk/status/1830650370336473253",
          "xAI Colossus"
        ),
        text: "xAI는 10만 개의 H100 GPU 클러스터로 구성된 당시 세계 최강의 AI 훈련 시스템 Colossus를 공개했습니다. 첫 하드웨어 랙 도착부터 훈련 시작까지 단 19일이 걸린 속도는 다른 AI 연구소들을 놀라게 했습니다.",
      },
      importance: 1,
      category: CATEGORIES.BUSINESS,
    },
    {
      start_date: { year: "2024", month: "09", day: "12" },
      text: {
        headline: createLink(
          "https://openai.com/index/introducing-openai-o1-preview/",
          "o1-preview"
        ),
        text: "OpenAI releases o1-preview, introducing the inference-time scaling paradigm.",
      },
      korean: {
        headline: createLink(
          "https://openai.com/index/introducing-openai-o1-preview/",
          "o1-미리보기"
        ),
        text: "OpenAI는 추론 시간 확장 패러다임을 도입한 o1-미리보기를 공개했습니다.",
      },
      importance: 2,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2024", month: "09", day: "25" },
      text: {
        headline: createLink(
          "https://x.com/miramurati/status/1839025700009030027",
          "Murati quits"
        ),
        text: "OpenAI's CTO Mira Murati departs the company.",
      },
      korean: {
        headline: createLink(
          "https://x.com/miramurati/status/1839025700009030027",
          "무라티 퇴사"
        ),
        text: "OpenAI의 CTO 미라 무라티가 회사를 떠났습니다.",
      },
      importance: 1.5,
      category: CATEGORIES.BUSINESS,
    },
    {
      start_date: { year: "2024", month: "09", day: "29" },
      text: {
        headline: createLink(
          "https://www.gov.ca.gov/wp-content/uploads/2024/09/SB-1047-Veto-Message.pdf",
          "SB1047 Vetoed"
        ),
        text: "Governor Gavin Newsom vetoes California senate bill 1047, which sparked lots of vitriolic debate between AI safety and accelerationist crowds and became one of the main stories of 2024.",
      },
      korean: {
        headline: createLink(
          "https://www.gov.ca.gov/wp-content/uploads/2024/09/SB-1047-Veto-Message.pdf",
          "SB1047 거부권 행사"
        ),
        text: "개빈 뉴섬 캘리포니아 주지사는 AI 안전론자와 가속주의자 간 치열한 논쟁을 불러일으킨 상원 법안 SB1047에 거부권을 행사했습니다. 이는 2024년 주요 뉴스 중 하나였습니다.",
      },
      importance: 2,
      category: CATEGORIES.POLICY,
    },
    {
      start_date: { year: "2024", month: "10", day: "08" },
      text: {
        headline: createLink("", "Hinton/Hassabis Nobel Prizes"),
        text: "In a surpise to everyone, Geoffrey Hinton (along with John Hopfield) is awarded the Nobel Prize in Physics for their early work on neural networks. A few days later, Demis Hassabis (along with John Jumper) is awarded the Nobel Prize in Chemistry for their work on AlphaFold.",
      },
      korean: {
        headline: createLink("", "힌튼/하사비스 노벨상 수상"),
        text: "모두를 놀라게 하며, 제프리 힌튼과 존 홉필드가 신경망 초기 연구로 노벨 물리학상을 수상했습니다. 며칠 뒤, 데미스 하사비스와 존 점퍼는 AlphaFold 연구로 노벨 화학상을 받았습니다.",
      },
      importance: 1,
      category: CATEGORIES.CULTURE,
    },
    {
      start_date: { year: "2024", month: "10", day: "11" },
      text: {
        headline: createLink(
          "https://darioamodei.com/machines-of-loving-grace",
          "Machines of Loving Grace"
        ),
        text: "Anthropic CEO Dario Amodei publishes an influential blogpost exploring what the 5 years immediately following AGI might look like.",
      },
      korean: {
        headline: createLink(
          "https://darioamodei.com/machines-of-loving-grace",
          "사랑스러운 은총의 기계들"
        ),
        text: "Anthropic CEO 다리오 아모데이는 AGI 도달 직후 5년의 미래를 탐구하는 영향력 있는 블로그 포스트를 발표했습니다.",
      },
      importance: 2,
      category: CATEGORIES.CULTURE,
    },
    {
      start_date: { year: "2024", month: "10", day: "22" },
      text: {
        headline: createLink(
          "https://www.anthropic.com/news/3-5-models-and-computer-use",
          "Claude Computer Use"
        ),
        text: "Claude gains the ability to use computer interfaces. Anthropic also releases Claude 3.5 Haiku and an updated version of Claude 3.5 Sonnet.",
      },
      korean: {
        headline: createLink(
          "https://www.anthropic.com/news/3-5-models-and-computer-use",
          "Claude 컴퓨터 사용 기능"
        ),
        text: "Claude가 컴퓨터 인터페이스를 활용할 수 있는 기능을 갖추었습니다. Anthropic은 또한 Claude 3.5 Haiku와 업데이트된 Claude 3.5 Sonnet을 공개했습니다.",
      },
      importance: 2,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2024", month: "11", day: "01" },
      text: {
        headline: createLink(
          "https://www.nytimes.com/2024/11/01/us/politics/trump-2024-election.html",
          "Trump elected"
        ),
        text: "Donald Trump wins the 2024 election with the vocal support of Elon Musk.",
      },
      korean: {
        headline: createLink(
          "https://www.nytimes.com/2024/11/01/us/politics/trump-2024-election.html",
          "트럼프 당선"
        ),
        text: "도널드 트럼프가 일론 머스크의 강력한 지지 속에서 2024년 대선에서 승리했습니다.",
      },
      importance: 2,
      category: CATEGORIES.POLICY,
    },
    {
      start_date: { year: "2024", month: "11", day: "19" },
      text: {
        headline: createLink(
          "https://www.reuters.com/technology/artificial-intelligence/us-government-commission-pushes-manhattan-project-style-ai-initiative-2024-11-19/",
          "China Commission"
        ),
        text: "The US-China Economic and Security Review Commission calls for a Manhattan Project-style initiative for AGI development.",
      },
      korean: {
        headline: createLink(
          "https://www.reuters.com/technology/artificial-intelligence/us-government-commission-pushes-manhattan-project-style-ai-initiative-2024-11-19/",
          "미중 위원회"
        ),
        text: "미중 경제안보검토위원회는 AGI 개발을 위한 맨해튼 프로젝트와 같은 대규모 계획을 제안했습니다.",
      },
      importance: 1,
      category: CATEGORIES.POLICY,
    },
    {
      start_date: { year: "2024", month: "12", day: "04" },
      text: {
        headline: createLink(
          "https://thehill.com/policy/technology/5026959-venture-capitalist-david-sacks-white-house/",
          "David Sacks is AI Czar"
        ),
        text: 'President-elect Donald Trump appoints venture capitalist David Sacks as the "White House AI and Crypto Czar" to oversee regulation of artificial intelligence and cryptocurrency.',
      },
      korean: {
        headline: createLink(
          "https://thehill.com/policy/technology/5026959-venture-capitalist-david-sacks-white-house/",
          "데이비드 색스, AI 차르로 임명"
        ),
        text: "도널드 트럼프 대통령 당선인은 벤처 투자자 데이비드 삭스를 '백악관 AI 및 암호화폐 차르'로 임명하여 인공지능과 암호화폐 규제를 총괄하도록 했습니다.",
      },
      importance: 1.5,
      category: CATEGORIES.POLICY,
    },
    {
      start_date: { year: "2024", month: "12", day: "11" },
      text: {
        headline: createLink(
          "https://blog.google/products/gemini/google-gemini-ai-collection-2024/",
          "Gemini 2.0"
        ),
        text: "Google announces their Gemini 2.0 models",
      },
      korean: {
        headline: createLink(
          "https://blog.google/products/gemini/google-gemini-ai-collection-2024/",
          "Gemini 2.0"
        ),
        text: "구글이 Gemini 2.0 모델을 발표했습니다.",
      },
      importance: 2,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2024", month: "12", day: "16" },
      text: {
        headline: createLink(
          "https://deepmind.google/technologies/veo/veo-2/",
          "Veo 2"
        ),
        text: "Google unveils Veo 2, a video generation model with a shocking jump in coherence over previous models.",
      },
      korean: {
        headline: createLink(
          "https://deepmind.google/technologies/veo/veo-2/",
          "Veo 2"
        ),
        text: "구글은 이전 모델 대비 일관성이 크게 향상된 비디오 생성 모델 Veo 2를 공개했습니다.",
      },
      importance: 2,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2024", month: "12", day: "20" },
      text: {
        headline: createLink("https://openai.com/12-days/", "o3 evals"),
        text: "On the 12th day of '12 Days of OpenAI', OpenAI releases benchmark results for o3, shocking the world. The model achieves a breakthrough score of 87.5% on the <a href=\"https://arcprize.org/blog/oai-o3-pub-breakthrough\">ARC-AGI benchmark</a>, suggesting AGI may be nearer than many skeptics believed.",
      },
      korean: {
        headline: createLink("https://openai.com/12-days/", "o3 평가 결과"),
        text: "'12 Days of OpenAI' 행사의 12일째 되는 날, OpenAI가 o3 모델의 벤치마크 결과를 발표하며 전 세계를 놀라게 했습니다. 이 모델은 <a href=\"https://arcprize.org/blog/oai-o3-pub-breakthrough\">ARC-AGI 벤치마크</a>에서 87.5%라는 획기적인 점수를 기록하며, AGI가 많은 회의론자들이 생각했던 것보다 가까이 있을 가능성을 시사했습니다.",
      },
      importance: 2,
      category: CATEGORIES.RESEARCH,
    },
    {
      start_date: { year: "2024", month: "12", day: "26" },
      text: {
        headline: createLink("https://arxiv.org/abs/2412.19437", "DeepSeek v3"),
        text: "Chinese lab DeepSeek stuns with the release of DeepSeek v3, a 671-billion parameter open-source model that shows strong performance at a shockingly low cost.",
      },
      korean: {
        headline: createLink("https://arxiv.org/abs/2412.19437", "DeepSeek v3"),
        text: "중국 연구소 DeepSeek이 6710억 개 파라미터를 가진 오픈소스 모델 DeepSeek v3를 공개하였습니다. 이 모델은 굉장히 저렴한 비용으로 뛰어난 성능을 발휘했습니다.",
      },
      importance: 2,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2025", month: "01", day: "20" },
      text: {
        headline: createLink(
          "https://api-docs.deepseek.com/news/news250120",
          "DeepSeek R1"
        ),
        text: "DeepSeek releases and open-sources R1, their reasoning model that shows competitive performance with state-of-the-art Western models.",
      },
      korean: {
        headline: createLink(
          "https://api-docs.deepseek.com/news/news250120",
          "DeepSeek R1"
        ),
        text: "DeepSeek이 서구의 최첨단 모델들과 경쟁할 수 있는 성능을 가진 추론 모델 R1을 출시하고 오픈소스로 공개했습니다.",
      },
      importance: 2,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2025", month: "01", day: "21" },
      text: {
        headline: createLink(
          "https://openai.com/index/announcing-the-stargate-project/",
          "Stargate Project"
        ),
        text: "Donald Trump announces the Stargate Project, a $500 billionaire private partnership between SoftBank, OpenAI, Oracle, and MGX to develop datacenters in the US.",
      },
      korean: {
        headline: createLink(
          "https://openai.com/index/announcing-the-stargate-project/",
          "스타게이트 프로젝트"
        ),
        text: "도널드 트럼프가 소프트뱅크, OpenAI, 오라클, MGX와 함께 5000억 달러 규모의 민간 파트너십인 스타게이트 프로젝트를 발표하며 미국 내 데이터센터 개발 계획을 밝혔습니다.",
      },
      importance: 2,
      category: CATEGORIES.BUSINESS,
    },
    {
      start_date: { year: "2025", month: "01", day: "23" },
      text: {
        headline: createLink(
          "https://openai.com/index/introducing-operator/",
          "Operator"
        ),
        text: "OpenAI introduces Operator, a computer use agent that can autonomously navigate the web.",
      },
      korean: {
        headline: createLink(
          "https://openai.com/index/introducing-operator/",
          "Operator"
        ),
        text: "OpenAI가 웹을 자율적으로 탐색할 수 있는 컴퓨터 사용 에이전트 Operator를 공개했습니다.",
      },
      importance: 2,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2025", month: "01", day: "27" },
      text: {
        headline: createLink(
          "https://nymag.com/intelligencer/article/deepseek-r1-ai-panic-impact-commentary-analysis.html",
          "DeepSeek Panic"
        ),
        text: "A week after the release of their R1 model, the West experiences a major panic over DeepSeek. Chip stocks crash overnight and the DeepSeek app rises to number one on the App Store. In a matter of days, the little-known Chinese AGI lab becomes a household name in the US.",
      },
      korean: {
        headline: createLink(
          "https://nymag.com/intelligencer/article/deepseek-r1-ai-panic-impact-commentary-analysis.html",
          "DeepSeek 공황"
        ),
        text: "R1 모델 출시 일주일 만에 서구에서는 DeepSeek을 둘러싼 대규모 공황이 발생했습니다. 반도체 주식이 하룻밤 사이에 폭락하고 DeepSeek 앱은 앱스토어 1위에 올랐습니다. 며칠 만에 잘 알려지지 않았던 중국 AGI 연구소가 유명세를 탔습니다.",
      },
      importance: 2,
      category: CATEGORIES.CULTURE,
    },
    {
      start_date: { year: "2025", month: "02", day: "02" },
      text: {
        headline: createLink(
          "https://openai.com/index/introducing-deep-research/",
          "Deep Research"
        ),
        text: "OpenAI unveils an agent called Deep Research that can go off and write 10-page research reports using repeated web searches.",
      },
      korean: {
        headline: createLink(
          "https://openai.com/index/introducing-deep-research/",
          "Deep Research"
        ),
        text: "OpenAI가 반복적인 웹 검색을 통해 10페이지 분량의 연구 보고서를 작성할 수 있는 Deep Research 에이전트를 공개했습니다.",
      },
      importance: 2,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2025", month: "02", day: "18" },
      text: {
        headline: createLink(
          "https://x.com/thinkymachines/status/1891919141151572094",
          "Thinking Machines Lab"
        ),
        text: "Key ex-OpenAI figures including Mira Murati and John Schulman found Thinking Machines Lab, a new AI lab focused on human-AI collaboration, personalizability, and open science.",
      },
      korean: {
        headline: createLink(
          "https://x.com/thinkymachines/status/1891919141151572094",
          "Thinking Machines Lab"
        ),
        text: "미라 무라티와 존 슐먼 등 전 OpenAI 핵심 인사들이 인간-AI 협업, 개인화, 개방형 과학에 초점을 맞춘 새로운 AI 연구소 Thinking Machines Lab을 설립했습니다.",
      },
      importance: 3,
      category: CATEGORIES.BUSINESS,
    },
    {
      start_date: { year: "2025", month: "02", day: "19" },
      text: {
        headline: createLink("https://x.ai/blog/grok-3", "Grok 3"),
        text: "xAI releases Grok 3, a state-of-the-art model with extended reasoning and a Deep Search feature. The release impressed many, showing that xAI was a strong contender in the race to build AGI.",
      },
      korean: {
        headline: createLink("https://x.ai/blog/grok-3", "Grok 3"),
        text: "xAI가 확장된 추론 능력과 Deep Search 기능을 갖춘 최첨단 모델 Grok 3를 출시했습니다. 이번 출시는 xAI가 AGI 개발 경쟁에서 강력한 경쟁자임을 입증하며 많은 이들에게 깊은 인상을 남겼습니다.",
      },
      importance: 2,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2025", month: "02", day: "24" },
      text: {
        headline: createLink(
          "https://www.anthropic.com/news/claude-3-7-sonnet",
          "Claude 3.7 Sonnet"
        ),
        text: "Anthropic releases Claude 3.7 Sonnet, their first model with extended thinking ability and improved performance on math and code benchmarks. For fun, they also showcase its out-of-distribution ability to progress through a Pokemon video game. In addition, they release Claude Code, a powerful agentic coding tool.",
      },
      korean: {
        headline: createLink(
          "https://www.anthropic.com/news/claude-3-7-sonnet",
          "Claude 3.7 Sonnet"
        ),
        text: "Anthropic이 확장된 사고 능력과 수학 및 코드 벤치마크에서 향상된 성능을 자랑하는 최초의 모델 Claude 3.7 Sonnet을 출시했습니다. 포켓몬 비디오 게임을 진행할 수 있는 비분포적 능력도 선보였습니다. 또한 강력한 에이전트 코딩 도구 Claude Code도 함께 공개했습니다.",
      },
      importance: 2,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2025", month: "02", day: "27" },
      text: {
        headline: createLink(
          "https://openai.com/index/introducing-gpt-4-5/",
          "GPT-4.5"
        ),
        text: "OpenAI releases GPT-4.5, their largest pretrained model and last non-reasoner. Despite not demonstrating large gains on benchmarks, the model was touted for its 'vibes' and more personable responses.",
      },
      korean: {
        headline: createLink(
          "https://openai.com/index/introducing-gpt-4-5/",
          "GPT-4.5"
        ),
        text: "OpenAI가 가장 큰 사전 훈련 모델이자 마지막 비추론 모델인 GPT-4.5를 출시했습니다. 벤치마크에서 큰 성능 향상은 없었지만, 독특한 '분위기'와 더 인간적인 반응으로 주목받았습니다.",
      },
      importance: 2,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2025", month: "03", day: "05" },
      text: {
        headline: createLink("https://www.nationalsecurity.ai/", "MAIM"),
        text: 'Dan Hendrycks, Eric Schmidt, and Alexandr Wang release a report titled "Superintelligence Strategy" presenting a path to navigate the geopolitics of strong AI and introducing the term "Mutually Assured AI Malfunction" (MAIM).',
      },
      korean: {
        headline: createLink("https://www.nationalsecurity.ai/", "MAIM"),
        text: "댄 헨드릭스, 에릭 슈미트, 알렉산드르 왕이 '초지능 전략' 보고서를 발표하며 강력한 AI의 지정학적 문제를 다루는 방안을 제시하고 '상호 확증 AI 오작동'(MAIM)이라는 용어를 도입했습니다.",
      },
      importance: 1,
      category: CATEGORIES.POLICY,
    },
    {
      start_date: { year: "2025", month: "03", day: "05" },
      text: {
        headline: createLink(
          "https://x.com/ManusAI_HQ/status/1897294098945728752",
          "Manus"
        ),
        text: "An LLM agent called Manus is launched by a Chinese company and shows SOTA performance on benchmarks like GAIA. It goes viral in the West, in part due to fears over Chinese AI.",
      },
      korean: {
        headline: createLink(
          "https://x.com/ManusAI_HQ/status/1897294098945728752",
          "Manus"
        ),
        text: "중국 기업이 출시한 LLM 에이전트 Manus가 GAIA 같은 벤치마크에서 최첨단 성능을 보여줍니다. 중국 AI에 대한 우려로 인해 서구에서 바이럴로 퍼졌습니다.",
      },
      importance: 1,
      category: CATEGORIES.BUSINESS,
    },
    {
      start_date: { year: "2025", month: "03", day: "25" },
      text: {
        headline: createLink(
          "https://blog.google/technology/google-deepmind/gemini-model-thinking-updates-march-2025/",
          "Gemini 2.5 Pro"
        ),
        text: "Google release Gemini 2.5 Pro, their most capable model yet and topping many common benchmarks.",
      },
      korean: {
        headline: createLink(
          "https://blog.google/technology/google-deepmind/gemini-model-thinking-updates-march-2025/",
          "Gemini 2.5 Pro"
        ),
        text: "구글이 Gemini 2.5 Pro를 출시하였습니다. 이는 현재까지 가장 강력한 모델 중 하나로, 여러 벤치마크에서 우수한 성능을 보여주고 있습니다.",
      },
      importance: 2,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2025", month: "03", day: "25" },
      text: {
        headline: createLink(
          "https://openai.com/index/introducing-4o-image-generation/",
          "GPT-4o Image Generation"
        ),
        text: "OpenAI release GPT-4o's native image generation capabilities, further pushing the frontier of image generation. As a result, Twitter becomes flooded with images in the style of studio ghibli.",
      },
      korean: {
        headline: createLink(
          "https://openai.com/index/introducing-4o-image-generation/",
          "GPT-4o 이미지 생성"
        ),
        text: "OpenAI가 GPT-4o의 기본 이미지 생성 기능을 출시하며 이미지 생성 기술의 한계를 넓혔습니다. 그 결과, 트위터는 스튜디오 지브리 스타일의 이미지로 가득 찼습니다.",
      },
      importance: 2,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2025", month: "04", day: "16" },
      text: {
        headline: createLink(
          "https://openai.com/index/introducing-o3-and-o4-mini/",
          "o3 and o4-mini"
        ),
        text: "OpenAI releases o3 and o4-mini. o3 and o4-mini are trained to have agentic reasoning capabilities.",
      },
      korean: {
        headline: createLink(
          "https://openai.com/index/introducing-o3-and-o4-mini/",
          "o3 and o4-mini"
        ),
        text: "OpenAI가 o3와 o4-mini를 출시했습니다. 에이전틱 추론 능력을 갖추도록 훈련되었습니다.",
      },
      importance: 3,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2025", month: "05", day: "20" },
      text: {
        headline: createLink(
          "https://mashable.com/article/google-veo-3-ai-video",
          "Veo 3"
        ),
        text: "As part of Google I/O, Google reveal Veo 3, a state-of-the-art video generator that now includes audio.",
      },
      korean: {
        headline: createLink(
          "https://mashable.com/article/google-veo-3-ai-video",
          "Veo 3"
        ),
        text: "Google I/O 행사에서 구글은 오디오를 포함한 최첨단 비디오 생성 모델 Veo 3를 공개했습니다.",
      },
      importance: 2,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2025", month: "05", day: "22" },
      text: {
        headline: createLink(
          "https://www.anthropic.com/news/claude-4",
          "Claude 4"
        ),
        text: "Anthropic release Claude Sonnet 4 and Claude Opus 4, which are state-of-the-art. This launched marked Anthropic's first model to achieve achieve ASL-3.",
      },
      korean: {
        headline: createLink(
          "https://www.anthropic.com/news/claude-4",
          "Claude 4"
        ),
        text: "Anthropic이 최첨단 모델인 Claude Sonnet 4와 Claude Opus 4를 출시했습니다. 이번 출시는 Anthropic의 첫 ASL-3 등급 모델 달성을 기념하는 순간이었습니다.",
      },
      importance: 3,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2025", month: "06", day: "10" },
      text: {
        headline: createLink(
          "https://help.openai.com/en/articles/9624314-model-release-notes",
          "o3 pro"
        ),
        text: "OpenAI releases o3-pro. o3-pro is designed to think longer and provide the most reliable responses. It is currently one of the most powerful models.",
      },
      korean: {
        headline: createLink(
          "https://help.openai.com/en/articles/9624314-model-release-notes",
          "o3 pro"
        ),
        text: "OpenAI가 o3-pro를 출시했습니다. 이 모델은 더 오래 생각하고 가장 안정적인 응답을 제공하도록 설계되었습니다. 또한, 현재까지 가장 강력한 모델 중 하나로 평가받고 있습니다.",
      },
      importance: 3,
      category: CATEGORIES.MODEL_RELEASE,
    },
    {
      start_date: { year: "2025", month: "07", day: "10" },
      text: {
        headline: createLink(
          "https://x.ai/news/grok-4",
          "Grok 4"
        ),
        text: "xAI releases Grok 4, showing state-of-the-art performance across multiple benchmarks, with particularly significant improvements in HLE benchmark performance."
      },
      korean: {
        headline: createLink(
          "https://x.ai/news/grok-4",
          "Grok 4"
        ),
        text: "xAI가 Grok 4를 출시했습니다. 여러 벤치마크에서 최첨단 성능을 보여주고 있으며, 특히 HLE 벤치마크의 성능이 크게 향상되었습니다.",
      },
      importance: 3,
      category: CATEGORIES.MODEL_RELEASE,
    }
  ],
};

function createLink(url: string, text: string) {
  return {
    url,
    text,
  };
}
