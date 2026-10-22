/* SecForge — views & lab renderers */
'use strict';

/* ================= DASHBOARD ================= */
route('dashboard', (v) => {
  const info = levelInfo(S.xp);
  const nextLab = LABS.find(l => !S.labsDone.includes(l.id));
  const nextMod = MODULES.find(m => moduleProgress(m).pct < 100);
  const doneL = S.lessonsDone.length, totalL = MODULES.reduce((a, m) => a + m.lessons.length, 0);
  v.appendChild(h(`<div class="hero">
    <div class="tagline">$ whoami → future_security_architect</div>
    <h1>Forge yourself into a <b style="background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent">Security Architect</b>.</h1>
    <p class="sub">A full training ground: <b>${MODULES.length} theory modules</b>, <b>${LABS.length} hands-on labs</b>, the <b>Phish Rush arcade</b>, and a map of the <b>entire cybersecurity field</b>. Free, offline-capable, progress saved locally.</p>
    <div class="btnrow">
      <button class="btn primary" id="cta-continue">${(doneL || S.labsDone.length) ? '▶ Continue training' : '▶ Start training'}</button>
      <a class="btn ghost" href="#/rush">⚡ Quick round: Phish Rush</a>
    </div>
    <div class="statrow">
      <div class="stat"><div class="n">${info.level}</div><div class="l">Level · ${info.title}</div></div>
      <div class="stat"><div class="n">${S.xp}</div><div class="l">Total XP</div></div>
      <div class="stat"><div class="n">${S.streak || 0}🔥</div><div class="l">Day streak</div></div>
      <div class="stat"><div class="n">${doneL}/${totalL}</div><div class="l">Lessons</div></div>
      <div class="stat"><div class="n">${S.labsDone.length}/${LABS.length}</div><div class="l">Labs</div></div>
      <div class="stat"><div class="n">${S.badges.length}/${BADGES.length}</div><div class="l">Badges</div></div>
    </div>
  </div>`));
  v.querySelector('#cta-continue').onclick = () => navigate(nextMod ? '#/module/' + nextMod.id : (nextLab ? '#/lab/' + nextLab.id : '#/academy'));

  ha(v, '<h2>Your tracks</h2><div class="grid g3" id="dash-tracks"></div>');
  const tracks = v.querySelector('#dash-tracks');
  tracks.appendChild(h(`<div class="card click" data-go="#/academy">
    <h3>▤ Academy</h3><p class="muted small">12 modules from CIA triad to the capstone. Theory → quiz → mastery.</p>
    <div class="prog"><div style="width:${overallProgress()}%"></div></div><p class="small muted" style="margin:8px 0 0">${overallProgress()}% complete</p></div>`));
  tracks.appendChild(h(`<div class="card click" data-go="#/labs">
    <h3>🧪 Labs</h3><p class="muted small">Phishing forensics, OWASP, incident command, zero trust, AI security, capstone triage…</p>
    <div class="prog"><div style="width:${labCompletion()}%"></div></div><p class="small muted" style="margin:8px 0 0">${labCompletion()}% complete</p></div>`));
  tracks.appendChild(h(`<div class="card click" data-go="#/rush">
    <h3>⚡ Phish Rush</h3><p class="muted small">60-second arcade: phish or legit? Combos, streaks, best: <b class="mono">${S.rushBest}</b>.</p>
    <div class="prog"><div style="width:${Math.min(100, S.rushBest * 4)}%"></div></div><p class="small muted" style="margin:8px 0 0">Personal best: ${S.rushBest}</p></div>`));
  tracks.appendChild(h(`<div class="card click" data-go="#/careers">
    <h3>◈ Career Map</h3><p class="muted small">All ${CAREERS.length} major cybersecurity roles: pay, skills, certs, entry paths — and how they feed the architect role.</p>
    <p class="small muted" style="margin:8px 0 0">Explore the field →</p></div>`));
  tracks.appendChild(h(`<div class="card click" data-go="#/resources">
    <h3>❖ Resources</h3><p class="muted small">Curated external platforms, free standards, cert ladder, communities.</p>
    <p class="small muted" style="margin:8px 0 0">The companion library →</p></div>`));
  tracks.appendChild(h(`<div class="card click" data-go="#/settings">
    <h3>🏅 Badges & save</h3><p class="muted small">${S.badges.length}/${BADGES.length} badges earned. Export/import progress, offline install guide.</p>
    <p class="small muted" style="margin:8px 0 0">Manage →</p></div>`));
  tracks.querySelectorAll('[data-go]').forEach(c => c.onclick = () => navigate(c.dataset.go));

  ha(v, `<h2>Badges</h2><div class="badge-grid">${BADGES.map(b =>
    `<div class="badge ${S.badges.includes(b.id) ? 'earned' : ''}"><span class="bi">${b.ico}</span><div><div class="bn">${b.name}</div><div class="bd">${b.desc}</div></div></div>`).join('')}</div>`);
  v.appendChild(h(`<div class="sec-note">// progress is stored locally in your browser — export it from Settings before switching devices</div>`));
});

