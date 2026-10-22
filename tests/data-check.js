/* SecForge data-integrity check — run inside a shared vm context */
const MODULES = [M0,M1,M2,M3,M4,M5,M6,M7,M8,M9,M10,M11];
const LABS = [...LABS_A, ...LABS_B];
const errs = [];
MODULES.forEach(m=>{
  if (!m.id||!m.title||!m.sub) errs.push('module meta');
  m.lessons.forEach(l=>{ if(!l.id||!l.title||!l.body||!l.mins) errs.push(m.id+'/'+l.id+': lesson fields'); });
  if (!m.quiz || !m.quiz.questions || !m.quiz.questions.length) errs.push(m.id+': no quiz');
  else m.quiz.questions.forEach((q,i)=>{ if(q.opts.length!==4) errs.push(m.id+' q'+i+': opts!=4'); if(typeof q.correct!=='number'||q.correct<0||q.correct>3) errs.push(m.id+' q'+i+': correct idx'); if(!q.why) errs.push(m.id+' q'+i+': no why'); });
});
LABS.forEach(l=>{
  if (!l.id||!l.num||!l.title||!l.desc||!l.intro||!l.xp||!l.type) errs.push('lab meta '+l.id);
  if (l.type==='flags'){ l.emails.forEach((e,i)=>{ e.flags.forEach(f=>{ if(!f.id||!f.label||!f.why) errs.push(l.id+' email'+i+' flag'); }); if(!e.fromFlag) errs.push(l.id+' email'+i+': no fromFlag'); else if(!e.flags.find(f=>f.id===e.fromFlag)) errs.push(l.id+' email'+i+': fromFlag missing in flags'); if(!e.questions||!e.questions.length) errs.push(l.id+' email'+i+': no questions'); }); }
  if (l.type==='match'){ l.items.forEach((it,i)=>{ if(it.opts.length!==4) errs.push(l.id+' item'+i+': opts!=4'); if(typeof it.correct!=='number') errs.push(l.id+' item'+i+': correct'); if(!it.why||!it.fix) errs.push(l.id+' item'+i+': why/fix'); }); }
  if (l.type==='branch'){ l.steps.forEach(s=>{ if(s.choices.length!==3) errs.push(l.id+' step'+s.step+': choices!=3'); s.choices.forEach(c=>{ if(typeof c.pts!=='number'||!c.cls||!c.fb||!c.t) errs.push(l.id+' step'+s.step+' choice'); }); }); }
  if (l.type==='calc'){ ['q1','q2','q3','q4','q5','a1','a2','a3','a4','a5'].forEach(k=>{ if(!l[k]) errs.push(l.id+': missing '+k); }); }
});
if (RUSH_EMAILS.length < 20) errs.push('rush corpus small');
RUSH_EMAILS.forEach((e,i)=>{ if(typeof e.phish!=='boolean'||!e.tell||!e.s||!e.sub||!e.b) errs.push('rush email '+i); });
BADGES.forEach(b=>{ if(!b.id||!b.name||!b.desc||!b.ico) errs.push('badge '+b.id); });
CAREERS.forEach(c=>{ if(!c.id||!c.name||!c.what||!c.skills||!c.certs||!c.path||!c.arch) errs.push('career '+c.id); });
RESOURCES.forEach(r=>{ if(!r.cat||!r.items) errs.push('resource cat'); });
const ph = RUSH_EMAILS.filter(e=>e.phish).length;
console.log('modules:', MODULES.length, '| lessons:', MODULES.reduce((a,m)=>a+m.lessons.length,0), '| quiz questions:', MODULES.reduce((a,m)=>a+m.quiz.questions.length,0));
console.log('labs:', LABS.length, '->', LABS.map(l=>l.id+':'+l.type).join(', '));
console.log('rush emails:', RUSH_EMAILS.length, '(phish:'+ph+' / legit:'+(RUSH_EMAILS.length-ph)+')');
console.log('careers:', CAREERS.length, '| badges:', BADGES.length, '| resource cats:', RESOURCES.length, '| glossary:', GLOSSARY.length);
if (errs.length) { console.log('ERRORS:'); errs.forEach(e=>console.log(' -',e)); throw new Error('DATA CHECKS FAILED'); }
console.log('ALL DATA CHECKS PASSED');
