/* SecForge — modules 3 & 4: Network Security & IAM */
'use strict';

const M3 = {
  id: 'm3', num: '03', title: 'Network Security Architecture', sub: 'Segmentation, zero trust networking, and designing for "when, not if".',
  mins: 28,
  lessons: [
    {
      id: 'l1', title: 'Segmentation & the death of the flat network', mins: 8,
      body: `<p>A flat network means one compromised laptop can reach everything — attackers call it "living off the land." Segmentation shrinks the blast radius:</p>
<ul>
<li><strong>Zones:</strong> internet → DMZ (public services) → app tier → data tier → management. Traffic flows only along designed paths.</li>
<li><strong>Enforcement:</strong> VLANs+ACLs (cheap, weak), firewalls (stateful policy), microsegmentation (per-workload policy, host or hypervisor agent — the modern default in cloud).</li>
<li><strong>OT/ICS twist:</strong> the Purdue Model levels (enterprise → supervisory → control → sensors). Industrial networks get <em>unidirectional gateways</em> and jump servers, never direct paths.</li>
<li><strong>Design pattern:</strong> default-deny east-west, explicit allows per application flow. The application dependency map (from CMDB or eBPF sensors) writes the firewall ruleset for you.</li>
</ul>`,
      callout: `<b>Heuristic:</b> if you can draw the network on a napkin with no trust boundaries marked, an attacker can traverse it in one line too.`,
      terms: [['DMZ', 'Buffer zone hosting internet-facing services'], ['East-West / North-South', 'Lateral internal traffic / traffic in and out of the DC'], ['Microsegmentation', 'Per-workload policy, workload identity — not IP — is the rule target'], ['Purdue Model', 'Levels 0-5 for OT/ICS segmentation']],
    },
    {
      id: 'l2', title: 'Zero Trust Network Architecture (NIST 800-207)', mins: 9,
      body: `<p>Zero Trust is not a product. NIST SP 800-207 defines it as: <em>no implicit trust based on network location; every access is authenticated, authorized, and continuously evaluated</em>. Core tenets:</p>
<ul>
<li><strong>Identity is the perimeter:</strong> subjects (user + device + workload) authenticate to a Policy Decision Point (PDP) before touching any resource.</li>
<li><strong>Per-session, least-privilege authorization</strong> — not one-time VPN entry granting the whole intranet.</li>
<li><strong>Policy = identity + device posture + behavior + risk score</strong>, continuously re-evaluated (session hijacking, token theft happen <em>after</em> login).</li>
<li><strong>Deployment models:</strong> device agent/gateway, enclave gateway, resource portal, sandboxing, or SDP and identity-based proxies.</li>
<li><strong>Realistic migration:</strong> inventory subjects & assets → pick a pilot (crown-jewel app) → enforce per-app ZTNA → retire broad VPN → expand with conditional access. Never "big bang."</li>
</ul>`,
      callout: `<b>Interview gold:</b> "Zero Trust means never trust, always verify" is the trailer. The movie is: a policy engine (PE) + policy enforcement points (PEPs) + a trust algorithm fed by identity, posture, and threat signals.`,
      terms: [['ZTNA', 'Zero Trust Network Access — per-app brokered access replacing VPN'], ['PDP / PEP', 'Policy Decision Point / Enforcement Points (800-207 terms)'], ['Device Posture', 'Patched? encrypted? compliant? EDR healthy?'], ['SDP', 'Software Defined Perimeter — the "connect then invisible network" model']],
    },
    {
      id: 'l3', title: 'Secure remote access, NAC & DDoS', mins: 6,
      body: `<p><strong>Remote access:</strong> the legacy model was full-tunnel VPN = network-level trust. Modern access is per-application (ZTNA/identity proxy), with device posture checks and session recording for privileged flows. Keep VPNs for the niche cases that need network-level access — and harden them: they are internet-exposed pre-auth attack surface (patch cadence matters, see any year's VPN CVE crop).</p>
<p><strong>NAC (Network Access Control):</strong> 802.1X port auth, MAB for printers/IoT, dynamic VLAN assignment, quarantine subnets for non-compliant devices.</p>
<p><strong>Availability engineering:</strong> DDoS is a capacity + architecture problem — scrubbing services + anycast + CDNs absorb volumetric layers; rate limiting and cache-offload handle application layers (L7). Design stateless front doors so stateful backends never see the flood.</p>`,
      callout: `<b>Rule of thumb:</b> anything with a public IP will be scanned within minutes of existing. Design the front door (WAF, rate limits, auth before parse) assuming it.`,
      terms: [['802.1X', 'Port-based network access control'], ['MAB', 'MAC Authentication Bypass for devices that can\'t do 802.1X'], ['L7 DDoS', 'Application-layer flood (HTTP) — defeated by architecture, not raw bandwidth'], ['Anycast', 'One IP announced from many sites — spreads volumetric attacks']],
    },
  ],
  quiz: {
    pass: 0.7, xp: 140,
    questions: [
      { q: 'The core difference between legacy VPN access and ZTNA is:', opts: ['ZTNA encrypts traffic and VPNs do not', 'VPN grants network-level reach; ZTNA brokers per-application access with continuous policy checks', 'ZTNA only works for employees in offices', 'VPNs cannot use MFA'], correct: 1,
        why: 'Both encrypt. The architectural shift is scope: network-level implicit trust (VPN) vs per-app, identity+posture-brokered sessions (ZTNA) with continuous re-evaluation.' },
      { q: 'In an industrial plant, the safest pattern for getting sensor telemetry UP to the enterprise network is:', opts: ['Open a firewall port from control network to enterprise', 'A unidirectional gateway / data diode', 'Shared admin credentials between IT and OT', 'Flat network with antivirus on PLCs'], correct: 1,
        why: 'Data diodes physically prevent return traffic — enterprise compromise cannot pivot into the control network. Purdue segmentation assumes IT-to-OT flows are one-way where possible.' },
      { q: 'Microsegmentation policies are fundamentally different from VLAN ACLs because they:', opts: ['Are cheaper', 'Target workload identity and context rather than network location', 'Only work in on-prem datacenters', 'Replace the need for encryption'], correct: 1,
        why: 'Microsegmentation keys policy on identity/labels of workloads (and process context), surviving IP churn and autoscaling — location-based rules rot immediately in cloud.' },
      { q: 'A volumetric DDoS absorbs your entire internet pipe. The architectural fix is:', opts: ['Bigger stateful firewall', 'Anycast + upstream scrubbing/CDN so traffic is absorbed before your edge', 'Block all ICMP', 'Move servers to a private subnet'], correct: 1,
        why: 'If the pipe is full, on-prem devices are irrelevant — absorption must happen upstream (scrubbing centers, anycast distribution, CDN edge).' },
    ],
  },
};