/* ================= ACADEMY ================= */
route('academy', (v, _, crumb) => {
  crumb.textContent = 'Academy';
  ha(v, `<h1>Academy</h1><p class="sub">The theory spine. Do lessons, pass the quiz (70%+), unlock the next module. Capstone requires everything else.</p>`);
  MODULES.forEach(m => {
    const p = moduleProgress(m);
    const locked = isModuleLocked(m);
    const el = h(`<div class="row ${p.pct === 100 ? 'done' : ''}">
      <div class="num">${m.num}</div>
      <div style="flex:1">
        <div class="t">${m.title} ${p.pct === 100 ? '<span class="tick">✓</span>' : ''} ${locked ? '<span class="pill">🔒 locked</span>' : ''}</div>
        <div class="small muted">${m.sub}</div>
        <div class="prog"><div style="width:${p.pct}%"></div></div>
      </div>
      <div class="small muted mono">${m.mins}m · ${p.pct}%</div>
    </div>`);
    if (!locked) el.onclick = () => navigate('#/module/' + m.id);
    else el.onclick = () => toast('Complete the previous modules to unlock this one.', '');
    v.appendChild(el);
  });
});

function isModuleLocked(m) {
  const i = MODULES.indexOf(m);
  if (i === 0) return false;
  if (m.id === 'm11') { // capstone: all previous quizzes passed
    return !MODULES.slice(0, 11).every(x => S.quizzes[x.id] && S.quizzes[x.id].passed);
  }
  const prev = MODULES[i - 1];
  return !(S.quizzes[prev.id] && S.quizzes[prev.id].passed);
}

/* ================= MODULE PAGE ================= */
route('module', (v, mid, crumb) => {
  const m = byId(MODULES, mid) || MODULES[0];
  crumb.textContent = m.title;
  const p = moduleProgress(m);
  v.appendChild(h(`<div class="hero" style="padding:24px">
    <div class="tagline">module ${m.num} · ${m.mins} min · +${m.quiz.xp} XP on quiz pass</div>
    <h1>${m.title}</h1><p class="sub" style="margin-bottom:8px">${m.sub}</p>
    <div class="prog"><div style="width:${p.pct}%"></div></div>
  </div>`));
  m.lessons.forEach((l, i) => {
    const done = S.lessonsDone.includes(`${m.id}/${l.id}`);
    const el = h(`<div class="row ${done ? 'done' : ''}">
      <div class="num">${i + 1}</div><div class="t">${l.title}</div>
      <div class="small muted mono">${l.mins}m</div>${done ? '<span class="tick">✓</span>' : ''}
    </div>`);
    el.onclick = () => navigate(`#/lesson/${m.id}/${l.id}`);
    v.appendChild(el);
  });
  const q = S.quizzes[m.id];
  const quizRow = h(`<div class="row ${q && q.passed ? 'done' : ''}" style="border-style:dashed">
    <div class="num">✎</div><div class="t">Module Quiz — ${m.quiz.questions.length} questions · pass at ${Math.round(m.quiz.pass * 100)}%</div>
    <div class="small muted mono">${q ? 'best ' + q.best + '%' : 'not taken'}</div>${q && q.passed ? '<span class="tick">✓</span>' : ''}
  </div>`);
  quizRow.onclick = () => navigate('#/quiz/' + m.id);
  v.appendChild(quizRow);
});

/* ================= LESSON ================= */
route('lesson', (v, arg, crumb) => {
  const [mid, lid] = arg.split('/');
  const m = byId(MODULES, mid), l = m.lessons.find(x => x.id === lid);
  crumb.textContent = `${m.title} · ${l.title}`;
  const idx = m.lessons.indexOf(l);
  const key = `${m.id}/${l.id}`;
  v.appendChild(h(`<div class="lesson-body">
    <div class="tagline">lesson ${idx + 1} of ${m.lessons.length} · ${l.mins} min</div>
    <h1>${l.title}</h1>
    ${l.body}
    ${l.callout ? `<div class="callout">${l.callout}</div>` : ''}
    ${l.terms ? `<h3>Key terms</h3><div class="terms">${l.terms.map(t => `<span class="term"><b>${t[0]}</b> — ${t[1]}</span>`).join('')}</div>` : ''}
  </div>`));
  const nav = h(`<div class="lesson-nav"></div>`);
  if (idx > 0) {
    const prev = h(`<button class="btn ghost">← ${m.lessons[idx - 1].title}</button>`);
    prev.onclick = () => navigate(`#/lesson/${m.id}/${m.lessons[idx - 1].id}`);
    nav.appendChild(prev);
  }
  nav.appendChild(h('<span style="flex:1"></span>'));
  const nextBtn = h(`<button class="btn primary">${idx < m.lessons.length - 1 ? 'Next: ' + m.lessons[idx + 1].title + ' →' : 'Finish module → quiz'}</button>`);
  nextBtn.onclick = () => {
    if (!S.lessonsDone.includes(key)) { S.lessonsDone.push(key); save(); addXP(20, 'Lesson complete'); touchStreak(); }
    if (idx < m.lessons.length - 1) navigate(`#/lesson/${m.id}/${m.lessons[idx + 1].id}`);
    else navigate('#/quiz/' + m.id);
  };
  nav.appendChild(nextBtn);
  v.appendChild(nav);
});

