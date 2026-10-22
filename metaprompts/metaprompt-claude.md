# METAPROMPT FOR CLAUDE — "SecForge: Security Architect Academy"
# How to use: paste EVERYTHING below the line into a fresh Claude conversation.
# Claude renders the app live in an Artifacts panel as it builds — iterate in plain English after.
# Best model setting: Claude Sonnet (or Opus for the deepest content pass) with extended thinking.

====================================================================

<context>
You are a senior full-stack engineer and security-education curriculum designer. In a previous engagement, a production app called **SecForge — Security Architect Academy** was specified in detail. Your job is to rebuild it to that spec, at full content depth, as a single self-contained HTML artifact. Do not summarize the spec back to me. Do not produce placeholders, stubs, or "lorem ipsum" content — every lesson, question, email, and explanation must be written in full, because the content IS the product.
</context>

<product_spec>
SecForge is a free, publishable, offline-capable training ground for people who want to become **Security Architects** — the HTB/TryHackMe experience specialized for the architect track. Static PWA: no backend, no accounts, no tracking, localStorage saves.

**Sections (sidebar nav, hash-routed SPA):**

1. **Dashboard** — hero ("Forge yourself into a Security Architect"), 6 stat tiles (Level, XP, streak🔥, lessons, labs, badges), 6 track cards with progress bars (Academy / Labs / Phish Rush / Career Map / Resources / Settings), full badge grid (earned = lit, unearned = grayscale).

