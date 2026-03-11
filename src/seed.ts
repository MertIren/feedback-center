import type { FeedbackSource } from './types';

export interface SeedEntry {
  id: string;
  source: FeedbackSource;
  content: string;
  author: string;
  created_at: string;
}

export const SEED_DATA: SeedEntry[] = [
  {
    id: 'seed-001',
    source: 'github',
    content: 'The cold start latency has improved a lot in the last few weeks! Requests that used to take 400ms are now under 50ms. Really impressed with the progress.',
    author: 'tkleczek',
    created_at: '2026-01-03T09:12:00Z',
  },
  {
    id: 'seed-002',
    source: 'github',
    content: 'Getting `Error: Script startup exceeded CPU time limit` on a worker that runs fine locally with wrangler dev. The script is only ~200 lines. This seems like a bug.',
    author: 'maya_dev',
    created_at: '2026-01-07T14:33:00Z',
  },
  {
    id: 'seed-003',
    source: 'github',
    content: 'Would love to see native support for cron expressions with sub-minute precision. The current 1-minute minimum is a deal breaker for some of our use cases.',
    author: 'jorgensen_io',
    created_at: '2026-01-10T11:45:00Z',
  },
  {
    id: 'seed-004',
    source: 'discord',
    content: 'has anyone else noticed the D1 query planner ignoring indexes on joined columns? running EXPLAIN shows a full scan every time even with explicit indexes',
    author: 'patchwork_phil',
    created_at: '2026-01-12T18:22:00Z',
  },
  {
    id: 'seed-005',
    source: 'discord',
    content: 'just migrated our whole backend from Lambda to Workers and honestly the DX is night and day. wrangler tail for live logs is a game changer',
    author: 'serverless_sara',
    created_at: '2026-01-15T20:01:00Z',
  },
  {
    id: 'seed-006',
    source: 'twitter',
    content: 'why does @EdgePlatform charge per request AND per CPU ms? double billing feels predatory for latency-sensitive workloads where you pay for the wait time too',
    author: 'costaware_dev',
    created_at: '2026-01-17T08:55:00Z',
  },
  {
    id: 'seed-007',
    source: 'twitter',
    content: 'deployed a full SSR React app on Workers in a weekend. bundle size under 1MB, global p99 under 80ms. this platform is seriously underrated',
    author: 'reactedge',
    created_at: '2026-01-19T16:44:00Z',
  },
  {
    id: 'seed-008',
    source: 'support',
    content: 'Ticket #84201: Our production worker started returning 503s at ~2am UTC. No deploys were made. Logs show "Worker exceeded memory limit" but memory usage in metrics looks normal. Need urgent help.',
    author: 'ops@acmecorp.io',
    created_at: '2026-01-21T03:14:00Z',
  },
  {
    id: 'seed-009',
    source: 'support',
    content: 'How do I set up a custom domain for a Worker on a subdomain that already has an A record? The docs say to add a CNAME but it conflicts with the existing record.',
    author: 'newuser_raj',
    created_at: '2026-01-22T10:30:00Z',
  },
  {
    id: 'seed-010',
    source: 'email',
    content: 'We\'ve been using your platform for 18 months and the reliability has been exceptional. Uptime is 99.98% for our critical payment processing worker. The team is very happy.',
    author: 'cto@finedge.com',
    created_at: '2026-01-24T09:00:00Z',
  },
  {
    id: 'seed-011',
    source: 'github',
    content: 'The TypeScript types for the env bindings are outdated. `KVNamespace.getWithMetadata` is missing the `type` overloads added in the last runtime update. Causes TS errors on valid code.',
    author: 'ts_purist',
    created_at: '2026-01-26T13:15:00Z',
  },
  {
    id: 'seed-012',
    source: 'discord',
    content: 'the new Vectorize GA is incredible for building semantic search. just built a docs search in 2 hours that beats what we had with Algolia. huge W for the platform',
    author: 'ml_on_edge',
    created_at: '2026-01-28T21:07:00Z',
  },
  {
    id: 'seed-013',
    source: 'twitter',
    content: 'spent 3 hours debugging why my worker was returning stale data — turns out the Cache API behaves differently between wrangler dev and production. this should be documented way more clearly',
    author: 'debuglife',
    created_at: '2026-01-30T12:20:00Z',
  },
  {
    id: 'seed-014',
    source: 'support',
    content: 'Feature request: We need the ability to share environment variables across multiple workers without duplicating them in each wrangler.toml. A "shared secrets" concept would be very valuable.',
    author: 'platform@bigtech.dev',
    created_at: '2026-02-01T14:00:00Z',
  },
  {
    id: 'seed-015',
    source: 'github',
    content: 'R2 presigned URLs are expiring 30 seconds earlier than specified. Reproducible every time with a 15-minute TTL — URL becomes invalid at 14:30. Breaking our file upload flow.',
    author: 'r2_reporter',
    created_at: '2026-02-03T09:48:00Z',
  },
  {
    id: 'seed-016',
    source: 'email',
    content: 'Your documentation on service bindings is excellent. It took us under a day to decompose our monolithic worker into 4 microservices that communicate internally. The latency is also zero-cost which is amazing.',
    author: 'arch@startupxyz.io',
    created_at: '2026-02-05T11:20:00Z',
  },
  {
    id: 'seed-017',
    source: 'discord',
    content: 'getting a weird issue where `waitUntil` promises seem to be getting killed before they complete in high-traffic scenarios. losing about 5% of background jobs',
    author: 'async_troubles',
    created_at: '2026-02-07T17:35:00Z',
  },
  {
    id: 'seed-018',
    source: 'twitter',
    content: 'switching to edge computing cut our TTFB from 320ms to 28ms for users in Southeast Asia. can\'t believe we waited this long. @EdgePlatform is the real deal',
    author: 'perf_wins',
    created_at: '2026-02-09T08:10:00Z',
  },
  {
    id: 'seed-019',
    source: 'github',
    content: 'Please add support for TCP sockets in Workers. We need to connect to our Postgres instance directly. Using a proxy adds latency and an extra point of failure.',
    author: 'db_direct',
    created_at: '2026-02-11T10:00:00Z',
  },
  {
    id: 'seed-020',
    source: 'support',
    content: 'Billing question: We were charged for 2.1 billion requests last month but our analytics show only 1.4 billion. 700M extra requests unaccounted for. Need a detailed billing breakdown urgently.',
    author: 'billing@enterprise.co',
    created_at: '2026-02-13T09:05:00Z',
  },
  {
    id: 'seed-021',
    source: 'discord',
    content: 'not sure if this is the right place but: the AI binding for llama is way faster than calling an external API. latency is about 200ms for a short completion. very usable for prod',
    author: 'ai_builder',
    created_at: '2026-02-15T19:42:00Z',
  },
  {
    id: 'seed-022',
    source: 'email',
    content: 'We\'ve evaluated 4 edge platforms. Yours has the best global coverage and the most ergonomic developer experience. However, the lack of WebSocket hibernation is blocking our real-time app migration.',
    author: 'eval@techcompare.org',
    created_at: '2026-02-17T14:30:00Z',
  },
  {
    id: 'seed-023',
    source: 'github',
    content: 'Durable Objects consistency guarantees are not matching the documentation. We\'re seeing concurrent writes winning over sequential ones when accessed from different regions within the same request storm.',
    author: 'consistency_cop',
    created_at: '2026-02-19T11:55:00Z',
  },
  {
    id: 'seed-024',
    source: 'twitter',
    content: 'the local dev experience with wrangler has gotten SO much better. hot reload actually works now, bindings are simulated accurately, and the error messages are readable. great job team',
    author: 'dx_appreciator',
    created_at: '2026-02-22T10:30:00Z',
  },
  {
    id: 'seed-025',
    source: 'support',
    content: 'Request: Can we get a way to replay failed requests from the logs dashboard? We lose data on worker crashes and have to ask customers to retry manually. An automatic retry queue would be very helpful.',
    author: 'reliability@saasco.com',
    created_at: '2026-02-25T13:15:00Z',
  },
];