/* ================= QUIZ ================= */
route('quiz', (v, mid, crumb) => {
  const m = byId(MODULES, mid);
  crumb.textContent = 'Quiz · ' + m.title;
  const Q = m.quiz.questions;
  let i = 0, correct = 0;

  function draw() {
    v.innerHTML = '';
    if (i >= Q.length) return finish();
    ha(v, `<div class="tagline">question ${i + 1} / ${Q.length} · ${m.title}</div>
      <div class="qprog"><div style="width:${(i / Q.length) * 100}%"></div></div>
      <div class="qq">${Q[i].q}</div>`);
    const opts = Q[i].opts.map((o, oi) => h(`<button class="opt" data-i="${oi}">${o}</button>`));
    opts.forEach(btn => btn.onclick = () => {
      const pick = +btn.dataset.i, ok = pick === Q[i].correct;
      opts.forEach((b, bi) => {
        b.disabled = true;
        if (bi === Q[i].correct) b.classList.add('correct');
        else if (bi === pick) b.classList.add('wrong');
      });
      if (ok) correct++;
      v.appendChild(h(`<div class="explain ${ok ? 'good' : 'bad'}"><b>${ok ? '✓ Correct.' : '✗ Not quite.'}</b> ${Q[i].why}</div>`));
      v.appendChild(h('<div class="btnrow"><button class="btn primary" id="qn">Next →</button></div>'));
      v.querySelector('#qn').onclick = () => { i++; draw(); };
    });
    opts.forEach(o => v.appendChild(o));
  }

  function finish() {
    const pct = Math.round(correct / Q.length * 100);
    const passed = pct >= m.quiz.pass * 100;
    const prevBest = (S.quizzes[m.id] || {}).best || 0;
    S.quizzes[m.id] = { best: Math.max(prevBest, pct), passed: passed || ((S.quizzes[m.id] || {}).passed || false), last: pct };
    save(); touchStreak();
    const firstPass = passed && !(prevBest >= m.quiz.pass * 100);
    if (firstPass) addXP(m.quiz.xp, 'Quiz passed');
    v.innerHTML = '';
    v.appendChild(h(`<div class="card" style="max-width:560px;margin:40px auto;text-align:center;padding:36px">
      <div style="font-size:52px">${passed ? '🏆' : '📖'}</div>
      <h2 style="margin:8px 0">${pct}% — ${passed ? 'passed' : 'keep studying'}</h2>
      <p class="muted">${correct} of ${Q.length} correct · best: ${Math.max(prevBest, pct)}%</p>
      ${firstPass ? `<p class="pill cyan" style="display:inline-flex">+${m.quiz.xp} XP earned</p>` : ''}
      <div class="btnrow" style="justify-content:center">
        <button class="btn ghost" id="rq">↻ Retake</button>
        <button class="btn primary" id="bm">${passed ? (MODULES.indexOf(m) < MODULES.length - 1 ? 'Next module →' : 'Academy complete!') : 'Back to lessons'}</button>
      </div>
    </div>`));
    v.querySelector('#rq').onclick = () => { i = 0; correct = 0; draw(); };
    v.querySelector('#bm').onclick = () => {
      if (passed) {
        const next = MODULES[MODULES.indexOf(m) + 1];
        navigate(next ? '#/module/' + next.id : '#/academy');
      } else navigate('#/module/' + m.id);
    };
  }
  draw();
});

/* ================= LABS INDEX ================= */
route('labs', (v, _, crumb) => {
  crumb.textContent = 'Labs';
  ha(v, `<h1>Hands-on Labs</h1><p class="sub">Applied simulations: flag the phish, match the attack, command the incident, design the defense. Labs gate on related modules but stay open — jump in.</p>`);
  LABS.forEach(l => {
    const done = S.labsDone.includes(l.id);
    const el = h(`<div class="row ${done ? 'done' : ''}">
      <div class="num">${l.num}</div>
      <div style="flex:1"><div class="t">${l.title} ${done ? '<span class="tick">✓</span>' : ''}</div>
      <div class="small muted">${l.desc}</div></div>
      <div class="small muted mono">+${l.xp} XP</div>
    </div>`);
    el.onclick = () => navigate('#/lab/' + l.id);
    v.appendChild(el);
  });
});

/* ================= LAB DISPATCH ================= */
route('lab', (v, lid, crumb) => {
  const l = byId(LABS, lid) || LABS[0];
  crumb.textContent = 'Lab ' + l.num + ' · ' + l.title;
  v.appendChild(h(`<div class="lab-shell">
    <div class="lab-head"><div>
      <div class="tagline">lab ${l.num} · type: ${l.type} · +${l.xp} XP</div>
      <h1>${l.title}</h1><p class="desc">${l.intro}</p>
    </div></div>
  </div>`));
  const shell = v.querySelector('.lab-shell');
  if (l.type === 'flags') renderFlagsLab(shell, l);
  else if (l.type === 'match') renderMatchLab(shell, l);
  else if (l.type === 'branch') renderBranchLab(shell, l);
  else if (l.type === 'calc') renderCalcLab(shell, l);
});

function labComplete(l, scorePct, extra) {
  if (!S.labsDone.includes(l.id)) {
    S.labsDone.push(l.id);
    const xp = Math.round(l.xp * Math.max(0.5, scorePct / 100));
    addXP(xp, 'Lab complete');
  }
  S.labScores[l.id] = scorePct;
  save(); touchStreak();
  if (extra) extra();
}

