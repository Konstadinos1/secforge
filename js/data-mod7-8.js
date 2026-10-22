/* SecForge — modules 7 & 8: Detection/Response & Resilience */
'use strict';

const M7 = {
  id: 'm7', num: '07', title: 'Detection, Response & Adversary Emulation', sub: 'Assume breach: SOC science, IR lifecycle, and proving your controls work.',
  mins: 28,
  lessons: [
    {
      id: 'l1', title: 'Detection engineering & the SOC', mins: 9,
      body: `<p>Prevention will fail — architecture must guarantee you <em>notice</em>. The detection stack:</p>
<ul>
<li><strong>Telemetry:</strong> endpoint (EDR), identity sign-in logs, cloud audit logs, DNS, network metadata (NDR), email. Golden rule: <strong>centralize and retain</strong> — logs on a compromised host are attacker-editable fiction.</li>
<li><strong>SIEM:</strong> correlation + alerting across sources. Modern stacks add SOAR (automated response playbooks) and UEBA (behavior baselines).</li>
<li><strong>Detection engineering:</strong> detections are code — versioned, tested, mapped to ATT&CK, tuned to the environment. Alert quality is measured by signal-to-noise: an analyst who ignores 90% of alerts is a monitoring failure, not a staffing failure.</li>
<li><strong>Tiering:</strong> T1 triages, T2 investigates, T3 hunts; purple-team exercises (lab 12) feed detections back from adversary emulation.</li>
</ul>`,
      callout: `<b>Architect's detection checklist:</b> for each crown-jewel asset: who would notice, from which signal, in how long? "Nobody, no signal, eventually" is a design defect, not an operations problem.`,
      terms: [['EDR / NDR', 'Endpoint / Network Detection & Response'], ['SIEM', 'Security Information & Event Management'], ['SOAR', 'Security Orchestration, Automation & Response'], ['MITRE ATT&CK Evaluations', 'Public vendor detection benchmarks']],
    },
    {
      id: 'l2', title: 'Incident response lifecycle', mins: 8,
      body: `<p>NIST 800-61 lifecycle: <strong>Preparation → Detection & Analysis → Containment, Eradication, Recovery → Post-Incident</strong>.</p>
<ul>
<li><strong>Preparation:</strong> playbooks, on-call, retainers (IR firm), out-of-band comms (assume the attacker reads your email and Slack during an incident), pre-collected evidence, legal/PR contacts.</li>
<li><strong>Detection & analysis:</strong> scope, timeline, root cause; classify severity; notify stakeholders per policy (and per law — module 1's 72-hour clock).</li>
<li><strong>Containment:</strong> short-term (isolate hosts, revoke sessions/tokens, block IOCs) vs strategic (segment, rebuild identity trust). Eradication often means <em>rebuilding identity infrastructure</em>, not deleting malware.</li>
<li><strong>Recovery:</strong> from known-good, with enhanced monitoring; staged restoration.</li>
<li><strong>Post-incident:</strong> blameless review → architectural fixes with owners and dates. An incident whose only output is "user clicked, user retrained" will repeat.</li>
</ul>`,
      callout: `<b>Identity breaches rule:</b> after credential/token theft, "change passwords" is insufficient — reset sessions, rotate service principals, re-issue certificates, rebuild trust. Assume persistence in identity, not just on hosts.`,
      terms: [['IOC / IOA', 'Indicator of Compromise / Attack'], ['Containment', 'Stopping spread before eradication — order matters'], ['Blameless Postmortem', 'Fix systems and incentives, not people'], ['Tabletop Exercise', 'Executed rehearsal of a scenario — the cheapest IR training']],
    },
    {
      id: 'l3', title: 'Adversary emulation & purple teaming', mins: 6,
      body: `<p>Red teams find what you missed; pentests validate specific targets; <strong>purple teaming</strong> is continuous collaboration: emulation of ATT&CK techniques (Atomic Red Team, Caldera) measured directly against your detections.</p>
<ul>
<li>Loop: emulate technique → does an alert fire? → tune detection or add telemetry → re-run → document coverage.</li>
<li>Output is a heat-map of validated coverage — the honest alternative to assuming the SIEM works.</li>
<li>Architect input: emulation priorities come from <em>your</em> threat model's high-ranked threats, not generic kill-chains.</li>
</ul>`,
      callout: `<b>Lab 12 in this app</b> is a mini purple-team loop: act as the blue side, choose where to place telemetry, and score your coverage against an emulation plan.`,
      terms: [['Atomic Red Team', 'Library of simple ATT&CK technique tests'], ['Caldera', 'MITRE\'s automated adversary emulation platform'], ['BAS', 'Breach & Attack Simulation — continuous automated emulation'], ['Deception', 'Canaries/honeypots — high-fidelity alerts by design']],
  },
  ],
  quiz: {
    pass: 0.7, xp: 140,
    questions: [
      { q: 'An attacker with domain admin has been active for weeks. Why is "reset the compromised user\'s password" an insufficient eradication step?', opts: ['Passwords must be 20 characters', 'Identity trust is compromised: sessions, tokens, service principals, and persistence may exist elsewhere', 'The password was already strong', 'It only works for cloud accounts'], correct: 1,
        why: 'Deep identity compromise demands rebuilding trust: kill sessions/tokens, rotate secrets and certs, check delegation and persistence mechanisms — host cleanup alone misses identity persistence.' },
      { q: 'The primary architectural reason for centralized log collection with off-host retention:', opts: ['Cheaper storage', 'Logs on a compromised host can be altered or deleted by the attacker', 'Faster dashboards', 'Vendor compliance'], correct: 1,
        why: 'Local logs are attacker-writable after compromise. Append-only, access-controlled off-host retention preserves the investigative record — and integrity monitoring flags tampering attempts.' },
      { q: 'In IR, why does containment come before eradication?', opts: ['Eradication is illegal first', 'Removing the intruder while entry paths and spread remain active wastes the window', 'Containment is cheaper', 'Auditors require that order'], correct: 1,
        why: 'Kick them out with the front door open and they walk back in. Contain (isolate, revoke, block), then eradicate with control over the battlefield.' },
      { q: 'The distinctive value of purple teaming over a classic red-team engagement:', opts: ['It is cheaper', 'It directly improves detections through collaborative, repeated technique testing', 'It never touches production', 'It replaces the need for architecture reviews'], correct: 1,
        why: 'Red = find gaps (report), purple = close the loop live: emulate → measure detection → tune → re-test, producing validated coverage.' },
    ],
  },
};

