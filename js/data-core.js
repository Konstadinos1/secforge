/* SecForge — core curriculum data: track meta, module 0, global glossary */
'use strict';

const TRACK = {
  name: 'Security Architect',
  levels: [
    { n: 1, xp: 0, title: 'Initiate' },
    { n: 2, xp: 250, title: 'Apprentice' },
    { n: 3, xp: 600, title: 'Builder' },
    { n: 4, xp: 1100, title: 'Defender' },
    { n: 5, xp: 1800, title: 'Engineer' },
    { n: 6, xp: 2700, title: 'Threat Modeler' },
    { n: 7, xp: 3800, title: 'Designer' },
    { n: 8, xp: 5200, title: 'Strategist' },
    { n: 9, xp: 4200, title: 'Architect' },
    { n: 10, xp: 5600, title: 'Principal Architect' },
    { n: 11, xp: 7000, title: 'Distinguished Architect' },
  ],
};

const GLOSSARY = [
  ['Attack Surface', 'The complete set of points where an unauthorized actor could interact with a system: networks, endpoints, people, code, supply chain.'],
  ['CIA Triad', 'Confidentiality, Integrity, Availability — the three core properties a security architecture must protect.'],
  ['Defense in Depth', 'Layered controls so a single failure never equals a breach; no one control is a point of total failure.'],
  ['Threat Model', 'A structured analysis of what can go wrong (STRIDE, PASTA, attack trees) used to drive design decisions before code exists.'],
  ['Zero Trust', 'An architecture where no implicit trust is granted by network location; every access is authenticated, authorized, encrypted, and logged.'],
  ['Least Privilege', 'Every identity (human or machine) gets only the permissions it needs, only for as long as it needs them.'],
  ['Risk', 'Likelihood × Impact of a threat exploiting a vulnerability. Architecture is fundamentally the discipline of choosing which risks to reduce, transfer, or accept.'],
  ['Control', 'A safeguard (administrative, technical, or physical) that modifies risk. Preventive, detective, corrective, deterrent, compensating.'],
  ['Attack Vector', 'The path or means by which an attacker gains access — phishing, SQLi, supply chain, stolen credentials, physical access.'],
  ['Blast Radius', 'How much damage a single compromise can do. Architecture minimizes it via segmentation, scoped credentials, and isolation.'],
  ['Misconfiguration', 'The most common real-world breach cause: a setting that weakens security (open S3 bucket, default password, disabled logging).'],
  ['Mean Time to Detect/Respond (MTTD/MTTR)', 'How long it takes to notice and then contain an incident. Architecture must instrument for both.'],
  ['Residual Risk', 'The risk left after controls are applied. Executives sign off on this — the architect documents and justifies it.'],
  ['Purdue Model', 'A reference model segmenting industrial (OT/ICS) networks into levels — from enterprise IT down to sensors and actuators.'],
  ['Shared Responsibility Model', 'Cloud security split: provider secures the cloud itself, customer secures what they put in it. Misreading this causes countless breaches.'],
  ['Single Point of Failure', 'Any component whose failure takes down the whole system. Redundancy and graceful degradation remove them.'],
  ['Trust Boundary', 'Where data or execution crosses from one trust level to another (user input → server, internet → DMZ). All validation happens at these lines.'],
  ['X as Code', 'Infrastructure, policy, and compliance expressed in versioned code (IaC, PaC) so security scales, reviews like software, and never drifts silently.'],
];