/* ---------- flags lab (phishing & SOC logs) ---------- */
function renderFlagsLab(shell, lab) {
  let ei = 0;
  function renderEmail() {
    const E = lab.emails[ei];
    const allFlags = [...E.flags.map(f => f.id)];
    if (!allFlags.includes(E.fromFlag)) allFlags.push(E.fromFlag);
    shell.querySelectorAll('.panelize').forEach(p => p.remove());
    const panel = h(`<div class="panelize">
      <div class="scoreboard"><span>Email ${ei + 1} / ${lab.emails.length}</span><span id="fl-count">flags clicked: 0</span></div>
      <div class="email" style="margin-top:12px">
        <div class="email-bar"><i></i><i></i><i></i></div>
        <div class="email-meta">
          <div class="mrow"><span class="mk">From</span><span class="fl" data-flag="${E.fromFlag || E.flags[0].id}">${esc(E.from)}</span></div>
          <div class="mrow"><span class="mk">Subject</span><span>${esc(E.subject)}</span></div>
          <div class="mrow"><span class="mk">Date</span><span>${esc(E.date)}</span></div>
          <div class="mrow"><span class="mk">To</span><span>${esc(E.to)}</span></div>
        </div>
        <div class="email-body">${E.bodyHtml}</div>
      </div>
      <div class="btnrow"><button class="btn primary" id="fl-submit">Submit analysis →</button>
      <span class="small muted" style="align-self:center">Click every suspicious element in the email above. Innocent elements penalize.</span></div>
      <div id="fl-verdicts"></div><div id="fl-questions"></div>
    </div>`);
    shell.appendChild(panel);
    const clicked = new Set();
    panel.querySelectorAll('.fl').forEach(el => {
      el.addEventListener('click', () => {
        const f = el.dataset.flag;
        if (clicked.has(f)) { clicked.delete(f); el.classList.remove('sel'); }
        else { clicked.add(f); el.classList.add('sel'); }
        panel.querySelector('#fl-count').textContent = 'flags clicked: ' + clicked.size;
      });
    });
    panel.querySelector('#fl-submit').onclick = () => {
      if (!clicked.size) { toast('Click at least one element first.', ''); return; }
      panel.querySelectorAll('.fl').forEach(el => { el.classList.remove('sel'); });
      const truePos = E.flags.map(f => f.id);
      let hit = 0, missed = 0, fp = 0;
      const vwrap = panel.querySelector('#fl-verdicts');
      allFlags.forEach(fid => {
        const def = E.flags.find(f => f.id === fid) || E.senderTrap;
        const el = panel.querySelector(`.fl[data-flag="${fid}"]`);
        const isTrue = truePos.includes(fid);
        const wasClicked = clicked.has(fid);
        if (isTrue && wasClicked) { hit++; el.classList.add('hit'); }
        else if (isTrue && !wasClicked) { missed++; el.classList.add('miss'); }
        else if (!isTrue && wasClicked) { fp++; el.classList.add('fp'); }
        else el.classList.add('hit');
        vwrap.appendChild(h(`<div class="fv ${isTrue ? 'good' : 'bad'}"><b>${isTrue ? (wasClicked ? '[FOUND]' : '[MISSED]') : '[FALSE FLAG]'}</b> ${def.label}<br><span class="muted">${def.why}</span></div>`));
      });
      const flagScore = truePos.length ? Math.max(0, Math.round((hit - fp * 0.5) / truePos.length * 100)) : 100;
      vwrap.appendChild(h(`<div class="scoreband"><span>Evidence score</span><span class="big">${flagScore}%</span><span class="small muted">hit ${hit} · missed ${missed} · false flags ${fp}</span></div>`));
      panel.querySelector('#fl-submit').disabled = true;
      renderQuestions(E, flagScore);
    };

    function renderQuestions(E, flagScore) {
      const qw = panel.querySelector('#fl-questions');
      let qi = 0, qcorrect = 0;
      (function drawQ() {
        if (qi >= E.questions.length) {
          const qPct = Math.round(qcorrect / E.questions.length * 100);
          const total = Math.round(flagScore * 0.5 + qPct * 0.5);
          qw.appendChild(h(`<div class="scoreband"><span>EMAIL COMPLETE</span><span class="big">${total}%</span>
            <button class="btn primary sm" id="fl-next">${ei < lab.emails.length - 1 ? 'Next email →' : 'Finish lab'}</button></div>`));
          qw.querySelector('#fl-next').onclick = () => {
            if (ei < lab.emails.length - 1) { ei++; renderEmail(); }
            else {
              const best = Math.max(total, (S.labScores[lab.id] || 0));
              labComplete(lab, best);
              qw.appendChild(h(`<div class="scoreband" style="border-color:var(--good)"><span>🏅 LAB COMPLETE</span><span class="big">${best}%</span>
               <button class="btn sm" onclick="location.hash='#/labs'">Back to labs</button></div>`));
              checkAllBadges();
            }
          };
          return;
        }
        const q = E.questions[qi];
        const qEl = h(`<div style="margin-top:14px"><div class="qq" style="font-size:15px">${q.q}</div></div>`);
        q.opts.forEach((o, oi) => {
          const b = h(`<button class="opt" style="font-size:13px">${o}</button>`);
          b.onclick = () => {
            qEl.querySelectorAll('.opt').forEach((x, xi) => { x.disabled = true; if (xi === q.correct) x.classList.add('correct'); else if (x === b) x.classList.add('wrong'); });
            if (oi === q.correct) qcorrect++;
            qEl.appendChild(h(`<div class="explain ${oi === q.correct ? 'good' : 'bad'}">${q.why}</div>`));
            qEl.appendChild(h('<button class="btn sm" style="margin-top:8px">Next →</button>')).onclick = () => { qi++; drawQ(); };
          };
          qEl.appendChild(b);
        });
        qw.appendChild(qEl);
      })();
    }
  }
  renderEmail();
}