const M8 = {
  id: 'm8', num: '08', title: 'Resilience: Backup, DR & Business Continuity', sub: 'Ransomware-proof recovery, RTO/RPO math, and chaos you schedule on purpose.',
  mins: 24,
  lessons: [
    {
      id: 'l1', title: 'BCP/DRP and the RTO/RPO contract', mins: 7,
      body: `<p><strong>Business continuity</strong> keeps the business running during disruption; <strong>disaster recovery</strong> restores IT after it. The two numbers that define every DR design:</p>
<ul>
<li><strong>RTO</strong> (Recovery Time Objective): maximum tolerable time to restore service. Drives redundancy, standby capacity, automation.</li>
<li><strong>RPO</strong> (Recovery Point Objective): maximum tolerable data loss window. Drives backup frequency and replication lag. RPO=15min demands replication or log shipping, not nightly tapes.</li>
</ul>
<p>Patterns by cost: backup+restore (cheapest, slowest) → pilot light (core always warm) → warm standby (scaled-down copy) → active-active multi-region (fastest, priciest). The architect maps each service to a tier — not everything deserves active-active, and pretending so wastes the budget that tier-0 needed.</p>`,
      callout: `<b>Negotiation move:</b> present RTO/RPO as a price list. "15-minute RPO for the analytics warehouse costs X; 4 hours costs Y" — executives choose numbers when they see invoices, not abstractions.`,
      terms: [['MTD', 'Maximum Tolerable Downtime — business ceiling above RTO'], ['Active-Active', 'All sites serve traffic simultaneously'], ['Pilot Light', 'Core data replicated; compute off until invoked'], ['Failover Test', 'Scheduled real switchover — the only proof that counts']],
    },
    {
      id: 'l2', title: 'Ransomware-resilient backup architecture', mins: 8,
      body: `<p>Modern ransomware exfiltrates first, then encrypts — and deletes your backups. Backup design is now adversarial:</p>
<ul>
<li><strong>3-2-1(-1-0):</strong> 3 copies, 2 media, 1 offsite — plus 1 <strong>immutable</strong> or offline copy, and 0 errors on restore verification.</li>
<li><strong>Immutability:</strong> object-lock/WORM storage, snapshot policies the backup account itself cannot delete.</li>
<li><strong>Separation:</strong> backup infrastructure isolated (separate identity domain, no domain admin path, MFA) — the backup console is a crown-jewel target precisely because it can delete everything.</li>
<li><strong>Encryption with separated keys</strong>, so stolen backup media is inert.</li>
<li><strong>Restore drills:</strong> a backup has never been restored is a hope, not a control. Sample real restores quarterly; measure how long full recovery actually takes versus the promised RTO.</li>
</ul>`,
      callout: `<b>Sobering stat pattern:</b> in major ransomware cases, attackers spent weeks inside before detonation — mapping backups the whole time. Your backup architecture is your real ransomware strategy.`,
      terms: [['Object Lock / WORM', 'Write Once Read Many — deletion-proof retention'], ['Air Gap', 'Physically/logically isolated copy'], ['Bare-metal Restore', 'Full machine rebuild from backup'], ['Restore Drill', 'Timed, evidence-producing recovery test']],
    },
    {
      id: 'l3', title: 'Chaos engineering & graceful degradation', mins: 5,
      body: `<p>Resilience is a property you practice, not a document you file:</p>
<ul>
<li><strong>Chaos experiments:</strong> inject failure (kill an AZ, saturate a dependency) in controlled blast-radius-minimized runs, with abort conditions — proving redundancy actually fails over.</li>
<li><strong>Graceful degradation:</strong> design features to fail soft — read-only mode beats outage, cached data beats blank screens, queue-and-retry beats lost writes.</li>
<li><strong>Dependency mapping:</strong> every service lists its critical dependencies and its behavior when each is down. Hidden synchronous dependencies are how one DNS outage becomes global.</li>
<li><strong>Game days:</strong> rehearse DR and incident scenarios with the humans who will execute them.</li>
</ul>`,
      callout: `<b>Design axiom:</b> every synchronous dependency is an availability coupling. Ask of each: what does my service owe users when this dependency is dead? If the answer is "also dead," redesign.</p>`,
      terms: [['Chaos Engineering', 'Disciplined experimentation on failure modes'], ['Game Day', 'Scheduled failure rehearsal with real teams'], ['Circuit Breaker', 'Auto-isolating a failing dependency to shed load'], ['Bulkhead', 'Compartmentalizing resources so failure can\'t spread']],
    },
  ],
  quiz: {
    pass: 0.7, xp: 130,
    questions: [
      { q: 'A service must lose at most 5 minutes of data and be back within 30 minutes. Which pattern is the minimum credible design?', opts: ['Nightly backups to the same datacenter', 'Continuous/synchronous replication to a second site with automated failover', 'Weekly full backup, monthly restore test', 'Two power supplies in one rack'], correct: 1,
        why: '5-minute RPO requires near-continuous replication (nightly = up to 24h loss); 30-minute RTO requires pre-provisioned or automated failover capacity — not manual rebuilds.' },
      { q: 'Which backup feature most directly defeats ransomware that gains domain-admin credentials?', opts: ['Compression', 'Immutable (object-locked/WORM) copies outside the admin\'s reach', 'AES-256 on tapes', 'Deduplication'], correct: 1,
        why: 'Domain admins (or the compromised backup console) can delete anything deletable. Immutability with separate identity/custody survives even full administrative compromise.' },
      { q: 'In a chaos experiment, "minimize blast radius" primarily means:', opts: ['Run it in production at full scale immediately', 'Limit the experiment\'s scope and have automatic abort conditions', 'Only test in dev forever', 'Never tell the on-call engineer'], correct: 1,
        why: 'Chaos is disciplined: small, contained, observable, abortable — production when mature, but always with boundaries and a halt switch.' },
      { q: 'A checkout service calls an inventory service synchronously. Inventory dies. Best graceful-degradation behavior?', opts: ['Checkout dies too — consistency first', 'Checkout continues with cached quantities / allows orders with async reconciliation', 'Checkout shows a stack trace', 'Disable the whole site'], correct: 1,
        why: 'Degrade the guarantee (slightly stale inventory) rather than the capability (no sales). Circuit breakers + cached/queued paths are the standard pattern.' },
    ],
  },
};
