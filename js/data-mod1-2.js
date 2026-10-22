/* SecForge — modules 1 & 2: Governance & Threat Modeling */
'use strict';

const M1 = {
  id: 'm1', num: '01', title: 'Governance, Risk & Compliance', sub: 'Frameworks, laws, and the paperwork that actually shapes architecture.',
  mins: 28,
  lessons: [
    {
      id: 'l1', title: 'Why governance is an architect\'s tool, not a tax', mins: 7,
      body: `<p>Governance answers: <em>who decides, who is accountable, and what rules bind us?</em> Done well, it is the architect's leverage — a security policy signed by the CEO will win arguments no engineer can.</p>
<ul>
<li><strong>Policies</strong> — the "what and why," owned by leadership (e.g., "all data is classified").</li>
<li><strong>Standards</strong> — the "what specifically" (e.g., "TLS 1.2+, AES-256").</li>
<li><strong>Procedures</strong> — the "how," step by step (e.g., the key-rotation runbook).</li>
<li><strong>Guidelines</strong> — advice when standards don't fit the case.</li>
</ul>
<p>The hierarchy matters: procedures implement standards which implement policies which implement the business's risk appetite.</p>`,
      callout: `<b>Practitioner note:</b> when a project pushes back on a control, reframe from "rule" to "risk owner's signed decision." Architecture authority flows from accountability, never from tools.`,
      terms: [['Policy', 'Management\'s statement of intent'], ['Standard', 'Mandatory specific requirement'], ['Procedure', 'Step-by-step instructions'], ['Risk Appetite', 'How much risk leadership will carry'], ['Accountable (RACI-A)', 'The single owner answerable for an outcome']],
    },
    {
      id: 'l2', title: 'The framework zoo — and the handful that matter', mins: 9,
      body: `<p>You will meet dozens of acronyms. Structure them into three buckets:</p>
<ul>
<li><strong>Certifiable / regulatory:</strong> ISO 27001 (certifiable ISMS), SOC 2 (attestation report — Type I design, Type II operating effectiveness), PCI DSS (card data; enforceable by contract), FedRAMP (US cloud), HIPAA (US health; Security Rule → safeguards), GDPR (EU privacy; fines up to 4% global revenue).</li>
<li><strong>Guidance / best practice:</strong> NIST CSF 2.0 (Govern, Identify, Protect, Detect, Respond, Recover), NIST SP 800-53 (control catalog), CIS Controls (prioritized hygiene), CIS Benchmarks (per-product hardening), SLSA (supply chain levels).</li>
<li><strong>Technical standards:</strong> NIST SP 800-63B (authenticator assurance AAL/IAL/FAL), FIPS 140-3 (crypto modules), OWASP ASVS (app-sec verification levels).</li>
</ul>
<p>The senior skill is <strong>mapping, not memorizing</strong>: one well-designed control (say, centralized logging) satisfies rows from many frameworks at once. Architects build the control once, then map it everywhere — that is how compliance stops being 12 duplicate projects.</p>`,
      callout: `<b>Board-level shorthand:</b> NIST CSF = "what a program covers"; ISO 27001 = "a certifiable management system"; SOC 2 = "an auditor's opinion to customers"; PCI = "contractual law for card data."`,
      terms: [['ISMS', 'Information Security Management System (ISO 27001)'], ['Scope', 'The systems a framework certification actually covers — the most-fought term'], ['Control Mapping', 'Linking one implementation to many framework requirements'], ['Due Care', 'Doing what a reasonable org would do; its absence = negligence'], ['Common Criteria (ISO 15408)', 'Evaluation standard for security products (EAL levels)']],
    },
    {
      id: 'l3', title: 'Privacy by design & data protection', mins: 6,
      body: `<p>Modern privacy law (GDPR, CCPA/CPRA, and 100+ others) converges on principles an architect encodes into systems:</p>
<ul>
<li><strong>Data minimization</strong> — collect and retain the least. You cannot breach data you never had.</li>
<li><strong>Purpose limitation</strong> — use data only for the purpose collected.</li>
<li><strong>Rights engine</strong> — systems must support access, deletion (erasure), and portability requests <em>by design</em>, not by manual heroics.</li>
<li><strong>Records of processing</strong> — know where personal data lives, flows, and dies. Data flow diagrams double as legal artifacts.</li>
<li><strong>DPIA</strong> — a Data Protection Impact Assessment is required for high-risk processing; treat it as a threat model with a privacy lens.</li>
</ul>`,
      callout: `<b>Architect's move:</b> design retention into storage (TTLs, automated purge) — privacy compliance becomes a property of the schema, not a quarterly cleanup project.`,
      terms: [['DPIA', 'Data Protection Impact Assessment'], ['Data Subject', 'The human the personal data is about'], ['Erasure / Right to be Forgotten', 'Deletion obligation under GDPR Art. 17'], ['Breach Notification', 'GDPR: 72h to the authority; many US laws: to affected people']],
    },
    {
      id: 'l4', title: 'Security culture & the human layer', mins: 6,
      body: `<p>People are simultaneously the most exploited attack surface (phishing, social engineering) and the most powerful detection layer (they notice what sensors miss). Architecture for humans:</p>
<ul>
<li><strong>Awareness that changes behavior</strong> — short, frequent, scenario-based; measure with simulated phishing (see the Phish Rush arcade and phishing labs) and report <em>reporting rate</em>, not just click rate. A click followed by a report in 60 seconds is a win.</li>
<li><strong>Make the secure path the easy path</strong> — password managers, SSO, pre-approved tools. Shadow IT is a UX failure before it is a policy failure.</li>
<li><strong>Blameless reporting</strong> — if clicking a link means punishment, users hide clicks; you lose your earliest signal.</li>
<li><strong>Insider risk program</strong> — least privilege + behavioral analytics (UEBA) + offboarding discipline, balancing monitoring with privacy law and works councils.</li>
</ul>`,
      callout: `<b>Metric that matters:</b> time-to-report. Organizations that train reporting halve containment times — the human sensor is real.`,
      terms: [['Phishing', 'Fraudulent messages harvesting credentials or delivering malware'], ['Smishing / Vishing', 'Phishing via SMS / voice'], ['BEC', 'Business Email Compromise — invoice & CEO fraud, no malware needed'], ['Shadow IT', 'Unsanctioned tools — usually a process gap, sometimes a breach cause'], ['UEBA', 'User & Entity Behavior Analytics for insider-risk detection']],
    },
  ],
  quiz: {
    pass: 0.7, xp: 140,
    questions: [
      { q: 'Your company wants to prove to enterprise customers that its security program operates effectively over time. Which attestation fits best?', opts: ['ISO 27001 certificate', 'SOC 2 Type II report', 'CIS Controls self-assessment', 'NIST CSF scorecard'], correct: 1,
        why: 'SOC 2 Type II is an auditor opinion on operating effectiveness over a period — the standard enterprise-customer answer. ISO 27001 certifies the management system; the others are self-scored guidance.' },
      { q: 'A single centralized audit-logging platform satisfies requirements in PCI DSS, ISO 27001, SOC 2, and internal policy. This is an example of:', opts: ['Control mapping', 'Scope creep', 'Residual risk acceptance', 'Due process'], correct: 0,
        why: 'One implementation mapped to many framework requirements is control mapping — the core efficiency lever of enterprise compliance.' },
      { q: 'Under GDPR-style privacy principles, which design decision best embodies "data minimization"?', opts: ['Encrypting all collected fields with AES-256', 'Collecting only fields the product feature actually uses, and auto-purging on schedule', 'Storing data in a country with strict laws', 'Requiring MFA for all admins'], correct: 1,
        why: 'Minimization is about collecting/retaining less, not protecting more. Data that does not exist cannot be breached or subpoenaed.' },
      { q: 'Which statement about the document hierarchy is correct?', opts: ['Policies define step-by-step instructions', 'Standards are optional advice', 'Procedures implement standards, which implement policies', 'Guidelines override standards'], correct: 2,
        why: 'Policy = intent (what/why), standard = specific mandatory requirement, procedure = how-to steps, guideline = flexible advice.' },
    ],
  },
};

