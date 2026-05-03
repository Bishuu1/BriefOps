import type { PipelineStep, Radar, Signal, Source } from "@shared/models/domain";
import { calculateSignalScore } from "@shared/utils/score";
import { daysAgo } from "@shared/utils/date";

export const demoUserId = "demo-user";

export function createSeedRadar(userId: string): Radar {
  const now = new Date().toISOString();

  return {
    id: `${userId}-ai-builder-radar`,
    userId,
    name: "AI Builder Radar",
    profile: "Developer / AI Engineer",
    goal: "Encontrar herramientas para probar",
    level: "Avanzado",
    interests: [
      "AI agents",
      "Vercel AI SDK",
      "Vercel Workflows",
      "MCP",
      "Coding agents",
      "LLM evaluation",
      "RAG",
      "OpenAI / Anthropic / Google model updates",
      "Developer tools",
      "Agentic workflows"
    ],
    avoidTopics: ["crypto hype", "duplicate launch posts", "beginner-only tutorials"],
    outputTypes: ["Resumen tecnico", "Plan de accion", "Checklist de prueba"],
    onboardingCompleted: false,
    createdAt: now,
    updatedAt: now
  };
}

export function createSeedSources(userId: string, radarId: string): Source[] {
  return [
    {
      id: `${radarId}-vercel-changelog`,
      userId,
      radarId,
      name: "Vercel Changelog",
      url: "https://vercel.com/changelog",
      type: "Changelog",
      suggestedFrequency: "Daily",
      trustScore: 94,
      lastCheckedAt: daysAgo(1),
      lastError: null,
      status: "activa"
    },
    {
      id: `${radarId}-ai-sdk-docs`,
      userId,
      radarId,
      name: "Vercel AI SDK Docs",
      url: "https://sdk.vercel.ai/docs",
      type: "Docs oficiales",
      suggestedFrequency: "Twice weekly",
      trustScore: 96,
      lastCheckedAt: daysAgo(2),
      lastError: null,
      status: "activa"
    },
    {
      id: `${radarId}-openai-blog`,
      userId,
      radarId,
      name: "OpenAI Blog",
      url: "https://openai.com/news/",
      type: "Blog",
      suggestedFrequency: "Daily",
      trustScore: 93,
      lastCheckedAt: daysAgo(1),
      lastError: null,
      status: "activa"
    },
    {
      id: `${radarId}-anthropic-news`,
      userId,
      radarId,
      name: "Anthropic News",
      url: "https://www.anthropic.com/news",
      type: "Blog",
      suggestedFrequency: "Daily",
      trustScore: 92,
      lastCheckedAt: daysAgo(3),
      lastError: null,
      status: "activa"
    },
    {
      id: `${radarId}-langgraph-releases`,
      userId,
      radarId,
      name: "LangGraph Releases",
      url: "https://github.com/langchain-ai/langgraph",
      type: "GitHub repo releases",
      suggestedFrequency: "Daily",
      trustScore: 88,
      lastCheckedAt: daysAgo(1),
      lastError: null,
      status: "activa"
    },
    {
      id: `${radarId}-agent-papers`,
      userId,
      radarId,
      name: "Recent Agent Papers",
      url: "https://arxiv.org/list/cs.AI/recent",
      type: "Paper / arXiv",
      suggestedFrequency: "Weekly",
      trustScore: 82,
      lastCheckedAt: daysAgo(4),
      lastError: "Paused for beta: arXiv ingestion will be connected after source quality checks.",
      status: "pausada"
    }
  ];
}