/* ---------- match lab ---------- */
function renderMatchLab(shell, lab) {
  const panel = h(`<div class="panelize"><div id="match-rows"></div>
    <div class="btnrow"><button class="btn primary" id="m-submit">Submit all answers →</button></div>
    <div id="m-results"></div></div>`);
  shell.appendChild(panel);
  const rows = panel.querySelector('#match-rows');
  lab.items.forEach((it, i) => {
    const row = h(`<div class="mrow" id="mrow-${i}">
      <div class="mt"><div class="codeblock">${esc(it.code)}</div></div>
      <select><option value="-1">— select attack class —</option>${it.opts.map((o, oi) => `<option value="${oi}">${o}</option>`).join('')}</select>
    </div>`);
    rows.appendChild(row);
  });
  panel.querySelector('#m-submit').onclick = () => {
    let correct = 0;
    const res = panel.querySelector('#m-results');
    res.innerHTML = '';
    lab.items.forEach((it, i) => {
      const sel = +panel.querySelector(`#mrow-${i} select`).value;
      const row = panel.querySelector(`#mrow-${i}`);
      if (sel < 0) { row.classList.add('bad'); return; }
      const ok = sel === it.correct;
      if (ok) correct++;
      row.classList.add(ok ? 'good' : 'bad');
      row.appendChild(h(`<div class="ans">${ok ? '<b>✓ correct</b>' : '<b style="color:var(--bad)">✗ it was: ' + it.opts[it.correct] + '</b>'}<br><span class="muted">${it.why}</span><br><span style="color:var(--cyan)">The fix: ${it.fix}</span></div>`));
    });
    const pct = Math.round(correct / lab.items.length * 100);
    labComplete(lab, pct);
    res.appendChild(h(`<div class="scoreband"><span>${pct === 100 ? '🏅 LAB COMPLETE — flawless' : 'Score (retake anytime)'}</span><span class="big">${pct}%</span>
      <button class="btn sm" onclick="location.hash='#/labs'">Done</button></div>`));
    panel.querySelector('#m-submit').disabled = true;
    checkAllBadges();
  };
}

/* ---------- branch lab (scenario decision engine) ---------- */
function renderBranchLab(shell, lab) {
  let si = 0, earned = 0, max = 0;
  lab.steps.forEach(s => s.choices.forEach(c => { if (c.pts > max) max += c.pts; }));
  function drawStep() {
    shell.querySelectorAll('.panelize').forEach(p => p.remove());
    const st = lab.steps[si];
    const panel = h(`<div class="panelize">
      <div class="console">
        <div class="console-head"><i></i><i></i><i></i><span class="cht">${esc(lab.title)} — decision ${st.step}/${lab.steps.length} — score ${earned}/${max}</span></div>
        <div class="console-body">
          <div class="prompt">architect@secforge:~$ analyze --step ${st.step}</div>
          <div class="scenario">${st.scenario}</div>
          <div id="choices"></div>
          <div id="stepfb"></div>
        </div>
      </div>
      <div class="scoreboard"><span>decision ${st.step} of ${lab.steps.length}</span><span>score ${earned} / ${max}</span></div>
    </div>`);
    shell.appendChild(panel);
    const cw = panel.querySelector('#choices');
    st.choices.forEach(c => {
      const b = h(`<button class="choice">${esc(c.t)}</button>`);
      b.onclick = () => {
        cw.querySelectorAll('.choice').forEach(x => x.disabled = true);
        b.classList.add(c.cls);
        earned += c.pts;
        const fb = panel.querySelector('#stepfb');
        fb.appendChild(h(`<div class="feedback ${c.cls}"><span class="pts">+${c.pts} / 1</span><b>${c.cls === 'good' ? '✓ Strong call. ' : c.cls === 'ok' ? '◐ Acceptable, partial. ' : '✗ Wrong. '}</b>${c.fb}</div>`));
        fb.appendChild(h('<button class="btn primary sm" style="margin-top:10px" id="step-next">' + (si < lab.steps.length - 1 ? 'Next decision →' : 'See final score →') + '</button>')).onclick = () => {
          si++;
          if (si < lab.steps.length) drawStep();
          else finish();
        };
      };
      cw.appendChild(b);
    });
  }
  function finish() {
    const pct = Math.round(earned / max * 100);
    labComplete(lab, pct);
    shell.querySelectorAll('.panelize').forEach(p => p.remove());
    const panel = h(`<div class="panelize"><div class="card" style="text-align:center;padding:36px;max-width:560px;margin:30px auto">
      <div style="font-size:52px">${pct >= 80 ? '🏅' : pct >= 50 ? '🔶' : '📕'}</div>
      <h2 style="margin:8px 0">${pct}% — ${pct >= 80 ? 'command decision' : pct >= 50 ? 'defensible, keep drilling' : 'review the module and retry'}</h2>
      <p class="muted">You earned ${earned} of ${max} decision points. Partial-credit scoring mirrors real design reviews.</p>
      <div class="btnrow" style="justify-content:center">
        <button class="btn ghost" id="retry">↻ Retry</button>
        <button class="btn primary" onclick="location.hash='#/labs'">Back to labs</button>
      </div></div></div>`);
    shell.appendChild(panel);
    panel.querySelector('#retry').onclick = () => { si = 0; earned = 0; drawStep(); };
    checkAllBadges();
  }
  drawStep();
}

