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
  .clickable-stat { cursor: pointer; transition: opacity 0.2s; }
  .clickable-stat:hover { opacity: 0.7; }


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
  th.sortable { cursor: pointer; user-select: none; transition: color 0.15s; }
  th.sortable:hover { color: var(--text); }
  th.sortable .sort-icon { display: inline-block; width: 14px; text-align: center; color: var(--muted); }
  th.sortable.active { color: var(--text); }
  th.sortable.active .sort-icon { color: var(--accent); }
  tbody tr { border-bottom: 1px solid var(--border); transition: background 0.1s; cursor: pointer; }
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
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
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
    <select id="filterTheme" style="max-width: 150px;">
      <option value="">All Themes</option>
    </select>
    <button class="btn btn-outline btn-sm" id="clearFiltersBtn">Clear</button>
  </div>

  <div class="search-banner" id="searchBanner">
    <span id="searchBannerText"></span>
    <button class="btn btn-outline btn-sm" id="clearSearchBtn">Clear search</button>
  </div>

  <!-- Chart -->
  <div class="chart-wrap" style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 16px; margin-bottom: 24px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
      <h3 style="font-size: 13px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">Sentiment Over Time</h3>
      <select id="chartGrouping" style="padding: 4px 8px; font-size: 11px;">
        <option value="1">Daily</option>
        <option value="7" selected>Weekly</option>
        <option value="14">Every 2 Weeks</option>
        <option value="30">Monthly</option>
      </select>
    </div>
    <div style="height: 250px;">
      <canvas id="sentimentChart"></canvas>
    </div>
  </div>

  <!-- Table -->
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th class="sortable" data-sort="source">Source <span class="sort-icon"></span></th>
          <th class="sortable" data-sort="author">Summary / Author <span class="sort-icon"></span></th>
          <th class="sortable" data-sort="theme">Theme <span class="sort-icon"></span></th>
          <th class="sortable" data-sort="sentiment_score">Sentiment <span class="sort-icon"></span></th>
          <th class="sortable active" data-sort="created_at">Date <span class="sort-icon">▼</span></th>
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

<!-- View Feedback Modal -->
<div class="modal-overlay" id="viewModalOverlay">
  <div class="modal" style="max-width: 600px;">
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 16px;">
      <h2 id="viewModalTitle" style="margin-bottom:0;">Feedback Details</h2>
      <button type="button" class="btn btn-outline btn-sm" id="closeViewModalBtn">Close</button>
    </div>
    <div style="margin-bottom: 20px; display: flex; gap: 8px; flex-wrap: wrap;" id="viewModalBadges">
    </div>
    <div class="form-group">
      <label>Author</label>
      <div id="viewModalAuthor" style="color:var(--text); font-size:14px; background:var(--surface2); padding:8px 12px; border-radius:6px;"></div>
    </div>
    <div class="form-group">
      <label>Full Content</label>
      <div id="viewModalContent" style="color:var(--text); font-size:14px; background:var(--surface2); padding:12px; border-radius:6px; min-height: 100px; white-space: pre-wrap; line-height: 1.6;"></div>
    </div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