export function createSeedSignals(userId: string, radarId: string, sources: Source[]): Signal[] {
  const byName = new Map(sources.map((source) => [source.name, source]));
  const makeSignal = (signal: Omit<Signal, "signalScore" | "userId" | "radarId">): Signal => ({
    ...signal,
    userId,
    radarId,
    signalScore: calculateSignalScore(signal.scores)
  });

  const workflowSource = byName.get("Vercel Changelog") ?? sources[0];
  const aiSdkSource = byName.get("Vercel AI SDK Docs") ?? sources[0];
  const openAiSource = byName.get("OpenAI Blog") ?? sources[0];
  const langGraphSource = byName.get("LangGraph Releases") ?? sources[0];

  return [
    makeSignal({
      id: `${radarId}-signal-workflows`,
      sourceId: workflowSource.id,
      sourceName: workflowSource.name,
      sourceUrl: workflowSource.url,
      title: "Vercel Workflows makes durable agent steps production-ready",
      publishedAt: daysAgo(0),
      type: "Release",
      status: "Nuevo",
      summary:
        "Vercel Workflows introduces durable async steps, retries, and observability for long-running agent tasks. It maps cleanly to collect-classify-act pipelines. This is directly relevant for agent builders moving past cron scripts.",
      whyItMatters:
        "High impact because it changes how builders can ship resilient agent workflows without managing queues and replay state themselves.",
      recommendedAction:
        "Run a two-hour spike: model BriefOps radar execution as a workflow with collect, classify, score, and action-generation steps.",
      scoreExplanation:
        "High relevance and impact because durable execution is central to agentic workflows; high actionability because it can be tested in a small spike.",
      scores: {
        relevance: 96,
        novelty: 84,
        impact: 91,
        actionability: 89,
        urgency: 76,
        confidence: 88
      },
      citations: [{ label: workflowSource.name, url: workflowSource.url }],
      tags: ["Vercel", "Workflows", "Agents"]
    }),
    makeSignal({
      id: `${radarId}-signal-ai-sdk`,
      sourceId: aiSdkSource.id,
      sourceName: aiSdkSource.name,
      sourceUrl: aiSdkSource.url,
      title: "AI SDK structured outputs reduce brittle JSON parsing",
      publishedAt: daysAgo(1),
      type: "Changelog",
      status: "Guardado",
      summary:
        "Structured outputs with schemas make model responses safer to consume. The pattern fits signal classification, scoring, and action generation. It removes a common source of demo and production failures.",
      whyItMatters:
        "BriefOps depends on trusted classifications and scores; schema validation gives the UI reliable fields instead of best-effort text.",
      recommendedAction:
        "Use Zod schemas for Signal Card generation and keep score calculation deterministic outside the model.",
      scoreExplanation:
        "Strong relevance and confidence because it maps exactly to the BriefOps signal pipeline and lowers implementation risk.",
      scores: {
        relevance: 94,
        novelty: 69,
        impact: 85,
        actionability: 94,
        urgency: 70,
        confidence: 91
      },
      citations: [{ label: aiSdkSource.name, url: aiSdkSource.url }],
      tags: ["AI SDK", "Structured outputs", "Zod"]
    }),
    makeSignal({
      id: `${radarId}-signal-model`,
      sourceId: openAiSource.id,
      sourceName: openAiSource.name,
      sourceUrl: openAiSource.url,
      title: "Model updates shift the baseline for coding-agent evaluation",
      publishedAt: daysAgo(2),
      type: "New model",
      status: "Nuevo",
      summary:
        "A new model release improves tool use and coding reliability. Existing evals may no longer represent the current frontier. Builders should re-run task suites before changing defaults.",
      whyItMatters:
        "Model upgrades can make existing agent stacks cheaper or more capable, but only if tested against your own workflows.",
      recommendedAction:
        "Create a small eval set from real coding-agent tasks and compare current default model against the new candidate.",
      scoreExplanation:
        "High impact with medium urgency: useful soon, but it should go through evals before becoming a default.",
      scores: {
        relevance: 88,
        novelty: 78,
        impact: 86,
        actionability: 74,
        urgency: 65,
        confidence: 76
      },
      citations: [{ label: openAiSource.name, url: openAiSource.url }],
      tags: ["Models", "Evals", "Coding agents"]
    }),
    makeSignal({
      id: `${radarId}-signal-langgraph`,
      sourceId: langGraphSource.id,
      sourceName: langGraphSource.name,
      sourceUrl: langGraphSource.url,
      title: "LangGraph release adds ergonomics for multi-step agent state",
      publishedAt: daysAgo(3),
      type: "GitHub release",
      status: "Leido",
      summary:
        "A framework release improves state handling and graph ergonomics. It matters for teams with complex agent orchestration. It is less urgent if your current pipeline is mostly linear.",
      whyItMatters:
        "Useful for teams building branching agent workflows, but likely not the first dependency BriefOps needs for the MVP.",
      recommendedAction:
        "Read later; compare only if the Vercel Workflow boundary becomes too limiting.",
      scoreExplanation:
        "Relevant but lower actionability because it introduces a larger framework decision that can wait.",
      scores: {
        relevance: 72,
        novelty: 62,
        impact: 68,
        actionability: 48,
        urgency: 38,
        confidence: 74
      },
      citations: [{ label: langGraphSource.name, url: langGraphSource.url }],
      tags: ["LangGraph", "Agent state", "Frameworks"]
    })
  ];
}

export const pipelineSteps: PipelineStep[] = [
  {
    id: "collect",
    name: "Collect",
    description: "Recolecta contenido nuevo desde fuentes configuradas.",
    status: "complete",
    output: "12 source candidates fetched"
  },
  {
    id: "normalize",
    name: "Normalize",
    description: "Limpia contenido y extrae titulo, fecha, fuente, autor, tags y links.",
    status: "complete",
    output: "9 normalized items"
  },
  {
    id: "deduplicate",
    name: "Deduplicate",
    description: "Detecta si la misma noticia aparece en varias fuentes.",
    status: "complete",
    output: "3 duplicates collapsed"
  },
  {
    id: "classify",
    name: "Classify",
    description: "Clasifica el tipo de senal.",
    status: "complete",
    output: "Release, Changelog, New model, GitHub release"
  },
  {
    id: "score",
    name: "Score",
    description: "Calcula importancia segun el contexto del radar.",
    status: "complete",
    output: "Top score: 91"
  },
  {
    id: "summarize",
    name: "Summarize",
    description: "Resume con lenguaje adecuado al perfil del usuario.",
    status: "complete",
    output: "Technical brief tone selected"
  },
  {
    id: "impact",
    name: "Explain impact",
    description: "Explica por que importa o por que puede esperar.",
    status: "complete",
    output: "Impact notes generated"
  },
  {
    id: "actions",
    name: "Generate actions",
    description: "Propone proximos pasos concretos.",
    status: "running",
    output: "3 actions ready, 1 deep dive queued"
  },
  {
    id: "remember",
    name: "Remember",
    description: "Guarda lo visto, ignorado, importante o convertido en accion.",
    status: "queued",
    output: "Awaiting user decisions"
  }
];