/* ---------- calc lab (risk quant / DR) ---------- */
function renderCalcLab(shell, lab) {
  const fields = ['q1', 'q2', 'q3', 'q4', 'q5'];
  const panel = h(`<div class="panelize">
    <div class="calcgrid">${fields.map(k => {
      const f = lab[k];
      return `<div class="calcfield"><label>${f.label} <output id="out-${k}">${f.def}</output></label>
        <input type="range" id="in-${k}" min="${f.min}" max="${f.max}" step="${f.max - f.min <= 4 ? 1 : (f.min === 0.5 ? 0.5 : 1)}" value="${f.def}"></div>`;
    }).join('')}</div>
    <div class="btnrow"><button class="btn primary" id="calc-eval">Evaluate my design →</button></div>
    <div id="calc-fb"></div>
  </div>`);
  shell.appendChild(panel);
  fields.forEach(k => {
    panel.querySelector('#in-' + k).addEventListener('input', e => {
      panel.querySelector('#out-' + k).textContent = e.target.value;
    });
  });
  panel.querySelector('#calc-eval').onclick = () => {
    const v = {};
    fields.forEach(k => v[k] = +panel.querySelector('#in-' + k).value);
    // ALE math for the risk lab
    if (lab.id === 'calc') {
      const gross = v.q2 * v.q3 + v.q4;                       // $k per event
      const ale = v.q1 / 100 * gross * (1 - v.q5 / 100);      // $k per year
      const mdrCut = ale * 0.6, mdrRos = (mdrCut - 380) / 380 * 100;
      panel.querySelector('#calc-fb').appendChild(h(`<div class="scoreband"><span>Your computed ALE</span><span class="big">$${Math.round(ale)}k/yr</span></div>
      <div class="scoreband"><span>MDR counter-offer: 60% reduction for $380k</span><span class="big ${mdrRos >= 0 ? '' : 'mono'}">ROSI ${Math.round(mdrRos)}%</span></div>`));
    }
    const fb = panel.querySelector('#calc-fb');
    ['a1', 'a2', 'a3', 'a4', 'a5'].forEach((k, i) => {
      fb.appendChild(h(`<div class="callout ${i === 0 ? '' : 'warn'}"><b>${i === 0 ? '◆ Analysis:' : '◆ Lesson ' + i + ':'}</b> ${lab[k]}</div>`));
    });
    labComplete(lab, 100);
    fb.appendChild(h(`<div class="scoreband" style="border-color:var(--good)"><span>🏅 LAB COMPLETE</span><span class="big">100%</span>
      <button class="btn sm" onclick="location.hash='#/labs'">Done</button></div>`));
    panel.querySelector('#calc-eval').disabled = true;
    checkAllBadges();
  };
}

/* ================= PHISH RUSH (arcade) ================= */
route('rush', (v, _, crumb) => {
  crumb.textContent = 'Phish Rush';
  const DURATION = 60;
  let playing = false, idx = 0, score = 0, combo = 0, bestCombo = 0, timeLeft = DURATION, timer = null, asked = [];

  function menu() {
    playing = false;
    v.innerHTML = '';
    v.appendChild(h(`<div class="rush-wrap">
      <div class="hero" style="text-align:center;padding:40px 30px">
        <div class="tagline">arcade · 60 seconds</div>
        <h1>⚡ Phish Rush</h1>
        <p class="sub" style="margin:0 auto 6px">One email at a time. <b style="color:var(--bad)">PHISH</b> or <b style="color:var(--good)">LEGIT</b> — trust your analysis, not your inbox. Speed × accuracy × combo.</p>
        <p class="small muted">Best score: <b class="mono">${S.rushBest}</b> · +2 XP per correct, combo multiplies</p>
        <div class="btnrow" style="justify-content:center"><button class="btn primary" id="rush-start" style="font-size:16px;padding:12px 26px">▶ Start run</button></div>
      </div>
      <div class="card"><h3>Scoring</h3>
        <ul class="small muted" style="margin:8px 0 0;padding-left:18px">
          <li>Correct: <b class="mono">10 × (1 + combo×0.1)</b> pts · wrong: lose 5 pts & break combo</li>
          <li>Combo ≥ 3 shows streak fire — ride it</li>
          <li>XP converts at 1 XP per 10 points, max +40 XP per run</li>
          <li>After each verdict you get the <b>tell</b> — the transferable skill</li>
        </ul>
      </div>
    </div>`));
    v.querySelector('#rush-start').onclick = start;
  }

  function start() {
    playing = true; idx = 0; score = 0; combo = 0; bestCombo = 0; timeLeft = DURATION;
    asked = shuffle([...RUSH_EMAILS.keys()]).slice(0, 40);
    v.innerHTML = '';
    v.appendChild(h(`<div class="rush-wrap">
      <div class="rush-hud">
        <div class="cell">⏱ <b id="rh-time">60</b>s</div>
        <div class="cell">score <b id="rh-score">0</b></div>
        <div class="cell" id="rh-combo-wrap"></div>
        <div class="cell">best <b>${S.rushBest}</b></div>
      </div>
      <div class="rush-timer"><div id="rh-bar" style="width:100%"></div></div>
      <div id="rh-stage"></div>
    </div>`));
    timer = setInterval(tick, 1000);
    next();
  }

  function tick() {
    timeLeft--;
    const t = v.querySelector('#rh-time'), bar = v.querySelector('#rh-bar');
    if (t) t.textContent = timeLeft;
    if (bar) bar.style.width = (timeLeft / DURATION * 100) + '%';
    if (timeLeft <= 0) end();
  }

  function next() {
    const stage = v.querySelector('#rh-stage');
    if (!stage) return;
    if (idx >= asked.length) { end(); return; }
    const E = RUSH_EMAILS[asked[idx]];
    stage.innerHTML = '';
    const el = h(`<div class="email">
      <div class="email-bar"><i></i><i></i><i></i><span class="mono small muted" style="margin-left:auto">${idx + 1}/${asked.length}</span></div>
      <div class="email-meta">
        <div class="mrow"><span class="mk">From</span><span>${esc(E.s)}</span></div>
        <div class="mrow"><span class="mk">Subject</span><span>${esc(E.sub)}</span></div>
      </div>
      <div class="email-body"><p>${esc(E.b)}</p></div>
      <div class="verdicts">
        <div class="verdict phish" data-v="1">🎣 PHISH</div>
        <div class="verdict legit" data-v="0">✓ LEGIT</div>
      </div>
      <div id="rh-flash"></div>
    </div>`);
    stage.appendChild(el);
    el.querySelectorAll('.verdict').forEach(btn => btn.onclick = () => {
      if (!playing) return;
      const sayPhish = btn.dataset.v === '1';
      const ok = sayPhish === E.phish;
      const flash = el.querySelector('#rh-flash');
      if (ok) {
        combo++; bestCombo = Math.max(bestCombo, combo);
        score += Math.round(10 * (1 + (combo - 1) * 0.1));
      } else { combo = 0; score = Math.max(0, score - 5); }
      v.querySelector('#rh-score').textContent = score;
      v.querySelector('#rh-combo-wrap').innerHTML = combo >= 3 ? `<span class="combo">🔥 combo ×${combo}</span>` : '';
      flash.className = 'rush-flash ' + (ok ? 'good' : 'bad');
      flash.innerHTML = `${ok ? '✓' : '✗'} <b>${E.phish ? 'This was a phish.' : 'This was legit.'}</b> ${esc(E.tell)}`;
      el.querySelectorAll('.verdict').forEach(b2 => b2.style.pointerEvents = 'none');
      setTimeout(() => { idx++; next(); }, ok ? 900 : 2000);
    });
  }

  function end() {
    if (!playing) return;
    playing = false; clearInterval(timer);
    const xpGain = Math.min(40, Math.floor(score / 10));
    const isBest = score > S.rushBest;
    if (isBest) S.rushBest = score;
    if (xpGain) addXP(xpGain, 'Phish Rush run');
    save(); checkAllBadges();
    v.innerHTML = '';
    v.appendChild(h(`<div class="rush-wrap"><div class="card" style="text-align:center;padding:40px">
      <div class="tagline">time</div>
      <div class="rush-score">${score}</div>
      ${isBest ? '<div class="pill cyan" style="display:inline-flex">★ NEW PERSONAL BEST</div>' : `<div class="rush-best">personal best: ${S.rushBest}</div>`}
      <p class="muted" style="margin-top:10px">best combo this run: ×${bestCombo} · +${xpGain} XP earned</p>
      <p class="small muted"> spotting pattern: domain first, then ask "what do they want me to DO?" — credentials, payments, urgency.</p>
      <div class="btnrow" style="justify-content:center">
        <button class="btn primary" id="rush-again">↻ Run again</button>
        <a class="btn ghost" href="#/lab/phishing">Go deeper: Phishing Forensics lab →</a>
      </div>
    </div></div>`));
    v.querySelector('#rush-again').onclick = start;
  }

  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }
  menu();
});