(function () {
  // ── State ──────────────────────────────────────────────
  let allFeedback = [];
  let searchResults = null; // null = not in search mode
  let searchQuery = '';
  let chartInstance = null;
  let sortCol = 'created_at';
  let sortDesc = true;

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
  function setupStatClickHandlers() {
    // Sentiment
    document.querySelectorAll('#statPos, #statNeu, #statNeg').forEach(el => {
      el.classList.add('clickable-stat');
      el.addEventListener('click', function() {
        let sent = '';
        if (this.id === 'statPos') sent = 'positive';
        if (this.id === 'statNeu') sent = 'neutral';
        if (this.id === 'statNeg') sent = 'negative';
        document.getElementById('filterSentiment').value = sent;
        loadFeedback();
      });
    });

    // Sources
    document.getElementById('statSources').addEventListener('click', function(e) {
      const badge = e.target.closest('.badge');
      if (!badge) return;
      const srcClass = Array.from(badge.classList).find(c => c.startsWith('src-'));
      if (srcClass) {
        document.getElementById('filterSource').value = srcClass.replace('src-', '');
        loadFeedback();
      }
    });

    // Themes (Exact DB Filtering)
    document.getElementById('statThemes').addEventListener('click', function(e) {
      const pill = e.target.closest('.pill');
      if (!pill) return;
      // Get the text without the child span count
      const themeText = pill.childNodes[0].textContent.trim();
      
      // Select it in the dropdown if available (we dynamically populated it)
      const select = document.getElementById('filterTheme');
      let found = false;
      for (const opt of select.options) {
        if (opt.value === themeText) {
          select.value = themeText;
          found = true;
          break;
        }
      }
      
      // If it's a theme not in top 5, temporarily add it to select so it can be filtered
      if (!found) {
        const tempOpt = new Option(themeText, themeText);
        select.add(tempOpt);
        select.value = themeText;
      }
      
      loadFeedback();
    });
  }

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
        .map(([k, v]) => '<span class="badge src-' + k + ' clickable-stat">' + k + ' ' + v + '</span>')
        .join('');

      const themes = d.top_themes || [];
      document.getElementById('statThemes').innerHTML = themes
        .map(t => '<span class="pill clickable-stat">' + t.theme + '<span class="count">×' + t.count + '</span></span>')
        .join('') || '<span style="color:var(--muted);font-size:12px">No themes yet</span>';
        
      // Populate theme dropdown
      const themeSelect = document.getElementById('filterTheme');
      // Keep only 'All Themes'
      themeSelect.innerHTML = '<option value="">All Themes</option>';
      themes.forEach(t => {
        themeSelect.add(new Option(t.theme, t.theme));
      });
      
      // Keep selected value if it exists
      const currentTheme = new URLSearchParams(window.location.search).get('theme') || document.getElementById('filterTheme').value;
      if (currentTheme) themeSelect.value = currentTheme;
      
      setupStatClickHandlers();
    } catch (e) {
      console.error('Stats load failed', e);
    }
  }

  // ── Feedback list ──────────────────────────────────────
  async function loadFeedback() {
    const source = document.getElementById('filterSource').value;
    const sentiment = document.getElementById('filterSentiment').value;
    const theme = document.getElementById('filterTheme').value;
    const params = new URLSearchParams();
    if (source) params.set('source', source);
    if (sentiment) params.set('sentiment', sentiment);
    if (theme) params.set('theme', theme);
    
    // Clear fuzzy search visually since we are using exact filters
    document.getElementById('searchInput').value = '';
    document.getElementById('searchBanner').classList.remove('visible');
    searchResults = null;
    searchQuery = '';
    
    try {
      const r = await fetch('/api/feedback?' + params);
      allFeedback = await r.json();
      renderTable(allFeedback, null);
    } catch (e) {
      console.error('Feedback load failed', e);
    }
  }

  function renderTable(rows, highlightIds, skipChartRender = false) {
    const tbody = document.getElementById('tableBody');
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty">No feedback found.</td></tr>';
      return;
    }
    
    const sortedRows = [...rows].sort((a, b) => {
      let valA = a[sortCol];
      let valB = b[sortCol];
      
      // Fallbacks
      if (valA == null) valA = '';
      if (valB == null) valB = '';
      
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      
      if (valA < valB) return sortDesc ? 1 : -1;
      if (valA > valB) return sortDesc ? -1 : 1;
      return 0;
    });

    tbody.innerHTML = sortedRows.map(f => {
      const hl = highlightIds && highlightIds.includes(f.id) ? ' highlighted' : '';
      return '<tr class="' + hl + '" data-id="' + f.id + '">' +
        '<td>' + sourceBadge(f.source) + '</td>' +
        '<td class="td-summary"><p>' + escHtml(f.summary || f.content.slice(0, 120)) + '</p><div class="author">@' + escHtml(f.author) + '</div></td>' +
        '<td>' + (f.theme ? '<span class="theme-pill">' + escHtml(f.theme) + '</span>' : '—') + '</td>' +
        '<td>' + sentBadge(f.sentiment, f.sentiment_score) + '</td>' +
        '<td style="color:var(--muted);font-size:12px;white-space:nowrap">' + fmt(f.created_at) + '</td>' +
        '</tr>';
    }).join('');
    
    // Add row click handlers for View Modal
    tbody.querySelectorAll('tr[data-id]').forEach(tr => {
      tr.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const fb = allFeedback.find(x => x.id === id) || (searchResults && searchResults.find(x => x.id === id));
        if (fb) openViewModal(fb);
      });
    });
    
    if (!skipChartRender) {
      renderChart(rows);
    }
  }

  function renderChart(data) {
    const ctx = document.getElementById('sentimentChart').getContext('2d');
    
    if (chartInstance) {
      chartInstance.destroy();
    }
    
    if (!data || data.length === 0) {
      return;
    }

    // Sort chronologically ascending for the chart
    const sortedData = [...data].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    // Group by selected interval and calculate average sentiment
    const groupingDays = parseInt(document.getElementById('chartGrouping').value, 10);
    const msPerInterval = groupingDays * 24 * 60 * 60 * 1000;
    
    const intervalStats = {};
    sortedData.forEach(item => {
      const d = new Date(item.created_at);
      
      let intervalKey;
      if (groupingDays === 1) {
        intervalKey = d.toISOString().split('T')[0];
      } else {
        // Floor to the nearest interval starting epoch
        const intervalTime = Math.floor(d.getTime() / msPerInterval) * msPerInterval;
        const intervalDate = new Date(intervalTime);
        intervalKey = intervalDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }

      if (!intervalStats[intervalKey]) {
        intervalStats[intervalKey] = { sum: 0, count: 0, items: [] };
      }
      intervalStats[intervalKey].sum += item.sentiment_score;
      intervalStats[intervalKey].count += 1;
      intervalStats[intervalKey].items.push(item);
    });

    const labels = Object.keys(intervalStats);
    const dataPoints = labels.map(key => intervalStats[key].sum / intervalStats[key].count);

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Average Sentiment',
          data: dataPoints,
          borderColor: '#58a6ff',
          backgroundColor: 'rgba(88, 166, 255, 0.2)',
          borderWidth: 2,
          pointBackgroundColor: dataPoints.map(val => val > 0 ? '#3fb950' : val < 0 ? '#f85149' : '#8b949e'),
          pointBorderColor: '#161b22',
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (e, activeElements) => {
          if (activeElements.length > 0) {
            const index = activeElements[0].index;
            const label = labels[index];
            const clickedItems = intervalStats[label].items;
            
            // Filter the table securely
            searchQuery = 'chart-filter';
            searchResults = clickedItems;
            
            const banner = document.getElementById('searchBanner');
            banner.classList.add('visible');
            document.getElementById('searchBannerText').textContent =
               'Showing ' + clickedItems.length + ' feedback entries for ' + label;
            
            // skip re-rendering chart so it stays visible
            renderTable(clickedItems, null, true); 
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => \` Avg Sentiment: \${ctx.raw.toFixed(2)} (\${intervalStats[ctx.label].count} feedback)\`
            }
          }
        },
        scales: {
          y: {
            min: -1,
            max: 1,
            grid: { color: '#30363d' },
            ticks: { color: '#8b949e' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#8b949e' }
          }
        }
      }
    });
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
  document.getElementById('filterTheme').addEventListener('change', loadFeedback);
  document.getElementById('chartGrouping').addEventListener('change', () => {
    // Just re-render the chart with current data instead of a full reload
    renderChart(allFeedback.length && searchResults ? searchResults : allFeedback);
  });
  document.getElementById('clearFiltersBtn').addEventListener('click', function () {
    document.getElementById('filterSource').value = '';
    document.getElementById('filterSentiment').value = '';
    document.getElementById('filterTheme').value = '';
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

  // View Modal
  function openViewModal(fb) {
    document.getElementById('viewModalAuthor').textContent = '@' + fb.author;
    document.getElementById('viewModalContent').textContent = fb.content;
    
    const badgesHtml = sourceBadge(fb.source) + sentBadge(fb.sentiment, fb.sentiment_score) + 
      (fb.theme ? '<span class="theme-pill">' + escHtml(fb.theme) + '</span>' : '') +
      '<span style="color:var(--muted);font-size:12px;margin-left:auto;">' + fmt(fb.created_at) + '</span>';
      
    document.getElementById('viewModalBadges').innerHTML = badgesHtml;
    document.getElementById('viewModalOverlay').classList.add('open');
  }

  document.getElementById('closeViewModalBtn').addEventListener('click', () => {
    document.getElementById('viewModalOverlay').classList.remove('open');
  });

  document.getElementById('viewModalOverlay').addEventListener('click', function (e) {
    if (e.target === this) {
      this.classList.remove('open');
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

  // ── Sorting ────────────────────────────────────────────
  document.querySelectorAll('th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.getAttribute('data-sort');
      if (sortCol === col) {
        sortDesc = !sortDesc;
      } else {
        sortCol = col;
        sortDesc = (col === 'created_at' || col === 'sentiment_score');
      }
      
      document.querySelectorAll('th.sortable').forEach(el => {
        el.classList.remove('active');
        el.querySelector('.sort-icon').textContent = '';
      });
      th.classList.add('active');
      th.querySelector('.sort-icon').textContent = sortDesc ? '▼' : '▲';
      
      renderTable(searchResults ? searchResults : allFeedback, null);
    });
  });

  // ── Init ───────────────────────────────────────────────
  loadStats();
  loadFeedback();
})();
</script>
</body>
</html>`;
}