const M2 = {
  id: 'm2', num: '02', title: 'Threat Modeling & Adversary Thinking', sub: 'Find design flaws before they exist in code. The architect\'s superpower.',
  mins: 30,
  lessons: [
    {
      id: 'l1', title: 'Threat modeling: what, when, and how', mins: 8,
      body: `<p>A threat model is a structured answer to four questions (Shostack): <strong>What are we building? What can go wrong? What are we doing about it? Did we do a good enough job?</strong></p>
<ul>
<li><strong>When:</strong> at design time, when change is cheap. Re-trigger on major features, new integrations, architecture changes, incidents.</li>
<li><strong>Inputs:</strong> data flow diagrams (DFDs) with trust boundaries — most findings are born exactly where a boundary is crossed.</li>
<li><strong>Outputs:</strong> ranked threats, decisions (mitigate / transfer / accept / avoid), and issues tracked like bugs with owners and deadlines.</li>
</ul>
<p>Process skeleton: decompose the system → enumerate threats with a framework → rank them → assign mitigations & owners → review at milestones. 80% of value comes from just <em>doing it at all</em>; perfection is not the entry fee.</p>`,
      callout: `<b>Why architects own this:</b> pen-testing finds flaws that already shipped. Threat modeling finds flaws while they are still an idea — the cheapest fix in security is a line moved on a whiteboard.`,
      terms: [['DFD', 'Data Flow Diagram: processes, stores, flows, interactors'], ['Trust Boundary', 'Line where privilege or data sensitivity changes'], ['Abuse Case', 'A use case written from the attacker\'s perspective']],
    },
    {
      id: 'l2', title: 'STRIDE — the workhorse framework', mins: 8,
      body: `<p>Microsoft's STRIDE maps each threat class to the property it breaks and classic countermeasures:</p>
<table class="nice"><tr><th>Letter</th><th>Threat</th><th>Breaks</th><th>Typical countermeasures</th></tr>
<tr><td><b>S</b></td><td>Spoofing</td><td>Authentication</td><td>MFA, mutual TLS, signed tokens</td></tr>
<tr><td><b>T</b></td><td>Tampering</td><td>Integrity</td><td>Signatures, HMACs, immutability, WORM storage</td></tr>
<tr><td><b>R</b></td><td>Repudiation</td><td>Non-repudiation</td><td>Tamper-evident audit logs, timestamps, chain custody</td></tr>
<tr><td><b>I</b></td><td>Information disclosure</td><td>Confidentiality</td><td>Encryption in transit/at rest, tokenization, minimization</td></tr>
<tr><td><b>D</b></td><td>Denial of service</td><td>Availability</td><td>Rate limits, autoscaling, redundancy, DDoS shielding</td></tr>
<tr><td><b>E</b></td><td>Elevation of privilege</td><td>Authorization</td><td>Least privilege, RBAC/ABAC, sandboxing, input validation</td></tr></table>
<p>Per DFD element: processes get S/T/R/D/E, data flows get T/I, stores get T/I/R, interactors get S/R. Walk every element, every boundary crossing — and write down "n/a" deliberately rather than skipping silently.</p>`,
      callout: `<b>Cross-boundary rule:</b> every flow crossing a trust boundary gets explicit validation, authentication, and encryption — or a written reason why not.`,
      terms: [['EoP', 'Elevation of Privilege — also a STRIDE-based card game for teams'], ['PASTA', 'Process for Attack Simulation & Threat Analysis — risk-centric, 7 stages'], ['Attack Tree', 'AND/OR tree of steps an adversary could take']],
    },
    {
      id: 'l3', title: 'Ranking & MITRE ATT&CK mapping', mins: 7,
      body: `<p>Not every threat deserves engineering time. Rank with <strong>DREAD-style</strong> thinking: Damage, Reproducibility, Exploitability, Affected users, Discoverability — or simpler: impact × likelihood on your existing risk matrix.</p>
<p>Then connect design reviews to real adversary behavior with <strong>MITRE ATT&CK</strong> (tactics × techniques, e.g., T1566 Phishing, T1078 Valid Accounts):</p>
<ul>
<li>Map each high-ranked threat to ATT&CK techniques it would use.</li>
<li>Check coverage: which techniques have preventive controls, which only detection, which <em>nothing</em>?</li>
<li>Feed the gaps to detection engineering and purple-team exercises (lab 12).</li>
</ul>`,
      callout: `<b>Portfolio view:</b> the ATT&CK heat-map of "covered vs uncovered techniques" is one of the most persuasive executive artifacts an architect can produce.`,
      terms: [['DREAD', 'Damage, Reproducibility, Exploitability, Affected users, Discoverability'], ['ATT&CK Tactic', 'The WHY (Initial Access, Persistence...)'], ['ATT&CK Technique', 'The HOW (T1566.001 Spearphishing Attachment)'], ['CVSS', 'Severity scoring for specific vulnerabilities (not threats)']],
    },
  ],
  quiz: {
    pass: 0.7, xp: 140,
    questions: [
      { q: 'An attacker forges the "From" address of an internal executive to trick finance into wiring money. Which STRIDE category is the PRIMARY failure?', opts: ['Tampering', 'Spoofing', 'Denial of service', 'Elevation of privilege'], correct: 1,
        why: 'Spoofing = claiming an identity you do not own (breaks authentication). Email authentication (SPF/DKIM/DMARC) plus process controls mitigate BEC-style spoofing.' },
      { q: 'Tamper-evident, append-only audit logging is the canonical countermeasure for which STRIDE threat?', opts: ['Information disclosure', 'Denial of service', 'Repudiation', 'Spoofing'], correct: 2,
        why: 'Repudiation = denying an action. Cryptographically protected, time-synced logs make actions undeniable — non-repudiation.' },
      { q: 'The BEST reason to threat model at design time rather than relying on pre-release penetration tests:', opts: ['Threat models find issues while changing them is still cheap', 'Pen tests are less accurate', 'Threat models replace testing entirely', 'Auditors require threat models'], correct: 0,
        why: 'A design flaw found on a whiteboard costs an afternoon; the same flaw found by a pen test costs rework, delays, and migration. They complement — modeling never replaces testing.' },
      { q: 'In ATT&CK terms, "Initial Access," "Persistence," and "Exfiltration" are:', opts: ['Techniques', 'Tactics', 'Procedures', 'Mitigations'], correct: 1,
        why: 'Tactics are the adversary\'s goal-stages (the columns); techniques (T-numbers) are the methods within them; procedures are specific real-world implementations.' },
    ],
  },
};
