/* SecForge — engine: state, XP, levels, badges, streaks, storage, hash router */
'use strict';

/* visible error trap: a failed startup must never look like a hang */
window.addEventListener('error', (e) => {
  const v = document.getElementById('view');
  if (v && !v.dataset.err) {
    v.dataset.err = '1';
    v.innerHTML = '<div class="card" style="border-color:var(--bad)"><h3>Startup error</h3><pre class="mono small">' +
      String(e.message) + '\n' + (e.filename || '') + ':' + (e.lineno || '') + '</pre></div>';
  }
});

/* ---------- data registry ---------- */
const MODULES = [M0, M1, M2, M3, M4, M5, M6, M7, M8, M9, M10, M11];
const LABS = [...LABS_A, ...LABS_B];
const byId = (arr, id) => arr.find(x => x.id === id);

/* ---------- persistent state ---------- */
const DEFAULT_STATE = {
  xp: 0,
  lessonsDone: [],        // "m0/l1"
  quizzes: {},            // moduleId -> { best: pct, passed: bool, last: pct }
  labsDone: [],           // labId
  badges: [],             // badgeId
  labScores: {},          // labId -> last score (for re-runs)
  quizScores: {},         // moduleId -> last pct
  rushBest: 0,
  streak: 0,
  lastDay: null,
  careerFits: {},         // careerId -> fit points
  createdAt: null,
};

const SAVE_KEY = 'secforge_save_v1';

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      return Object.assign({}, DEFAULT_STATE, s);
    }
  } catch (e) { /* corrupted or unavailable */ }
  const fresh = Object.assign({}, DEFAULT_STATE);
  fresh.createdAt = new Date().toISOString();
  return fresh;
}

let S = loadState();

function save() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { /* private mode */ }
}

function exportSave() {
  const blob = JSON.stringify(S, null, 2);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([blob], { type: 'application/json' }));
  a.download = 'secforge-progress.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

function importSaveFile(file) {
  const r = new FileReader();
  r.onload = () => {
    try {
      const obj = JSON.parse(r.result);
      S = Object.assign({}, DEFAULT_STATE, obj);
      save(); refreshChrome(); toast('Progress imported ✓', 'good');
      render();
    } catch (e) { toast('Import failed: not a valid SecForge save', ''); }
  };
  r.readAsText(file);
}

function hardReset() {
  S = Object.assign({}, DEFAULT_STATE);
  S.createdAt = new Date().toISOString();
  save(); refreshChrome(); render();
}

/* ---------- streak ---------- */
function touchStreak() {
  const today = new Date().toISOString().slice(0, 10);
  if (S.lastDay === today) return;
  const yest = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  S.streak = (S.lastDay === yest) ? (S.streak || 0) + 1 : 1;
  S.lastDay = today;
  save(); refreshChrome();
  if (S.streak > 1) toast(`🔥 ${S.streak}-day streak!`, 'gold');
}

/* ---------- XP / level ---------- */
function levelInfo(xp) {
  let cur = TRACK.levels[0];
  for (const l of TRACK.levels) if (xp >= l.xp) cur = l;
  const next = TRACK.levels.find(l => l.xp > xp) || null;
  const base = cur.xp;
  const span = next ? next.xp - base : 1;
  const into = xp - base;
  return { level: cur.n, title: cur.title, pct: next ? Math.min(100, Math.round(into / span * 100)) : 100, next };
}

function addXP(amount, reason) {
  if (!amount) return;
  const before = levelInfo(S.xp).level;
  S.xp += amount;
  save(); refreshChrome();
  toast(`+${amount} XP · ${reason}`, '');
  const after = levelInfo(S.xp).level;
  if (after > before) {
    const info = levelInfo(S.xp);
    toast(`⬆ LEVEL ${info.level} — ${info.title}`, 'gold');
    checkBadge('architect');
  }
}

