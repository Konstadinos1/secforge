# METAPROMPT FOR GEMINI — "SecForge: Security Architect Academy"
# How to use: paste EVERYTHING below the line into Google AI Studio (gemini-2.5-pro,
# thinking budget ON, temperature ~0.7) or a fresh Gemini Advanced chat.
# Gemini's 1M-token window means it can one-shot the WHOLE app in a single response — let it.
# Then use the "AI Mentor" extension prompt at the bottom to light up the Gemini-exclusive feature.

====================================================================

<role>
You are operating as a single senior engineering team: security-education curriculum designer + staff frontend engineer + game-economy designer + QA lead. You are rebuilding a production-grade app called **SecForge — Security Architect Academy** from a complete specification. Your decisive advantage is context budget: the spec below is fully within your window, so you will deliver the ENTIRE app — every lesson, every question, every email — in ONE complete response. Do not summarize. Do not abbreviate. Do not write "[continue in next response]". Do not compress lesson text into bullet skeletons. If you feel the urge to truncate, that is a failure mode, not a constraint: 1M tokens is more than enough for ~60KB of dense, complete code.
</role>

<product_spec>
SecForge is a free, publishable, offline-capable PWA training ground for becoming a **Security Architect** — the HTB/TryHackMe experience specialized for the architect career track. Static site: no backend, no accounts, no tracking, localStorage saves, hash-routed SPA, vanilla JS only.

**Seven sections** (sidebar nav with collapsible mobile drawer):

1. **Dashboard** — hero with terminal tagline (`$ whoami → future_security_architect`), six stat tiles (Level, XP, streak, lessons, labs, badges), six track cards with live progress bars, complete badge grid (earned lit / unearned grayscale).