/* ============ MODULE 0 — Foundations ============ */
const M0 = {
  id: 'm0', num: '00', title: 'Security Foundations', sub: 'The bedrock: CIA, risk, defense in depth, and how to think like an architect.',
  mins: 20,
  lessons: [
    {
      id: 'l1', title: 'The CIA Triad — the atoms of security', mins: 6,
      body: `<p>Every control you will ever design exists to protect one (or more) of three properties:</p>
<ul>
<li><strong>Confidentiality</strong> — only authorized eyes see the data. Controls: encryption, access control, classification, DLP.</li>
<li><strong>Integrity</strong> — data and systems are not altered in unauthorized ways. Controls: hashing, signatures, versioning, change control.</li>
<li><strong>Availability</strong> — systems work when needed. Controls: redundancy, backups, DDoS protection, capacity planning, DR.</li>
</ul>
<p>Real designs <strong>trade these against each other</strong>. Full-disk encryption with keys nobody can recover maximizes confidentiality and destroys availability. An architect's job is to find the balance the business actually needs — which starts with <strong>classifying the data</strong>.</p>`,
      callout: `<b>Architect's lens:</b> when a stakeholder says "make it secure," ask "secure along which axis, for which data, against which adversary?" Vague goals produce fragile designs.`,
      terms: [['Classification', 'Labeling data by sensitivity (public → restricted) so controls match value'], ['DAD Triad', 'Disclosure, Alteration, Destruction — the CIA failures themselves'], ['RAS', 'Reliability, Availability, Serviceability — availability engineering shorthand']],
    },
    {
      id: 'l2', title: 'Risk: the architect\'s real currency', mins: 7,
      body: `<p>Security is not the elimination of risk — that is impossible. Security is the <strong>management</strong> of it. Risk = <strong>Likelihood × Impact</strong>, and every risk gets one of four treatments:</p>
<ul>
<li><strong>Mitigate</strong> — apply a control to lower likelihood or impact.</li>
<li><strong>Transfer</strong> — insurance, outsourcing, contracts (note: reputational damage never fully transfers).</li>
<li><strong>Accept</strong> — a documented, signed-off decision. Acceptance is a decision made by risk owners, not by you silently ignoring a finding.</li>
<li><strong>Avoid</strong> — don't build the feature, don't store the data. The most underrated control in existence is <em>not having the data</em>.</li>
</ul>
<p>Controls come in families: <strong>administrative</strong> (policy, training, process), <strong>technical</strong> (firewalls, encryption, MFA), <strong>physical</strong> (locks, badges, cameras) — and types: preventive, detective, corrective, deterrent, compensating. A mature architecture mixes all of them; a naive one buys only preventive magic boxes.</p>`,
      callout: `<b>Exam & reality:</b> "Risk acceptance must be <em>explicit, documented, and owned</em>." Undocumented acceptance is just an unmanaged finding waiting to become an incident report.`,
      terms: [['Residual Risk', 'What remains after controls — must be accepted formally'], ['Asset', 'Anything of value: data, systems, reputation, people'], ['Vulnerability', 'A weakness in an asset'], ['Threat', 'A potential cause of harm exploiting a vulnerability'], ['Control Gap', 'The distance between required and actual protection']],
    },
    {
      id: 'l3', title: 'Defense in Depth & the onion model', mins: 7,
      body: `<p>Assume every single control will eventually fail. Defense in depth stacks independent layers so one failure is absorbed:</p>
<div class="terms"><span class="term"><b>1.</b> Perimeter / network</span><span class="term"><b>2.</b> Network segmentation</span><span class="term"><b>3.</b> Endpoint hardening</span><span class="term"><b>4.</b> Application security</span><span class="term"><b>5.</b> Data protection</span><span class="term"><b>6.</b> Identity & access</span><span class="term"><b>7.</b> Monitoring & response</span><span class="term"><b>8.</b> People & process</span></div>
<p>Modern reality: the perimeter <em>will</em> be crossed — via phishing, supply chain, or a stolen laptop. That is why the inner layers (least privilege, segmentation, encryption, detection) matter more every year, and why <strong>Zero Trust</strong> (module 9) is defense in depth formalized.</p>`,
      callout: `<b>Design rule:</b> controls should fail <em>independently</em>. If your three "layers" all depend on one AD domain or one API key, you have one layer with three logos.`,
      terms: [['Blast Radius', 'Damage scope of one compromise — shrink it deliberately'], ['Compensating Control', 'A substitute safeguard when the ideal one isn\'t feasible'], ['Point of Total Failure', 'Where all your layers collapse together — hunt these']],
    },
  ],
  quiz: {
    pass: 0.7,
    xp: 120,
    questions: [
      { q: 'A company takes a full offline backup of its database but keeps the backup encryption key stored on the same server as the live database. Which CIA property is most directly endangered?', opts: ['Confidentiality of the backup', 'Availability of the live database', 'Integrity of the backup', 'Non-repudiation of transactions'], correct: 0,
        why: 'Anyone who compromises that server gets both the data and the key — confidentiality of the backup collapses. Storing keys separately (KMS, HSM, offline custody) is standard key-management practice.' },
      { q: 'A risk owner reviews a finding and formally signs a document saying "we will not fix this, we accept the risk." What treatment is this?', opts: ['Mitigation', 'Transfer', 'Explicit acceptance', 'Avoidance'], correct: 2,
        why: 'Acceptance is legitimate ONLY when explicit, documented, and owned. Undocumented acceptance is just an unmanaged finding.' },
      { q: 'Why does defense in depth insist that layers fail independently?', opts: ['To reduce cost by sharing infrastructure', 'Because correlated failures collapse the whole onion at once', 'Because regulators require independent vendors', 'To make audits faster'], correct: 1,
        why: 'If all layers share a dependency (one domain, one key, one vendor), compromising that dependency bypasses every layer simultaneously — the onion becomes an eggshell.' },
      { q: 'Which choice best "avoids" risk rather than mitigating it?', opts: ['Encrypting a database holding unneeded customer data', 'Deleting data the business never needed and never collecting it again', 'Moving the database behind a firewall', 'Insuring against the database being breached'], correct: 1,
        why: 'Not possessing the data at all means it cannot be breached — avoidance. Encryption and firewalls mitigate; insurance transfers.' },
    ],
  },
};