const M4 = {
  id: 'm4', num: '04', title: 'Identity & Access Management', sub: 'The new perimeter: authentication, authorization, secrets, and privilege.',
  mins: 30,
  lessons: [
    {
      id: 'l1', title: 'Authentication: from passwords to phishing-resistant', mins: 8,
      body: `<p>NIST SP 800-63B grades digital authentication into AAL1–3 and is blunt about passwords: check against breach lists, rate-limit, no forced periodic rotation without evidence of compromise, no composition rules theater. The modern ladder:</p>
<ul>
<li><strong>Password + push MFA</strong> — better than password alone, but push-bombing and AiTM proxies (Evilginx-style) defeat it.</li>
<li><strong>FIDO2 / WebAuthn passkeys</strong> — origin-bound cryptographic auth; the proxy site simply cannot relay it. <em>Phishing-resistant by construction.</em> This is the architect's target state for workforce and increasingly customers.</li>
<li><strong>Number matching & device-bound factors</strong> — interim hardening where passkeys aren't yet feasible.</li>
<li><strong>Enterprises:</strong> pair with conditional access (identity + device compliance + location + risk), and never forget help-desk identity verification — the reset desk is a favorite adversary entry (see: the 2022 Uber MFA-fatigue + social-engineered reset breach).</li>
</ul>`,
      callout: `<b>Board pitch that works:</b> "Passkeys make credential phishing mathematically pointless for our domain" — origin binding, not user vigilance, carries the control.`,
      terms: [['AAL', 'NIST Authenticator Assurance Level 1-3'], ['Passkey', 'FIDO2 credential bound to origin & device — unphishable by relay'], ['AiTM', 'Adversary-in-the-Middle proxy that steals session tokens'], ['MFA Fatigue', 'Flooding push prompts until one is approved — mitigated by number matching']],
    },
    {
      id: 'l2', title: 'Authorization models: RBAC, ABAC, ReBAC, PBAC', mins: 8,
      body: `<p>Authentication says who you are; authorization decides what you may do. The models:</p>
<ul>
<li><strong>RBAC</strong> — roles group permissions. Simple to audit, explodes into role sprawl at scale.</li>
<li><strong>ABAC</strong> — policy on attributes (department, device, time, data classification). Powerful, harder to reason about.</li>
<li><strong>ReBAC</strong> — relationship-based ("owner of document X"), Google Zanzibar style; how modern apps share.</li>
<li><strong>Policy-as-code (PBAC)</strong> — OPA/Rego, Cedar: authorization decisions versioned, tested, and deployed like software.</li>
</ul>
<p>Architectural rules that outlive any model: <strong>deny by default</strong>; check authorization <em>server-side on every request</em> (client-side checks are UX, not security — the IDOR lab shows the classic failure); separate duties so no single role both creates and approves (SoD); and JIT elevation beats standing privilege.</p>`,
      callout: `<b>Design smell:</b> authorization logic scattered per-endpoint with inline ifs everywhere. Centralize the decision (policy engine) and PEP everywhere.`,
      terms: [['IDOR', 'Insecure Direct Object Reference — missing server-side object authorization'], ['SoD', 'Separation of Duties — split critical actions across roles'], ['JIT / JEA', 'Just-In-Time / Just-Enough-Admin privilege elevation'], ['Zanzibar', 'Google\'s globally distributed ReBAC system']],
    },
    {
      id: 'l3', title: 'Secrets, keys & machine identity', mins: 7,
      body: `<p>Machines outnumber humans; their credentials are the real perimeter. Architecture:</p>
<ul>
<li><strong>No secrets in code/config/images.</strong> Secrets belong in a vault (Vault, cloud KMS-backed secret managers) with dynamic, short-lived credentials issued per session.</li>
<li><strong>Workload identity:</strong> platforms issue cryptographic identity to processes (SPIFFE/SPIRE, cloud workload identity federation) — so service-to-service auth needs no stored static keys at all.</li>
<li><strong>Key management:</strong> KMS/HSM custody, rotation schedules, separation of duties (nobody both uses and administers root keys), envelope encryption for bulk data.</li>
<li><strong>Certificates:</strong> automate issuance/rotation (ACME, cert-manager); expired certs cause outages and outages cause dangerous workarounds.</li>
<li><strong>CI/CD:</strong> pipeline identities are crown jewels (the 2021 Codecov and 2020 SolarWinds lessons) — scope them, pin them, audit them.</li>
</ul>`,
      callout: `<b>Metrics that matter:</b> secrets scan hit-rate on repos (target zero), % of workloads on federated identity, mean secret age. Static long-lived keys are the asbestos of cloud architecture.`,
      terms: [['KMS / HSM', 'Key Management Service / Hardware Security Module'], ['Envelope Encryption', 'Data keys encrypt data; master keys encrypt data keys'], ['SPIFFE', 'Standard for issuing verifiable workload identity'], ['Dynamic Secrets', 'Credentials generated on-demand with short TTLs']],
    },
  ],
  quiz: {
    pass: 0.7, xp: 150,
    questions: [
      { q: 'Why do FIDO2 passkeys defeat AiTM phishing proxies that steal credentials and session cookies in real time?', opts: ['They are longer than passwords', 'The key is bound to the legitimate origin, so the proxy domain cannot use it', 'They rotate every 30 seconds like TOTP', 'They hide the username from the site'], correct: 1,
        why: 'WebAuthn signatures are origin-bound — a credential relayed to evil-domain.com simply fails. This is structural, not behavioral, phishing resistance.' },
      { q: 'An API returns invoice data whenever the user is logged in and supplies /invoices/9042 — any invoice number. What is the failure?', opts: ['SQL injection', 'Missing server-side object-level authorization (IDOR)', 'Weak TLS configuration', 'Clickjacking'], correct: 1,
        why: 'Authentication is checked but object ownership is not — classic IDOR/BOLA (OWASP API #1). Fix: centralize per-object authorization decisions.' },
      { q: 'The architecturally preferred replacement for a static API key stored in an app\'s config is:', opts: ['A longer, randomly generated static key', 'Workload identity federation / dynamic short-lived credentials', 'The same key encrypted with base64', 'Rotating the static key weekly'], correct: 1,
        why: 'Federation (or a vault issuing dynamic secrets) removes the long-lived stored credential entirely — nothing to leak, nothing to rotate by hand.' },
      { q: 'Which pairing violates separation of duties?', opts: ['Developer proposes change; peer reviews it', 'The same administrator creates accounts and approves their access requests', 'Security team monitors logs written by IT', 'DBA backs up databases that auditors sample'], correct: 1,
        why: 'Creator+approver in one role means no independent check — the classic SoD violation auditors flag first.' },
    ],
  },
};