2. **Academy** — 12 sequential modules; each unlocks by passing the previous module's quiz (≥70%); the capstone requires all 11 prior quizzes:
   - M0 Security Foundations (CIA triad, risk = likelihood × impact with mitigate/transfer/accept/avoid, defense-in-depth onion)
   - M1 Governance, Risk & Compliance (policy→standard→procedure→guideline hierarchy, ISO 27001 vs SOC 2 I/II vs PCI vs GDPR vs NIST CSF 2.0 / 800-53 / CIS, control mapping "build once, map many", privacy by design, human-layer security)
   - M2 Threat Modeling & Adversary Thinking (Shostack's 4 questions, DFDs + trust boundaries, full STRIDE table mapped to properties and countermeasures, DREAD ranking, MITRE ATT&CK tactics vs techniques)
   - M3 Network Security Architecture (segmentation/zones/DMZ, Purdue model for OT, microsegmentation vs VLAN ACLs, NIST 800-207 zero trust: PDP/PEP/trust algorithm, ZTNA vs VPN, NAC, DDoS absorption)
   - M4 Identity & Access Management (NIST 800-63B AALs, passkeys/FIDO2 as structurally phishing-resistant vs AiTM proxies, RBAC/ABAC/ReBAC/policy-as-code, IDOR & server-side object authorization, SoD, JIT privilege, secrets management, workload identity federation, KMS/envelope encryption)
   - M5 Application & Data Security (secure SDLC, SAST/DAST/SCA/SBOM/SLSA, SQLi/XSS/deserialization/SSRF/path traversal structural fixes, crypto for architects: TLS, AES-GCM, Argon2id, key hierarchies, CSPRNG, tokenization)
   - M6 Cloud & Infrastructure Security (shared responsibility by service type, landing zones, SCPs/Azure Policy, IaC + policy-as-code guardrails, golden modules, immutability, container/K8s: distroless images, NetworkPolicies, PSA restricted, external secrets)
   - M7 Detection, Response & Adversary Emulation (EDR/NDR/SIEM/SOAR/UEBA, centralized off-host log retention, detection-as-code, NIST 800-61 IR lifecycle, identity-trust rebuilding after compromise, purple teaming, BAS)
   - M8 Resilience: Backup, DR & BC (RTO/RPO as a price list, patterns backup→pilot light→warm standby→active-active, ransomware-resilient 3-2-1-1-0 with immutable object-lock copies in a separate identity plane, restore drills, chaos engineering, graceful degradation)
   - M9 Zero Trust Everywhere + Emerging Tech (ZT maturity across identity/devices/applications/data, OWASP LLM Top 10: prompt injection, indirect injection via retrieved content, excessive agency, guardrails; OT/IoT: A-I-C priority inversion, passive discovery, data diodes)
   - M10 Strategy, Metrics & the Architect's Craft (assessment→roadmap sequencing "visibility before control", outcome vs activity metrics, MTTD/MTTR, ATT&CK validated-coverage heat-map as the killer board chart, third-party risk + breach-notification SLAs, M&A due diligence)
   - M11 Capstone: Design Under Fire (one long brief: Meridian Health telehealth scale-up with 8 embedded flaws + 6 heavy scenario exam questions)
   Each module = 3–4 full lessons (~150-250 words each, real teaching content, "Architect's lens" callouts, key-terms chips) + a 4–6 question quiz where EVERY option carries a written explanation.

3. **Labs (13, five distinct interactive engines):**
   - `flags` engine (click suspicious evidence in a rendered email/log; false flags penalize; every element gets a FOUND/MISSED/FALSE-FLAG verdict card): Lab 01 Phishing Forensics (3 complete fake emails: IT helpdesk credential harvester with digit-squatted domain + urgency + threat + trap "Dear User"; BEC vendor bank-detail change with "don't call the old number" isolation play; DocuSign brand-impersonation .pdf.exe double extension with a deliberately legit-looking sender), Lab 07 SOC Log Analysis (3 alert panels: impossible-travel AiTM token theft with malicious inbox rule + OAuth offline_access persistence; Word→PowerShell→C2→LSASS chain; cloud trail with public bucket + mass exfil + dormant-key resurrection + log-destination tampering)
   - `match` engine (code snippet → pick attack class from 4 options → graded with why + the fix): Lab 02 OWASP Top 10 (SQLi, stored XSS, path traversal, SSRF, insecure deserialization, open redirect — real vulnerable JS snippets), Lab 04 IAM failures (IDOR, missing function-level authz, mass assignment, weak KBA proofing, OAuth state/PKCE, public S3 policy), Lab 08 Purple Team coverage (ATT&CK techniques T1566/T1059/T1003/T1078/T1567 → correct telemetry), Lab 12 Board metrics (classify 6 real metrics: outcome vs vanity vs compliance vs resilience)
   - `branch` engine (scenario console, 3 choices per step, partial credit 1 / 0.5 / 0 with distinct good/ok/bad styling and feedback per choice): Lab 03 Threat Model a Login Flow (enumeration, token design, trust boundaries, security questions, monitoring), Lab 05 Ransomware Incident Commander (5-step timeline Mon 03:12 → post-incident review), Lab 06 Zero Trust Design Sprint, Lab 11 AI prompt-injection defense ("RoboReply" refund agent: instruction/data separation, indirect injection via knowledge base, deterministic $200 cap outside the model, PII/DPIA, auditor answer), Lab 13 Capstone Architecture Triage (Meridian: one-engineer-for-30-days, partner VPN under deadline, $200k budget pick, SOC 2 Type II in 12 months, one-sentence board posture)
   - `calc` engine (5 sliders → computed results + 5 lesson callouts): Lab 09 Risk Quantification (gross loss → ALE → MDR counter-offer ROSI math rendered live), Lab 10 Backup & DR (3-2-1-1-0 posture scoring vs restore-time vs RTO)
   - Lab completion = XP scaled by score, badges fire, retakes keep best score.

4. **Phish Rush arcade** — 60-second run, one email at a time (sender + subject + body), verdict buttons PHISH/LEGIT, scoring 10 × (1 + combo×0.1), −5 on miss, ~900ms/2s reveal delay showing the "tell" (the transferable skill), personal best persisted, XP capped per run. Corpus: 25 realistic emails (13 phish / 12 legit — include tricky legit mail like real DocuSign completion notices and GitHub device alerts so players can't just flag everything).

5. **Career Map** — 12 role cards (SOC Analyst, Pentester/Red Teamer, AppSec, Cloud Security, DFIR, GRC, Security Engineer, Detection Engineer, CISO, SECURITY ARCHITECT ★ marked as the target, Privacy Engineer, DevSecOps): each with tier, real US pay band, demand level, what-the-work-actually-is, core skills list, cert ladder, entry path, and an explicit "relation to the architect track" callout. Plus a 3-question fit-finder that tallies to a suggested entry point.

6. **Resources** — 6 curated categories with real URLs: hands-on platforms (TryHackMe, HTB, PortSwigger Academy, LetsDefend, PentesterLab), free standards (NIST CSF, 800-207, ATT&CK Navigator, OWASP, CIS), threat intel (Krebs, CISA KEV, HIBP), architecture craft (SABSA, C4 model, Shostack's book, Google SRE), cert ladder (Security+ → CISSP → CCSP/CISM → SABSA/TOGAF), communities.

7. **Settings** — badge gallery, progress export (downloads secforge-progress.json) / import / hard reset with confirm, PWA install instructions, about + ethics note.
</product_spec>

<gamification>
XP: lesson complete +20, quiz pass = module-defined (120–300, capstone highest), lab XP scaled by score (floor 50%), Rush capped 40/run. 11 levels by XP threshold: Initiate 0 → Apprentice 250 → Builder 600 → Defender 1100 → Engineer 1800 → Threat Modeler 2700 → Designer 3800 → Strategist 5200 → Architect 4200* (rebalance so level 9 is reachable at ~70% completion — levels must motivate, not wall) → Principal → Distinguished. 19 badges with exact ids (first-lesson, quiz-ace, phish-hunter, rush-10, rush-20, threat-modeler, identity-guru, incident-cmdr, zt-architect, log-reader, purple, quant, dr-ready, ai-guardian, storyteller, capstone-done, all-quizzes, all-labs, architect). Daily streak with yesterday-chaining. Level-up and badge toasts.
</gamification>

<design_system>
Dark cyber-terminal: bg #0a0e14, panels #11161f, cards #151b26, borders #232b3a/#2d3850, text #e6edf3, muted #8b98a9. Accent gradient cyan #22d3ee → violet #a78bfa (used on XP bars, primary buttons, brand). Mono font (ui-monospace stack) for terminal motifs, stats, code; system sans for body. Terminal/console motifs: fake window chrome dots, `architect@secforge:~$` prompts, `$ whoami` taglines. Email viewer styled like a mail client; log panels styled like a SIEM console. Fully responsive: sidebar collapses to a slide-in drawer under 920px with a hamburger. Subtle radial glows + grid-mask hero. No external fonts, no CDN dependencies, no frameworks.
</design_system>

<tech_constraints>
- ONE self-contained index.html (inline `<style>` and `<script>`) so it works as a Claude Artifact, renders live, and downloads as a single file. No imports, no framework, vanilla ES2020+.
- Hash router (#/dashboard, #/module/m0, #/lesson/m0/l1, #/quiz/m0, #/lab/phishing, #/rush, #/careers, #/career/:id, #/resources, #/settings).
- Template-literal rendering with an esc() HTML-escaper used on all data strings; a h()/ha() DOM helper pair where ha() appends ALL top-level nodes (a firstChild-only helper silently drops siblings of multi-root HTML — this exact bug cost a previous build hours).
- Versioned localStorage save key (secforge_save_v1) with DEFAULT_STATE merge on load; export via Blob download.
- window error trap that renders startup errors into the view (a silent blank page is undiagnosable); boot() must actually be invoked at the end.
- When adapting to multi-file for real hosting: also emit sw.js (service worker, NETWORK-first with cache fallback + version-string bump so updates propagate), manifest.webmanifest, SVG icons — as secondary code blocks after the artifact.
</tech_constraints>

<process>
1. Think first (extended reasoning): resolve the module unlock graph, XP economy, and lab engine interfaces BEFORE writing code.
2. Build in this order inside the same artifact: design system CSS → state/engine (load/save, XP, levels, badges, streak, router) → shared UI components → Academy content + quiz engine → the five lab engines → Phish Rush → careers/resources/settings → boot.
3. Then run your own QA pass against the <quality_gates> checklist and FIX what fails before presenting. State the checklist results explicitly.
4. Keep the total under the artifact size limit by writing dense, content-complete code — never by truncating content. If you genuinely cannot fit everything in one artifact, keep ALL of M0–M3 + labs 01–05 + Rush complete and say exactly what to generate in a follow-up turn ("continue with M4–M7") rather than silently compressing.
</process>

<quality_gates>
- 12 modules, 35+ lessons, 50+ quiz questions, each quiz option has a unique explanation
- 13 labs present with correct engine dispatch; flags labs include fromFlag metadata per email and at least one trap flag; branch labs use 3-choice partial credit; calc labs compute real formulas
- 25 Rush emails with boolean phish labels and a "tell" each; phish:legit ≈ 13:12
- Data integrity self-check function (counts + schema assertions) runnable from the console, logs PASS/FAIL
- Click-through proof: lesson → +20 XP → quiz pass → next module unlocks → lab scoring → badge toast → reload persists everything
- Zero console errors on load; level thresholds reachable (level 9 ≈ 70% completion); mobile drawer works
</quality_gates>

<output_format>
One HTML artifact (the complete app) + a short closing message: what was verified against the quality gates, and the single limitation worth knowing. No restating of this spec. Then wait for my iteration feedback.
</output_format>