2. **Academy** — 12 sequential modules, each gated by passing the previous quiz ≥70%:
   M0 Security Foundations (CIA triad and its trade-offs; risk = likelihood × impact with the four treatments; defense-in-depth as independently-failing layers) · M1 GRC (policy→standard→procedure→guideline; ISO 27001 vs SOC 2 Type I/II vs PCI DSS vs GDPR vs NIST CSF 2.0/800-53/CIS; control mapping "build once, map many"; privacy by design and data minimization; human-layer security with report-rate metrics) · M2 Threat Modeling (Shostack's four questions; DFDs and trust boundaries; the full STRIDE table with properties and countermeasures; DREAD; ATT&CK tactics vs techniques) · M3 Network Security (segmentation and zones; Purdue model; microsegmentation vs VLAN ACLs; NIST 800-207 zero trust with PDP/PEP/trust algorithm; ZTNA vs VPN; NAC; DDoS absorption architecture) · M4 IAM (800-63B authenticator assurance; passkeys as structurally phishing-resistant vs AiTM proxies; RBAC/ABAC/ReBAC/policy-as-code; IDOR and server-side object authorization; separation of duties; JIT privilege; secrets management; workload identity federation; envelope encryption) · M5 Application & Data Security (secure SDLC; SAST/DAST/SCA/SBOM/SLSA; structural fixes for SQLi, XSS, deserialization, SSRF, path traversal; TLS; AES-GCM; Argon2id; key hierarchies; CSPRNG; tokenization) · M6 Cloud & Infrastructure (shared responsibility by service type; landing zones; SCP/Azure Policy guardrails; IaC + policy-as-code; golden modules; immutable infrastructure; container/K8s: distroless images, default-deny NetworkPolicies, PSA restricted, external secrets) · M7 Detection & Response (EDR/NDR/SIEM/SOAR/UEBA; centralized off-host log retention; detection-as-code; NIST 800-61 lifecycle; identity-trust rebuilding after compromise; purple teaming; BAS) · M8 Resilience (RTO/RPO as a negotiable price list; tier patterns; 3-2-1-1-0 with immutable object-lock copies in a separate identity plane; restore drills; chaos engineering; graceful degradation) · M9 Zero Trust Everywhere + Emerging (ZT maturity; OWASP LLM Top 10 with indirect prompt injection and excessive agency; OT/IoT with A-I-C priority inversion and passive discovery) · M10 Strategy & Metrics (assessment→roadmap with "visibility before control" sequencing; outcome vs activity metrics; MTTD/MTTR; validated ATT&CK coverage as the killer board chart; third-party risk with breach-notification SLAs; M&A security due diligence) · M11 Capstone "Design Under Fire" (Meridian Health telehealth brief with embedded flaws + heavy scenario exam).
   Each module: 3 full lessons (150–250 words of real teaching prose, an "Architect's lens" callout, key-term chips) + a 4–6 question quiz where EVERY option carries a written explanation. The capstone's brief must be a full narrative (~400 words) with 6 scenario questions.

3. **Labs — 13 labs across five real interactive engines** (not stubs):
   - **flags**: rendered email/SIEM panels where you click suspicious evidence; false flags penalize; submit produces FOUND/MISSED/FALSE-FLAG verdict cards with explanations. Lab 01 Phishing Forensics (3 emails: IT-helpdesk credential harvester on a digit-squatted domain with a trap "Dear User" greeting; BEC vendor bank-change with a "don't call our old number" isolation play; DocuSign brand-impersonation .pdf.exe with a deliberately real-looking sender domain). Lab 07 SOC Log Analysis (3 alert panels: impossible-travel AiTM token theft + malicious inbox rule + OAuth offline_access persistence; Word→PowerShell→C2→LSASS process chain; cloud-trail incident with public bucket + bulk exfil + dormant-key resurrection + log tampering).
   - **match**: vulnerable code snippet → pick the attack class from 4 options → graded with why + the fix. Lab 02 OWASP Top 10 (6 real snippets), Lab 04 IAM failures (IDOR, missing function-level authz, mass assignment, weak KBA, OAuth state/PKCE, public S3 policy), Lab 08 Purple Team (ATT&CK T1566.001/T1059.001/T1003.001/T1078/T1567 → correct telemetry), Lab 12 Board Metrics (classify 6 metrics: outcome vs vanity vs compliance vs resilience).
   - **branch**: scenario console with 3 choices per step, partial credit (1 / 0.5 / 0) styled good/ok/bad with per-choice feedback. Lab 03 Threat Model a Login Flow (enumeration, token design, trust boundary, security questions, monitoring), Lab 05 Ransomware Incident Commander (5-step timeline from 03:12 detection to blameless review), Lab 06 Zero Trust Design Sprint, Lab 11 AI prompt-injection defense (RoboReply refund agent: instruction/data separation, indirect injection, deterministic caps OUTSIDE the model, PII/DPIA, auditor evidence), Lab 13 Capstone Architecture Triage (budget, sequencing, SOC 2 deadline, partner VPN, board posture).
   - **calc**: 5 sliders → live computed formulas + 5 written lessons. Lab 09 Risk Quantification (gross loss → ALE → MDR ROSI comparison, rendered live), Lab 10 Backup & DR (3-2-1-1-0 posture scoring vs RTO math).
   - **arcade**: Phish Rush — 60 seconds, one email at a time, PHISH/LEGIT verdicts, 10 × (1 + combo×0.1) scoring, −5 penalty, per-answer "tell" reveal, persisted best, XP cap. 25-email corpus (13 phish / 12 legit including realistic legit mail: GitHub device alerts, DocuSign completion notices, Jira assignments).

4. **Career Map** — 12 roles (SOC Analyst, Pentester, AppSec, Cloud Security, DFIR, GRC, Security Engineer, Detection Engineer, CISO, **Security Architect ★ target**, Privacy, DevSecOps): tier, real US pay bands, demand, actual day-to-day, skills, cert ladder, entry path, and "relation to the architect track". Plus a 3-question fit-finder.

5. **Resources** — 6 categories, real URLs (TryHackMe/HTB/PortSwigger/LetsDefend/PentesterLab; NIST CSF + 800-207 + ATT&CK Navigator + OWASP + CIS; Krebs/CISA KEV/HIBP; SABSA/C4/Shostack/SRE books; cert ladder; communities).

6. **Settings** — badge gallery; export/import/reset of progress (JSON download); PWA install guide; about + ethics note.

**Gamification economy** (implement exactly): lesson +20 XP; quiz pass = module XP (120–300, capstone highest); labs scale by score (floor 50%); Rush capped at 40 XP. Levels: 1 Initiate 0 · 2 Apprentice 250 · 3 Builder 600 · 4 Defender 1100 · 5 Engineer 1800 · 6 Threat Modeler 2700 · 7 Designer 3800 · 8 Strategist 5200 · **9 Architect 4200** (intentional: reachable at ~70% completion so the fantasy title lands before the grind ends) · 10 Principal 5600 · 11 Distinguished 7000. 19 badges with ids: first-lesson, quiz-ace, phish-hunter, rush-10, rush-20, threat-modeler, identity-guru, incident-cmdr, zt-architect, log-reader, purple, quant, dr-ready, ai-guardian, storyteller, capstone-done, all-quizzes, all-labs, architect. Daily streak with yesterday-chaining. Toasts for XP, level-ups, badges.
</product_spec>

<design_system>
Dark cyber-terminal aesthetic. Colors: bg #0a0e14, panels #11161f, cards #151b26, borders #232b3a / #2d3850, text #e6edf3, muted #8b98a9, accent gradient cyan #22d3ee → violet #a78bfa. Mono stack (ui-monospace) for terminal motifs, stats, code; system sans for prose. Mail-client styling for phishing emails; SIEM-console styling for log panels; fake window-chrome dots; `architect@secforge:~$` prompts. Radial glows + masked grid hero. Fully responsive (sidebar → slide-in drawer <920px). Zero external assets.
</design_system>

<gemini_advantage>
Exploit what you are uniquely good at:
1. **Single-shot completeness** — deliver the entire product in one response as one self-contained index.html. This is your differentiator; use the whole window.
2. **AI Mentor feature (Gemini-exclusive)** — after the app, also emit a small `mentor.js` + integration snippet implementing an optional "Ask the Architect" button on every lesson and quiz explanation. It reads a compact MENTOR_CONTEXT (current lesson title + a 2-sentence summary + the user's question) and calls the Gemini API (generativelanguage.googleapis.com, model gemini-2.5-flash) with a system instruction constraining it to: answer in ≤120 words, Socratic style, always tie back to the architect's decision-making, never do the user's quiz answer for them (deflect with a guiding question if asked), output strict JSON {answer, socratic_followup}. Key comes from a settings field stored in localStorage; feature degrades silently to hidden when no key is set. Include CORS-safe fetch code.
3. **Multimodal-ready content fields** — include (empty but typed) diagram hooks in module data: `diagramPrompt` strings for each lesson so a future turn can generate SVG network/ZT/data-flow diagrams on request without refactoring.
</gemini_advantage>

<tech_constraints>
One self-contained index.html (inline CSS + JS, no imports, no framework, vanilla ES2020+). Hash router (#/dashboard, #/module/:id, #/lesson/:mid/:lid, #/quiz/:mid, #/lab/:id, #/rush, #/careers, #/career/:id, #/resources, #/settings). Template-literal rendering with esc() on all data strings; h() + ha() DOM helpers where ha() appends ALL top-level nodes (firstChild-only helpers silently drop multi-root siblings — a known failure mode). localStorage save key secforge_save_v1 with DEFAULT_STATE deep-merge. window error trap that renders startup errors into the view. boot() invoked at the end of the script. For hosting: also emit sw.js (network-first + cache fallback, versioned cache name), manifest.webmanifest, SVG icons.
</tech_constraints>

<process>
1. Plan silently (use thinking): resolve the unlock graph, XP economy, and lab engine interfaces before writing.
2. Emit the complete index.html in one artifact/code block.
3. Emit mentor.js + integration notes + PWA files.
4. Emit a QA report section: run the quality gates mentally, fix failures IN the code before finishing, and report gate-by-gate results explicitly. End with the single limitation worth knowing.
</process>

<quality_gates>
- 12 modules / 35+ lessons / 50+ quiz questions, every option explained; capstone brief is a full narrative
- 13 labs, correct engine dispatch; flags labs have fromFlag metadata + ≥1 trap flag; branch labs use 3-choice partial credit; calc labs compute real formulas
- 25 Rush emails, boolean labels, a tell each, phish:legit ≈ 13:12
- Console-runnable data integrity self-check logging PASS/FAIL
- Full click-through works: lesson → XP → quiz pass → unlock → lab → badge → reload persistence; zero console errors; level 9 reachable ≈ 70% completion; mobile drawer functional
</quality_gates>

<output_format>
1. index.html (complete, one block) · 2. mentor.js + integration · 3. PWA files · 4. QA gate report. No spec restatement. No truncation.
</output_format>

--------------------------------------------------------------------
# EXTENSION PROMPT (run in a follow-up turn, after the app works):
# "Add a generative 'Lab Forge' mode powered by the Gemini API: using the same
#  mentor.js key, generate unlimited fresh phishing-email forensics rounds in
#  the exact schema of lab 01 (fromFlag, flags[], traps[], questions[]), render
#  them in the existing flags engine, and validate the JSON against that schema
#  before play. Include a difficulty selector (junior / analyst / architect)."
# This turns the static corpus into infinite content — the single biggest
# competitive moat versus HTB/TryHackMe free tiers.
