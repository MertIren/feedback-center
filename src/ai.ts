import type { Env } from './types';

interface AnalysisResult {
  sentiment: 'positive' | 'neutral' | 'negative';
  sentiment_score: number;
  theme: string;
  summary: string;
}

export async function analyzeFeedback(env: Env, content: string): Promise<AnalysisResult> {
  const prompt = `Analyze this product feedback for an edge computing / API platform. Return ONLY valid JSON with these exact fields:
- sentiment: "positive", "neutral", or "negative"
- sentiment_score: a number from -1.0 (very negative) to 1.0 (very positive)
- theme: one short phrase (max 4 words) categorizing the main topic, e.g. "performance", "billing issue", "feature request", "documentation", "bug report", "developer experience", "reliability"
- summary: one sentence (max 20 words) summarizing the feedback

Feedback: "${content.replace(/"/g, '\\"').slice(0, 1000)}"

JSON response:`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await (env.AI as any).run('@cf/meta/llama-3.1-8b-instruct', {
    prompt,
    max_tokens: 200,
  }) as { response?: string };

  const raw = response?.response ?? '';

  // Extract JSON from the response
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return fallbackAnalysis(content);
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]) as Partial<AnalysisResult>;
    const sentiment = (['positive', 'neutral', 'negative'] as const).includes(parsed.sentiment as never)
      ? (parsed.sentiment as AnalysisResult['sentiment'])
      : 'neutral';
    const score = typeof parsed.sentiment_score === 'number'
      ? Math.max(-1, Math.min(1, parsed.sentiment_score))
      : 0;
    return {
      sentiment,
      sentiment_score: score,
      theme: typeof parsed.theme === 'string' ? parsed.theme.slice(0, 50) : 'general feedback',
      summary: typeof parsed.summary === 'string' ? parsed.summary.slice(0, 200) : content.slice(0, 100),
    };
  } catch {
    return fallbackAnalysis(content);
  }
}

function fallbackAnalysis(content: string): AnalysisResult {
  const lower = content.toLowerCase();
  const positive = (lower.match(/\b(great|love|excellent|amazing|fantastic|impressed|better|improved|best)\b/g) ?? []).length;
  const negative = (lower.match(/\b(bug|error|broken|fail|issue|problem|crash|wrong|bad|worst|terrible)\b/g) ?? []).length;
  const sentiment: AnalysisResult['sentiment'] = positive > negative ? 'positive' : negative > positive ? 'negative' : 'neutral';
  return {
    sentiment,
    sentiment_score: sentiment === 'positive' ? 0.5 : sentiment === 'negative' ? -0.5 : 0,
    theme: 'general feedback',
    summary: content.slice(0, 100),
  };
}

export async function embedText(env: Env, text: string): Promise<number[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await (env.AI as any).run('@cf/baai/bge-small-en-v1.5', {
    text: [text.slice(0, 512)],
  }) as { data?: number[][] };
  return response?.data?.[0] ?? [];
}