/* ---------- badges ---------- */
function checkBadge(id) {
  if (S.badges.includes(id)) return;
  const b = byId(BADGES, id);
  if (!b) return;
  let earned = false;
  switch (id) {
    case 'first-lesson': earned = S.lessonsDone.length >= 1; break;
    case 'quiz-ace': earned = Object.values(S.quizzes).some(q => q.best >= 100); break;
    case 'all-quizzes': earned = MODULES.every(m => S.quizzes[m.id] && S.quizzes[m.id].passed); break;
    case 'all-labs': earned = LABS.every(l => S.labsDone.includes(l.id)); break;
    case 'architect': earned = levelInfo(S.xp).level >= 9; break;
    case 'rush-10': earned = S.rushBest >= 10; break;
    case 'rush-20': earned = S.rushBest >= 20; break;
    default: earned = S.labsDone.includes(BADGE_LAB_MAP[id] || id);
  }
  if (earned) {
    S.badges.push(id); save();
    toast(`${b.ico} Badge earned: ${b.name}`, 'gold');
  }
}

const BADGE_LAB_MAP = {
  'phish-hunter': 'phishing', 'threat-modeler': 'threatmodel', 'identity-guru': 'idor',
  'incident-cmdr': 'incident', 'zt-architect': 'zerotrust', 'log-reader': 'soc',
  'purple': 'purple', 'quant': 'calc', 'dr-ready': 'dr', 'ai-guardian': 'prompt',
  'storyteller': 'kpi', 'capstone-done': 'capstone-lab',
};

function checkAllBadges() {
  BADGES.forEach(b => checkBadge(b.id));
}

/* ---------- completion helpers ---------- */
function moduleProgress(m) {
  const lessons = m.lessons.length;
  const done = m.lessons.filter(l => S.lessonsDone.includes(`${m.id}/${l.id}`)).length;
  const quiz = S.quizzes[m.id];
  const quizPart = quiz && quiz.passed ? 1 : 0;
  return { done, lessons, quizPart, pct: Math.round((done + quizPart) / (lessons + 1) * 100) };
}

function overallProgress() {
  let total = 0, sum = 0;
  MODULES.forEach(m => { total += 100; sum += moduleProgress(m).pct; });
  return Math.round(sum / total * 100);
}

function labCompletion() {
  return Math.round(S.labsDone.length / LABS.length * 100);
}

/* ---------- toast ---------- */
function toast(msg, cls) {
  const root = document.getElementById('toast-root');
  const el = document.createElement('div');
  el.className = 'toast ' + (cls || '');
  el.textContent = msg;
  root.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .4s'; }, 3400);
  setTimeout(() => el.remove(), 3900);
}

/* ---------- chrome refresh (sidebar/topbar) ---------- */
function refreshChrome() {
  const info = levelInfo(S.xp);
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('side-level', info.level);
  set('side-title', info.title);
  set('side-xptext', `${S.xp} XP${info.next ? ' · next: ' + info.next.xp : ' · MAX'}`);
  set('xp-n', S.xp);
  set('streak-n', S.streak || 0);
  const bar = document.getElementById('side-xpbar');
  if (bar) bar.style.width = info.pct + '%';
}

/* ---------- hash router ---------- */
const ROUTES = {};
function route(pattern, fn) { ROUTES[pattern] = fn; }

function parseHash() {
  const h = location.hash.replace(/^#/, '') || '/';
  const parts = h.split('/').filter(Boolean);
  return { path: h, seg: parts };
}

function navigate(hash) { location.hash = hash; }

function render() {
  const { seg } = parseHash();
  const view = document.getElementById('view');
  const crumb = document.getElementById('crumb');
  view.innerHTML = '';
  window.scrollTo(0, 0);

  // route resolution
  let name = seg[0] || 'dashboard';
  let arg = seg.slice(1).join('/') || null;
  let fn = ROUTES[name] || ROUTES['dashboard'];
  document.querySelectorAll('#nav a').forEach(a => {
    a.classList.toggle('active', a.dataset.route === name);
  });
  if (window.innerWidth <= 920) document.getElementById('sidebar').classList.remove('open');
  fn(view, arg, crumb);
  checkAllBadges();
}

window.addEventListener('hashchange', render);

/* ---------- boot ---------- */
function boot() {
  touchStreak();
  refreshChrome();
  document.getElementById('menu-btn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
  render();
}

/* ---------- small dom helpers ---------- */
function h(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}
/* append ALL top-level nodes (for multi-root html like "<h1>..</h1><p>..</p>") */
function ha(parent, html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  [...t.content.childNodes].forEach(n => parent.appendChild(n));
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
