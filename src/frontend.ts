export function renderHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>FeedbackOS</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0d1117;
    --surface: #161b22;
    --surface2: #21262d;
    --border: #30363d;
    --text: #e6edf3;
    --muted: #8b949e;
    --accent: #58a6ff;
    --green: #3fb950;
    --red: #f85149;
    --yellow: #d29922;
    --purple: #bc8cff;
    --orange: #ffa657;
  }
  body { background: var(--bg); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; line-height: 1.5; }
  a { color: var(--accent); text-decoration: none; }

  /* Layout */
  .app { max-width: 1280px; margin: 0 auto; padding: 24px 16px; }
  header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
  header h1 { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
  header h1 span { color: var(--accent); }

  /* Stats bar */
  .stats-bar { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 24px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 16px; }
  .stat-card .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: var(--muted); margin-bottom: 6px; }
  .stat-card .value { font-size: 28px; font-weight: 700; }
  .sentiment-row { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 4px; }
  .sentiment-row span { font-size: 13px; font-weight: 600; }
  .pos { color: var(--green); }
  .neg { color: var(--red); }
  .neu { color: var(--muted); }
  .themes-card { grid-column: span 2; }
  .themes-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .pill { background: var(--surface2); border: 1px solid var(--border); border-radius: 20px; padding: 3px 10px; font-size: 12px; color: var(--text); }
  .pill.count { font-size: 11px; color: var(--muted); margin-left: 2px; }

  /* Search & filters */
  .toolbar { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; align-items: center; }
  .search-wrap { position: relative; flex: 1; min-width: 220px; }
  .search-wrap input { width: 100%; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 8px 12px 8px 36px; color: var(--text); font-size: 14px; outline: none; transition: border-color 0.15s; }
  .search-wrap input:focus { border-color: var(--accent); }
  .search-wrap .icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--muted); pointer-events: none; }
  select { background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 8px 12px; color: var(--text); font-size: 13px; outline: none; cursor: pointer; }
  select:focus { border-color: var(--accent); }
  .btn { background: var(--accent); color: #0d1117; border: none; border-radius: 6px; padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer; transition: opacity 0.15s; white-space: nowrap; }
  .btn:hover { opacity: 0.85; }
  .btn-outline { background: transparent; color: var(--accent); border: 1px solid var(--accent); }
  .btn-outline:hover { background: var(--accent); color: #0d1117; opacity: 1; }
  .btn-sm { padding: 5px 10px; font-size: 12px; }
  .btn-danger { background: var(--red); color: #fff; }

  /* Search results banner */
  .search-banner { background: var(--surface2); border: 1px solid var(--border); border-radius: 6px; padding: 8px 14px; margin-bottom: 12px; font-size: 13px; color: var(--muted); display: none; align-items: center; justify-content: space-between; }
  .search-banner.visible { display: flex; }

  /* Table */
  .table-wrap { overflow-x: auto; border: 1px solid var(--border); border-radius: 8px; }
  table { width: 100%; border-collapse: collapse; }
  thead th { background: var(--surface2); padding: 10px 14px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.7px; color: var(--muted); border-bottom: 1px solid var(--border); white-space: nowrap; }
  tbody tr { border-bottom: 1px solid var(--border); transition: background 0.1s; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: var(--surface2); }
  tbody tr.highlighted { background: rgba(88, 166, 255, 0.06); border-left: 2px solid var(--accent); }
  td { padding: 10px 14px; vertical-align: middle; }
  .td-summary { max-width: 340px; }
  .td-summary p { color: var(--text); line-height: 1.4; }
  .td-summary .author { font-size: 12px; color: var(--muted); margin-top: 2px; }

  /* Badges */
  .badge { display: inline-flex; align-items: center; gap: 4px; border-radius: 4px; padding: 2px 8px; font-size: 11px; font-weight: 600; white-space: nowrap; }
  .src-github   { background: #21262d; color: #e6edf3; border: 1px solid #30363d; }
  .src-discord  { background: #2d2f5e; color: #b9bfff; border: 1px solid #3d4080; }
  .src-twitter  { background: #0d2a3e; color: #58c7f5; border: 1px solid #1b4f72; }
  .src-support  { background: #2d1f0e; color: #ffa657; border: 1px solid #5a3e1b; }
  .src-email    { background: #1c2a1c; color: #3fb950; border: 1px solid #2e5230; }
  .sent-positive { background: rgba(63, 185, 80, 0.12); color: var(--green); border: 1px solid rgba(63,185,80,0.3); }
  .sent-negative { background: rgba(248, 81, 73, 0.12); color: var(--red); border: 1px solid rgba(248,81,73,0.3); }
  .sent-neutral  { background: rgba(139, 148, 158, 0.12); color: var(--muted); border: 1px solid rgba(139,148,158,0.3); }
  .theme-pill { background: var(--surface2); border: 1px solid var(--border); border-radius: 20px; padding: 2px 8px; font-size: 11px; color: var(--muted); white-space: nowrap; }

  /* Empty / loading states */
  .empty { text-align: center; padding: 48px 16px; color: var(--muted); }
  .loading { opacity: 0.5; pointer-events: none; }
  .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.6s linear infinite; vertical-align: middle; margin-right: 6px; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Modal */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: none; align-items: center; justify-content: center; z-index: 100; padding: 16px; }
  .modal-overlay.open { display: flex; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 28px; width: 100%; max-width: 500px; }
  .modal h2 { font-size: 17px; margin-bottom: 20px; }
  .form-group { margin-bottom: 16px; }
  .form-group label { display: block; font-size: 12px; font-weight: 600; color: var(--muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
  .form-group select, .form-group input, .form-group textarea { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 6px; padding: 9px 12px; color: var(--text); font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.15s; }
  .form-group select:focus, .form-group input:focus, .form-group textarea:focus { border-color: var(--accent); }
  .form-group textarea { resize: vertical; min-height: 100px; }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
  .toast { position: fixed; bottom: 24px; right: 24px; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 12px 18px; font-size: 13px; z-index: 200; opacity: 0; transform: translateY(8px); transition: opacity 0.2s, transform 0.2s; pointer-events: none; }
  .toast.show { opacity: 1; transform: translateY(0); }
  .toast.success { border-color: var(--green); }
  .toast.error { border-color: var(--red); }
</style>
</head>
<body>
<div class="app">
  <header>
    <h1>Feedback<span>OS</span></h1>
    <div style="display:flex;gap:8px;align-items:center;">
      <button class="btn btn-outline btn-sm btn-danger" id="wipeBtn">Wipe Data</button>
      <button class="btn btn-outline btn-sm" id="seedBtn">Seed Demo Data</button>
      <button class="btn btn-sm" id="openModalBtn">+ Add Feedback</button>
    </div>
  </header>

  <!-- Stats -->
  <div class="stats-bar" id="statsBar">
    <div class="stat-card">
      <div class="label">Total Feedback</div>
      <div class="value" id="statTotal">—</div>
    </div>
    <div class="stat-card">
      <div class="label">Sentiment</div>
      <div class="sentiment-row">
        <span class="pos" id="statPos">—</span>
        <span class="neu" id="statNeu">—</span>
        <span class="neg" id="statNeg">—</span>
      </div>
    </div>
    <div class="stat-card">
      <div class="label">Sources</div>
      <div class="sentiment-row" id="statSources"></div>
    </div>
    <div class="stat-card themes-card">
      <div class="label">Top Themes</div>
      <div class="themes-pills" id="statThemes"></div>
    </div>
  </div>

  <!-- Toolbar -->
  <div class="toolbar">
    <div class="search-wrap">
      <svg class="icon" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M11 11l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      <input type="text" id="searchInput" placeholder="Semantic search…" autocomplete="off">
    </div>
    <select id="filterSource">
      <option value="">All Sources</option>
      <option value="github">GitHub</option>
      <option value="discord">Discord</option>
      <option value="twitter">Twitter</option>
      <option value="support">Support</option>
      <option value="email">Email</option>
    </select>
    <select id="filterSentiment">
      <option value="">All Sentiments</option>
      <option value="positive">Positive</option>
      <option value="neutral">Neutral</option>
      <option value="negative">Negative</option>
    </select>
    <button class="btn btn-outline btn-sm" id="clearFiltersBtn">Clear</button>
  </div>

  <div class="search-banner" id="searchBanner">
    <span id="searchBannerText"></span>
    <button class="btn btn-outline btn-sm" id="clearSearchBtn">Clear search</button>
  </div>

  <!-- Table -->
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Source</th>
          <th>Summary / Author</th>
          <th>Theme</th>
          <th>Sentiment</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody id="tableBody">
        <tr><td colspan="5" class="empty">Loading…</td></tr>
      </tbody>
    </table>
  </div>
</div>

<!-- Add Feedback Modal -->
<div class="modal-overlay" id="modalOverlay">
  <div class="modal">
    <h2>Add Feedback</h2>
    <form id="feedbackForm">
      <div class="form-group">
        <label>Source</label>
        <select name="source" required>
          <option value="">Select source…</option>
          <option value="github">GitHub</option>
          <option value="discord">Discord</option>
          <option value="twitter">Twitter</option>
          <option value="support">Support</option>
          <option value="email">Email</option>
        </select>
      </div>
      <div class="form-group">
        <label>Author</label>
        <input type="text" name="author" placeholder="username or email" required>
      </div>
      <div class="form-group">
        <label>Content</label>
        <textarea name="content" placeholder="Paste the feedback here…" required></textarea>
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-outline" id="cancelModalBtn">Cancel</button>
        <button type="submit" class="btn" id="submitBtn">Analyze &amp; Save</button>
      </div>
    </form>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
(function () {
  // ── State ──────────────────────────────────────────────
  let allFeedback = [];
  let searchResults = null; // null = not in search mode
  let searchQuery = '';

  // ── Helpers ────────────────────────────────────────────
  function fmt(iso) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  function sourceBadge(s) {
    const labels = { github: '⬡ GitHub', discord: '# Discord', twitter: '𝕏 Twitter', support: '🎫 Support', email: '✉ Email' };
    return '<span class="badge src-' + s + '">' + (labels[s] || s) + '</span>';
  }
  function sentBadge(s, score) {
    if (!s) return '<span class="badge sent-neutral">—</span>';
    const icons = { positive: '▲', negative: '▼', neutral: '●' };
    const scoreStr = score != null ? ' ' + (score > 0 ? '+' : '') + score.toFixed(2) : '';
    return '<span class="badge sent-' + s + '">' + icons[s] + ' ' + s + scoreStr + '</span>';
  }
  function showToast(msg, type = 'success') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast show ' + type;
    setTimeout(() => { t.className = 'toast'; }, 3000);
  }

  // ── Stats ──────────────────────────────────────────────
  async function loadStats() {
    try {
      const r = await fetch('/api/stats');
      const d = await r.json();
      document.getElementById('statTotal').textContent = d.total ?? 0;
      const s = d.sentiment_breakdown || {};
      document.getElementById('statPos').textContent = '▲ ' + (s.positive || 0) + ' pos';
      document.getElementById('statNeu').textContent = '● ' + (s.neutral || 0) + ' neu';
      document.getElementById('statNeg').textContent = '▼ ' + (s.negative || 0) + ' neg';

      const src = d.source_breakdown || {};
      document.getElementById('statSources').innerHTML = Object.entries(src)
        .sort((a, b) => b[1] - a[1])
        .map(([k, v]) => '<span class="badge src-' + k + '">' + k + ' ' + v + '</span>')
        .join('');

      const themes = d.top_themes || [];
      document.getElementById('statThemes').innerHTML = themes
        .map(t => '<span class="pill">' + t.theme + '<span class="count">×' + t.count + '</span></span>')
        .join('') || '<span style="color:var(--muted);font-size:12px">No themes yet</span>';
    } catch (e) {
      console.error('Stats load failed', e);
    }
  }

  // ── Feedback list ──────────────────────────────────────
  async function loadFeedback() {
    const source = document.getElementById('filterSource').value;
    const sentiment = document.getElementById('filterSentiment').value;
    const params = new URLSearchParams();
    if (source) params.set('source', source);
    if (sentiment) params.set('sentiment', sentiment);
    try {
      const r = await fetch('/api/feedback?' + params);
      allFeedback = await r.json();
      renderTable(allFeedback, null);
    } catch (e) {
      console.error('Feedback load failed', e);
    }
  }

  function renderTable(rows, highlightIds) {
    const tbody = document.getElementById('tableBody');
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty">No feedback found.</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(f => {
      const hl = highlightIds && highlightIds.includes(f.id) ? ' highlighted' : '';
      return '<tr class="' + hl + '">' +
        '<td>' + sourceBadge(f.source) + '</td>' +
        '<td class="td-summary"><p>' + escHtml(f.summary || f.content.slice(0, 120)) + '</p><div class="author">@' + escHtml(f.author) + '</div></td>' +
        '<td>' + (f.theme ? '<span class="theme-pill">' + escHtml(f.theme) + '</span>' : '—') + '</td>' +
        '<td>' + sentBadge(f.sentiment, f.sentiment_score) + '</td>' +
        '<td style="color:var(--muted);font-size:12px;white-space:nowrap">' + fmt(f.created_at) + '</td>' +
        '</tr>';
    }).join('');
  }

  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Search ─────────────────────────────────────────────
  let searchTimeout;
  document.getElementById('searchInput').addEventListener('input', function () {
    clearTimeout(searchTimeout);
    const q = this.value.trim();
    if (!q) { clearSearch(); return; }
    searchTimeout = setTimeout(() => runSearch(q), 450);
  });

  async function runSearch(q) {
    searchQuery = q;
    try {
      const r = await fetch('/api/search?q=' + encodeURIComponent(q));
      const results = await r.json();
      searchResults = results;
      const ids = results.map(f => f.id);
      // Show all feedback but highlight matches
      renderTable(results.length ? results : allFeedback, ids);
      const banner = document.getElementById('searchBanner');
      banner.classList.add('visible');
      document.getElementById('searchBannerText').textContent =
        results.length + ' semantic match' + (results.length !== 1 ? 'es' : '') + ' for "' + q + '"';
    } catch (e) {
      console.error('Search failed', e);
    }
  }

  function clearSearch() {
    searchResults = null;
    searchQuery = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('searchBanner').classList.remove('visible');
    renderTable(allFeedback, null);
  }

  document.getElementById('clearSearchBtn').addEventListener('click', clearSearch);

  // ── Filters ────────────────────────────────────────────
  document.getElementById('filterSource').addEventListener('change', loadFeedback);
  document.getElementById('filterSentiment').addEventListener('change', loadFeedback);
  document.getElementById('clearFiltersBtn').addEventListener('click', function () {
    document.getElementById('filterSource').value = '';
    document.getElementById('filterSentiment').value = '';
    clearSearch();
    loadFeedback();
  });

  // ── Modal ──────────────────────────────────────────────
  document.getElementById('openModalBtn').addEventListener('click', () => {
    document.getElementById('modalOverlay').classList.add('open');
  });
  document.getElementById('cancelModalBtn').addEventListener('click', () => {
    document.getElementById('modalOverlay').classList.remove('open');
    document.getElementById('feedbackForm').reset();
  });
  document.getElementById('modalOverlay').addEventListener('click', function (e) {
    if (e.target === this) {
      this.classList.remove('open');
      document.getElementById('feedbackForm').reset();
    }
  });

  document.getElementById('feedbackForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const fd = new FormData(this);
    const body = { source: fd.get('source'), author: fd.get('author'), content: fd.get('content') };
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerHTML = '<span class="spinner"></span>Analyzing…';
    submitBtn.disabled = true;
    try {
      const r = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error(await r.text());
      showToast('Feedback saved and analyzed!', 'success');
      document.getElementById('modalOverlay').classList.remove('open');
      this.reset();
      await Promise.all([loadFeedback(), loadStats()]);
    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    } finally {
      submitBtn.innerHTML = 'Analyze &amp; Save';
      submitBtn.disabled = false;
    }
  });

  // ── Seed ───────────────────────────────────────────────
  document.getElementById('seedBtn').addEventListener('click', async function () {
    if (!confirm('This will seed 25 demo feedback entries with AI analysis. Continue?')) return;
    this.innerHTML = '<span class="spinner"></span>Seeding…';
    this.disabled = true;
    try {
      const r = await fetch('/api/seed', { method: 'POST' });
      const d = await r.json();
      showToast('Seeded ' + d.inserted + ' entries!', 'success');
      await Promise.all([loadFeedback(), loadStats()]);
    } catch (err) {
      showToast('Seed failed: ' + err.message, 'error');
    } finally {
      this.innerHTML = 'Seed Demo Data';
      this.disabled = false;
    }
  });

  // ── Wipe ────────────────────────────────────────────────
  document.getElementById('wipeBtn').addEventListener('click', async function () {
    if (!confirm('Are you sure you want to completely wipe all feedback data from the database?')) return;
    this.innerHTML = '<span class="spinner"></span>Wiping…';
    this.disabled = true;
    try {
      const r = await fetch('/api/wipe', { method: 'POST' });
      if (!r.ok) throw new Error(await r.text());
      showToast('Successfully wiped all data!', 'success');
      await Promise.all([loadFeedback(), loadStats()]);
    } catch (err) {
      showToast('Wipe failed: ' + err.message, 'error');
    } finally {
      this.innerHTML = 'Wipe Data';
      this.disabled = false;
    }
  });

  // ── Init ───────────────────────────────────────────────
  loadStats();
  loadFeedback();
})();
</script>
</body>
</html>`;
}