/* ================= CAREERS ================= */
route('careers', (v, _, crumb) => {
  crumb.textContent = 'Career Map';
  ha(v, `<h1>The Cybersecurity Field, Mapped</h1>
  <p class="sub">Every major role: what the work actually is, what it pays (US ranges, 2024-2026 market), what to learn, which certs gate entry — and how each feeds the <b>Security Architect</b> endgame. Click any card.</p>`);
  const g = h('<div class="grid g2"></div>');
  CAREERS.forEach(c => {
    const el = h(`<div class="card click role-card">
      <div class="rc-top"><div class="role-ico">${c.ico}</div><div><h3 style="margin:0">${c.name}</h3>
      <span class="small muted">${c.tier} · ${c.money} · demand: ${c.demand}</span></div></div>
      <p class="small muted" style="margin:8px 0 0">${c.what}</p></div>`);
    el.onclick = () => navigate('#/career/' + c.id);
    g.appendChild(el);
  });
  v.appendChild(g);
  v.appendChild(h(`<div class="hero" style="margin-top:26px;padding:24px">
    <h3 style="margin-top:0">Not sure where to start?</h3>
    <p class="small muted">Answer three questions and get a suggested entry point. (Nothing is stored beyond your local save.)</p>
    <div id="fit-quiz"></div></div>`));
  renderFitQuiz(v.querySelector('#fit-quiz'));
});

function renderFitQuiz(box) {
  const QS = [
    { q: 'Which of these sounds most like you?', a: [
      ['Solving puzzles and breaking things', ['pentest', 'soc-analyst']],
      ['Writing code and building systems', ['appsec', 'devsecops']],
      ['Organizing chaos, process, and people', ['grc', 'ciso']],
      ['Deep infrastructure and cloud plumbing', ['cloudsec', 'seceng']]] },
    { q: 'Your current background?', a: [
      ['New to IT entirely', ['soc-analyst', 'grc']],
      ['IT support / networking / sysadmin', ['seceng', 'soc-analyst']],
      ['Software developer', ['appsec', 'devsecops']],
      ['Cloud / DevOps engineer', ['cloudsec', 'devsecops']]] },
    { q: 'Where do you want to be in 8-10 years?', a: [
      ['Designing enterprise security as an architect', ['arch-role', 'cloudsec']],
      ['Leading the security program (CISO track)', ['ciso', 'grc']],
      ['Elite technical specialist (red team / IR)', ['pentest', 'ir']],
      ['Building security products and platforms', ['appsec', 'detection']]] },
  ];
  let picks = [];
  function draw(qi) {
    box.innerHTML = '';
    box.appendChild(h(`<div class="fitq"><div class="qq" style="font-size:15px">${QS[qi].q}</div></div>`));
    const fq = box.querySelector('.fitq');
    QS[qi].a.forEach(([label, ids]) => {
      const b = h(`<button class="opt" style="font-size:13px">${label}</button>`);
      b.onclick = () => {
        picks.push(ids);
        if (qi < QS.length - 1) draw(qi + 1);
        else {
          const tally = {};
          picks.flat().forEach(id => tally[id] = (tally[id] || 0) + 1);
          const top = Object.entries(tally).sort((x, y) => y[1] - x[1]).slice(0, 2);
          box.innerHTML = '';
          box.appendChild(h(`<div class="callout"><b>Your suggested entry points:</b> ${top.map(([id]) => {
            const c = CAREERS.find(x => x.id === id);
            S.careerFits[id] = (S.careerFits[id] || 0) + 1; save();
            return `<a href="#/career/${id}">${c.ico} ${c.name}</a>`;
          }).join(' &nbsp;·&nbsp; ')}<br><span class="small muted">Remember: these are entry doors, not destinies — the architect seat draws from ALL of them. Read the ★ card.</span></div>`));
        }
      };
      fq.appendChild(b);
    });
  }
  draw(0);
}

