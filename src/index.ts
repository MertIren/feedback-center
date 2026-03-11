import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env, FeedbackRow } from './types';
import { analyzeFeedback, embedText } from './ai';
import { SEED_DATA } from './seed';
import { renderHTML } from './frontend';

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

// ── Frontend ───────────────────────────────────────────────────────────────

app.get('/', (c) => {
  return c.html(renderHTML());
});

// ── GET /api/feedback ──────────────────────────────────────────────────────

app.get('/api/feedback', async (c) => {
  const source = c.req.query('source');
  const sentiment = c.req.query('sentiment');

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (source) {
    conditions.push('source = ?');
    params.push(source);
  }
  if (sentiment) {
    conditions.push('sentiment = ?');
    params.push(sentiment);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const query = `SELECT * FROM feedback ${where} ORDER BY created_at DESC`;

  const { results } = await c.env.DB.prepare(query).bind(...params).all<FeedbackRow>();
  return c.json(results);
});

// ── POST /api/feedback ─────────────────────────────────────────────────────

app.post('/api/feedback', async (c) => {
  const body = await c.req.json<{ source?: string; author?: string; content?: string }>();

  if (!body.source || !body.author || !body.content) {
    return c.json({ error: 'source, author, and content are required' }, 400);
  }

  const validSources = ['github', 'discord', 'twitter', 'support', 'email'];
  if (!validSources.includes(body.source)) {
    return c.json({ error: 'source must be one of: ' + validSources.join(', ') }, 400);
  }

  const id = crypto.randomUUID();
  const created_at = new Date().toISOString();

  // Analyze with AI
  const analysis = await analyzeFeedback(c.env, body.content);

  // Store in D1
  await c.env.DB.prepare(
    `INSERT INTO feedback (id, source, content, author, created_at, sentiment, sentiment_score, theme, summary, embedded)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`
  )
    .bind(id, body.source, body.content, body.author, created_at, analysis.sentiment, analysis.sentiment_score, analysis.theme, analysis.summary)
    .run();

  // Embed and upsert into Vectorize (non-blocking)
  c.executionCtx.waitUntil(
    embedAndIndex(c.env, id, body.content, analysis.theme ?? '', analysis.sentiment)
  );

  const row: FeedbackRow = {
    id, source: body.source as FeedbackRow['source'], content: body.content,
    author: body.author, created_at, embedded: 0, ...analysis,
  };
  return c.json(row, 201);
});

async function embedAndIndex(env: Env, id: string, content: string, theme: string, sentiment: string): Promise<void> {
  try {
    const vector = await embedText(env, content);
    if (!vector.length) return;
    await env.VECTORIZE.upsert([{
      id,
      values: vector,
      metadata: { theme, sentiment },
    }]);
    await env.DB.prepare('UPDATE feedback SET embedded = 1 WHERE id = ?').bind(id).run();
  } catch (err) {
    console.error('Vectorize upsert failed for', id, err);
  }
}

// ── GET /api/stats ─────────────────────────────────────────────────────────

app.get('/api/stats', async (c) => {
  const [totalRow, sentimentRows, themeRows, sourceRows] = await Promise.all([
    c.env.DB.prepare('SELECT COUNT(*) as count FROM feedback').first<{ count: number }>(),
    c.env.DB.prepare(
      `SELECT sentiment, COUNT(*) as count FROM feedback WHERE sentiment IS NOT NULL GROUP BY sentiment`
    ).all<{ sentiment: string; count: number }>(),
    c.env.DB.prepare(
      `SELECT theme, COUNT(*) as count FROM feedback WHERE theme IS NOT NULL GROUP BY theme ORDER BY count DESC LIMIT 5`
    ).all<{ theme: string; count: number }>(),
    c.env.DB.prepare(
      `SELECT source, COUNT(*) as count FROM feedback GROUP BY source ORDER BY count DESC`
    ).all<{ source: string; count: number }>(),
  ]);

  const sentiment_breakdown: Record<string, number> = {};
  for (const row of sentimentRows.results) {
    sentiment_breakdown[row.sentiment] = row.count;
  }

  const source_breakdown: Record<string, number> = {};
  for (const row of sourceRows.results) {
    source_breakdown[row.source] = row.count;
  }

  return c.json({
    total: totalRow?.count ?? 0,
    sentiment_breakdown,
    top_themes: themeRows.results,
    source_breakdown,
  });
});

// ── GET /api/search ────────────────────────────────────────────────────────

app.get('/api/search', async (c) => {
  const q = c.req.query('q');
  if (!q?.trim()) return c.json([]);

  const queryVector = await embedText(c.env, q);
  if (!queryVector.length) return c.json([]);

  const matches = await c.env.VECTORIZE.query(queryVector, { topK: 5, returnMetadata: 'all' });

  if (!matches.matches?.length) return c.json([]);

  const ids = matches.matches.map((m) => m.id);
  const placeholders = ids.map(() => '?').join(', ');
  const { results } = await c.env.DB.prepare(
    `SELECT * FROM feedback WHERE id IN (${placeholders})`
  ).bind(...ids).all<FeedbackRow>();

  // Return in Vectorize score order
  const byId = new Map(results.map((r) => [r.id, r]));
  const ordered = ids.map((id) => byId.get(id)).filter((r): r is FeedbackRow => r !== undefined);

  return c.json(ordered);
});

// ── POST /api/seed ─────────────────────────────────────────────────────────

app.post('/api/seed', async (c) => {
  let inserted = 0;
  const errors: string[] = [];

  for (const entry of SEED_DATA) {
    // Skip if already exists
    const existing = await c.env.DB.prepare('SELECT id FROM feedback WHERE id = ?').bind(entry.id).first();
    if (existing) continue;

    try {
      const analysis = await analyzeFeedback(c.env, entry.content);

      await c.env.DB.prepare(
        `INSERT INTO feedback (id, source, content, author, created_at, sentiment, sentiment_score, theme, summary, embedded)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`
      )
        .bind(entry.id, entry.source, entry.content, entry.author, entry.created_at,
          analysis.sentiment, analysis.sentiment_score, analysis.theme, analysis.summary)
        .run();

      // Embed async (fire and forget per entry)
      c.executionCtx.waitUntil(
        embedAndIndex(c.env, entry.id, entry.content, analysis.theme ?? '', analysis.sentiment)
      );

      inserted++;
    } catch (err) {
      errors.push(`${entry.id}: ${String(err)}`);
    }
  }

  return c.json({ inserted, errors });
});

// ── POST /api/wipe ───────────────────────────────────────────────

app.post('/api/wipe', async (c) => {
  try {
    await c.env.DB.prepare('DELETE FROM feedback').run();
    return c.json({ success: true, message: 'Wiped all feedback data.' });
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

export default app;
