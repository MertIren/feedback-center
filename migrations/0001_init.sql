CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL CHECK(source IN ('github', 'discord', 'twitter', 'support', 'email')),
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TEXT NOT NULL,
  sentiment TEXT CHECK(sentiment IN ('positive', 'neutral', 'negative')),
  sentiment_score REAL,
  theme TEXT,
  summary TEXT,
  embedded INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_feedback_source ON feedback(source);
CREATE INDEX IF NOT EXISTS idx_feedback_sentiment ON feedback(sentiment);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at);
