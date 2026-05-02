export type ProfessionalProfile =
  | "Developer / AI Engineer"
  | "Chef"
  | "Contador"
  | "Abogado"
  | "Marketer"
  | "Otro";

export type RadarGoal =
  | "Mantenerme actualizado"
  | "Detectar oportunidades"
  | "Encontrar herramientas para probar"
  | "Generar contenido"
  | "Preparar decisiones de negocio";

export type UserLevel = "Principiante" | "Intermedio" | "Avanzado" | "Experto";

export type OutputType =
  | "Brief ejecutivo"
  | "Resumen tecnico"
  | "Plan de accion"
  | "Ideas de contenido"
  | "Checklist de prueba";

export type SourceType =
  | "RSS feed"
  | "Blog"
  | "Changelog"
  | "GitHub repo releases"
  | "Docs oficiales"
  | "Paper / arXiv"
  | "Newsletter"
  | "YouTube transcript"
  | "X/Twitter thread"
  | "Reddit / Hacker News"
  | "Fuente manual";

export type SourceStatus = "activa" | "pausada";

export type SignalType =
  | "Release"
  | "Breaking change"
  | "New tool"
  | "New model"
  | "New paper"
  | "Tutorial"
  | "Opinion / analysis"
  | "Security issue"
  | "Business opportunity"
  | "Trend"
  | "Event"
  | "GitHub release"
  | "Changelog"
  | "Regulatory update"
  | "Market update";

export type SignalStatus =
  | "Nuevo"
  | "Leido"
  | "Guardado"
  | "Ignorado"
  | "Convertido en accion";

export type ScoreBreakdown = {
  relevance: number;
  novelty: number;
  impact: number;
  actionability: number;
  urgency: number;
  confidence: number;
};

export type Radar = {
  id: string;
  userId: string;
  name: string;
  profile: ProfessionalProfile;
  goal: RadarGoal;
  level: UserLevel;
  interests: string[];
  avoidTopics: string[];
  outputTypes: OutputType[];
  createdAt: string;
  updatedAt: string;
};

export type Source = {
  id: string;
  userId: string;
  radarId: string;
  name: string;
  url: string;
  type: SourceType;
  suggestedFrequency: string;
  trustScore: number;
  lastCheckedAt: string | null;
  status: SourceStatus;
};

export type NormalizedItem = {
  id: string;
  userId: string;
  radarId: string;
  sourceId: string;
  title: string;
  url: string;
  author?: string;
  publishedAt: string;
  excerpt: string;
  tags: string[];
  sourceType: SourceType;
};

export type Citation = {
  label: string;
  url: string;
};

export type Signal = {
  id: string;
  userId: string;
  radarId: string;
  sourceId: string;
  title: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  type: SignalType;
  status: SignalStatus;
  summary: string;
  whyItMatters: string;
  recommendedAction: string;
  scoreExplanation: string;
  scores: ScoreBreakdown;
  signalScore: number;
  citations: Citation[];
  tags: string[];
};

export type GeneratedAction = {
  id: string;
  userId: string;
  signalId: string;
  kind: "Slack update" | "LinkedIn post" | "Technical spike" | "Deep dive";
  title: string;
  body: string;
  createdAt: string;
};

export type PipelineStepStatus = "complete" | "running" | "queued";

export type PipelineStep = {
  id: string;
  name: string;
  description: string;
  status: PipelineStepStatus;
  output: string;
};