route('career', (v, cid, crumb) => {
  const c = CAREERS.find(x => x.id === cid) || CAREERS[0];
  crumb.textContent = c.name;
  v.appendChild(h(`<div class="lab-shell">
    <div class="lab-head"><div class="role-ico" style="width:54px;height:54px;font-size:26px">${c.ico}</div><div>
      <div class="tagline">${c.tier} · ${c.money} · demand: ${c.demand}</div>
      <h1>${c.name}</h1></div></div>
    <p>${c.what}</p>
    <div class="kv">
      <div class="k">Core skills</div><div><ul style="margin:0;padding-left:18px" class="small">${c.skills.map(s => `<li>${s}</li>`).join('')}</ul></div>
      <div class="k">Cert ladder</div><div class="mono small">${c.certs}</div>
      <div class="k">Entry path</div><div class="small">${c.path}</div>
    </div>
    <div class="pathline"><b>↔ Relation to the Security Architect track:</b> ${c.arch}</div>
    <div class="btnrow">
      <button class="btn ghost" onclick="location.hash='#/careers'">← All roles</button>
      <a class="btn primary" href="#/labs">Practice the skills →</a>
    </div>
  </div>`));
});

/* ================= RESOURCES ================= */
route('resources', (v, _, crumb) => {
  crumb.textContent = 'Resources';
  ha(v, `<h1>Resource Library</h1><p class="sub">The curated external layer of the training ground: hands-on platforms, free standards, the cert ladder, and communities. Everything free or free-tier unless noted.</p>`);
  RESOURCES.forEach(cat => {
    v.appendChild(h(`<h2>${cat.cat}</h2>`));
    cat.items.forEach(([name, desc, url]) => {
      v.appendChild(h(`<div class="row" style="cursor:default">
        <div style="flex:1"><div class="t"><a href="${url}" target="_blank" rel="noopener">${name} ↗</a></div>
        <div class="small muted">${desc}</div></div></div>`));
    });
  });
});

/* ================= SETTINGS ================= */
route('settings', (v, _, crumb) => {
  crumb.textContent = 'Settings';
  ha(v, `<h1>Settings & Progress</h1>
  <div class="grid g2">
    <div class="card"><h3>🏅 Badges — ${S.badges.length}/${BADGES.length}</h3>
      <div class="badge-grid" style="margin-top:10px">${BADGES.map(b => `<div class="badge ${S.badges.includes(b.id) ? 'earned' : ''}"><span class="bi">${b.ico}</span><div><div class="bn">${b.name}</div><div class="bd">${b.desc}</div></div></div>`).join('')}</div></div>
    <div class="card"><h3>💾 Save data</h3>
      <p class="small muted">Progress lives in this browser's localStorage. Export before switching devices or clearing site data.</p>
      <div class="btnrow" style="flex-direction:column;align-items:stretch">
        <button class="btn" id="exp-btn">⬇ Export progress (.json)</button>
        <label class="btn" style="justify-content:center">⬆ Import progress <input type="file" id="imp-file" accept=".json" style="display:none"></label>
        <button class="btn danger" id="reset-btn">⟲ Reset everything</button>
      </div>
      <p class="small muted" style="margin-top:12px">Started: ${S.createdAt ? new Date(S.createdAt).toLocaleDateString() : '—'} · Level ${levelInfo(S.xp).level} · ${S.xp} XP</p>
    </div>
    <div class="card"><h3>📲 Install as an app (offline)</h3>
      <ol class="small muted" style="padding-left:18px;line-height:1.8">
        <li><b>Phone:</b> open the hosted site → browser menu → <b>Add to Home Screen</b>.</li>
        <li><b>Desktop Chrome/Edge:</b> address-bar install icon, or menu → <b>Install SecForge</b>.</li>
        <li>Installed, it runs <b>fully offline</b> — every lesson, lab and the arcade work without a connection.</li>
        <li>No account, no tracking: progress stays on the device (use Export to move it).</li>
      </ol></div>
    <div class="card"><h3>🏷 About SecForge</h3>
      <p class="small muted">SecForge is a free, open, offline-capable training ground for the Security Architect track: 12 theory modules, 13 labs, the Phish Rush arcade, a full career map and resource library. Built as a single static web app — fork it, extend it, ship it.</p>
      <p class="small muted">Ethics note: everything here is defensive education. Skills are for protecting systems you are authorized to protect. Act otherwise and you trade a career for a case number.</p>
    </div>
  </div>`);
  v.querySelector('#exp-btn').onclick = exportSave;
  v.querySelector('#imp-file').addEventListener('change', e => { if (e.target.files[0]) importSaveFile(e.target.files[0]); });
  v.querySelector('#reset-btn').onclick = () => {
    if (confirm('Reset ALL progress? This cannot be undone (export first if unsure).')) hardReset();
  };
});

/* ================= BOOT ================= */
boot();
