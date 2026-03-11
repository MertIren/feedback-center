export interface Env {
  DB: D1Database;
  AI: Ai;
  VECTORIZE: VectorizeIndex;
}

export interface FeedbackRow {
  id: string;
  source: 'github' | 'discord' | 'twitter' | 'support' | 'email';
  content: string;
  author: string;
  created_at: string;
  sentiment: 'positive' | 'neutral' | 'negative' | null;
  sentiment_score: number | null;
  theme: string | null;
  summary: string | null;
  embedded: number;
}

export type FeedbackSource = FeedbackRow['source'];
export type FeedbackSentiment = NonNullable<FeedbackRow['sentiment']>;
