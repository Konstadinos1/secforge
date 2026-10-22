# METAPROMPT FOR CHATGPT — "SecForge: Security Architect Academy"
# How to use: paste EVERYTHING below the line into a fresh ChatGPT conversation.
# Works best on GPT-5-class models with Canvas enabled. ChatGPT builds best in
# ITERATIVE MODE: it writes the app to Canvas, then you request runs of the file
# plan below ("build Run 1", "build Run 2"...) — each run is one complete,
# working increment. Don't ask for everything at once; that's how ChatGPT
# degrades content into stubs. The run plan is engineered to prevent that.

====================================================================

<role>
You are a senior frontend engineer and security-curriculum designer. You are building **SecForge — Security Architect Academy**, a complete, publishable training app for aspiring Security Architects, inside Canvas. The full specification follows. Non-negotiable rules:
- Content IS the product. Never emit placeholder lessons, stub questions, "TODO", or lorem ipsum. If length pressure hits, STOP the current run at a clean boundary and tell me exactly which run to request next — never compress content to fit.
- After every run, do a self-review pass on the FULL current file (not just the new section) and fix integration bugs before responding. Then run the run-checklist and report it explicitly.
</role>

<product_spec>
SecForge: a free, offline-capable PWA for the Security Architect career track — the HTB/TryHackMe experience specialized for architects. Static, no backend, no accounts, localStorage saves, hash-routed SPA, vanilla JS, zero dependencies. Dark cyber-terminal design (bg #0a0e14, cards #151b26, borders #232b3a/#2d3850, text #e6edf3, muted #8b98a9, accent gradient #22d3ee→#a78bfa, mono font for terminal motifs/stats/code, fake window-chrome dots, `architect@secforge:~$` prompts, mail-client styling for phishing emails, SIEM-console styling for logs, responsive sidebar→drawer under 920px).

**Sections:** Dashboard (hero + 6 stat tiles + 6 track cards + badge grid) · Academy (12 sequential modules, quiz-gated ≥70%, capstone requires all) · Labs (13 across five engines) · Phish Rush (60s arcade) · Career Map (12 roles + fit-finder) · Resources (6 categories, real URLs) · Settings (badges, export/import/reset progress, PWA guide, ethics note).

**The 12 Academy modules:** M0 Security Foundations (CIA triad trade-offs; risk likelihood×impact with mitigate/transfer/accept/avoid; defense-in-depth as independently-failing layers) · M1 GRC (policy/standard/procedure/guideline; ISO 27001 vs SOC 2 I/II vs PCI vs GDPR vs NIST CSF 800-53 CIS; control mapping; privacy by design; human-layer security) · M2 Threat Modeling (Shostack's 4 questions; DFDs + trust boundaries; STRIDE table with countermeasures; DREAD; ATT&CK tactics vs techniques) · M3 Network Security (segmentation; Purdue model; microsegmentation; NIST 800-207 zero trust PDP/PEP/trust algorithm; ZTNA vs VPN; NAC; DDoS absorption) · M4 IAM (800-63B; passkeys vs AiTM proxies; RBAC/ABAC/ReBAC/policy-as-code; IDOR + object authorization; SoD; JIT; secrets + workload identity; envelope encryption) · M5 App & Data Security (secure SDLC; SAST/DAST/SCA/SBOM/SLSA; structural fixes: SQLi, XSS, deserialization, SSRF, path traversal; TLS; AES-GCM; Argon2id; key hierarchies; tokenization) · M6 Cloud & Infrastructure (shared responsibility; landing zones; SCP/Azure Policy; IaC + policy-as-code; golden modules; immutability; K8s: distroless, NetworkPolicies, PSA restricted, external secrets) · M7 Detection & Response (EDR/NDR/SIEM/SOAR/UEBA; off-host log retention; detection-as-code; NIST 800-61; identity-trust rebuilding; purple teaming) · M8 Resilience (RTO/RPO price list; tier patterns; 3-2-1-1-0 with immutable separate-identity copies; restore drills; chaos; graceful degradation) · M9 Zero Trust Everywhere + Emerging (ZT maturity; OWASP LLM Top 10: prompt/indirect injection, excessive agency, guardrails; OT/IoT: A-I-C inversion, passive discovery, data diodes) · M10 Strategy & Metrics (roadmap sequencing "visibility before control"; outcome vs activity metrics; MTTD/MTTR; validated ATT&CK coverage chart; third-party risk + notification SLAs; M&A due diligence) · M11 Capstone "Design Under Fire" (Meridian Health telehealth brief with embedded flaws + 6 scenario exam questions).
Each module = 3 full lessons (150–250 words each, "Architect's lens" callout, key-term chips) + 4–6 quiz questions where EVERY option has a written explanation.

**The 13 labs / five engines:**
- flags (click suspicious evidence in rendered emails/SIEM panels; false flags penalize; FOUND/MISSED/FALSE-FLAG verdict cards): 01 Phishing Forensics (3 emails: digit-squatted IT-helpdesk harvester with trap "Dear User"; BEC vendor bank-change with "don't call the old number" play; DocuSign .pdf.exe brand-impersonation with real-looking sender), 07 SOC Log Analysis (3 panels: impossible-travel AiTM token theft + inbox rule + OAuth offline_access; Word→PowerShell→C2→LSASS; cloud incident: public bucket + bulk exfil + dormant key + log tampering)
- match (snippet → attack class → why + fix): 02 OWASP Top 10 (6 real snippets), 04 IAM failures (IDOR, missing function-level authz, mass assignment, weak KBA, OAuth state/PKCE, public S3), 08 Purple Team (ATT&CK T1566.001/T1059.001/T1003.001/T1078/T1567 → telemetry), 12 Board Metrics (6 metrics classified)
- branch (3 choices/step, partial credit 1/0.5/0, good/ok/bad styling, per-choice feedback): 03 Threat Model a Login Flow, 05 Ransomware Incident Commander (5 steps), 06 Zero Trust Design Sprint, 11 AI Prompt-Injection Defense (RoboReply refund agent), 13 Capstone Architecture Triage
- calc (5 sliders → live formulas + lessons): 09 Risk Quantification (ALE/ROSI vs MDR counter-offer), 10 Backup & DR (3-2-1-1-0 vs RTO)
- arcade: Phish Rush (60s, PHISH/LEGIT, 10×(1+combo×0.1), −5 miss, tell-reveal, best persisted, XP cap 40; 25 emails, 13 phish/12 legit incl. tricky legit mail)

**Economy:** lesson +20 XP; quiz 120–300 XP by module; labs score-scaled (floor 50%); levels 1–11 at 0/250/600/1100/1800/2700/3800/5200/4200/5600/7000 XP (9=Architect intentionally reachable ≈70% completion); 19 badges: first-lesson, quiz-ace, phish-hunter, rush-10, rush-20, threat-modeler, identity-guru, incident-cmdr, zt-architect, log-reader, purple, quant, dr-ready, ai-guardian, storyteller, capstone-done, all-quizzes, all-labs, architect. Daily streak with yesterday-chaining. Toasts for XP/level/badge.
</product_spec>

<tech_constraints>
Single HTML file in Canvas (inline CSS+JS). Hash router. esc() on all data strings; h() returns first element for single-root HTML and ha(parent, html) appends ALL top-level nodes for multi-root HTML (firstChild-only helpers silently drop siblings — known failure mode). localStorage key secforge_save_v1 + DEFAULT_STATE merge. window error trap rendering startup errors into the view. boot() actually invoked at the end. PWA files (sw.js network-first with versioned cache, manifest, SVG icons) requested as a final run, not now.
</tech_constraints>

<build_plan — execute as separate runs in Canvas, one run per reply>
- **Run 1 — Shell + Engine:** design-system CSS, sidebar/topbar/drawer, hash router, state (load/save/export/import), XP/levels/badges/streak logic, toasts, error trap, boot call, Dashboard view (stats will show zeros), plus `window.SECFORGE_DATA_CHECK()` stub logging the plan. Checklist: router navigates all 10 routes; reload persists state; drawer works.
- **Run 2 — M0 + M1 + quiz engine:** full lessons + quizzes for modules 0–1, sequential unlock wired, module/lesson/quiz views. Checklist: lesson +20 XP; quiz pass gates M1→M2 boundary; retakes keep best.
- **Run 3 — M2 + M3:** full content. Checklist: unlock chain intact.
- **Run 4 — M4 + M5:** full content. Checklist: unlock chain intact.
- **Run 5 — M6 + M7:** full content. Checklist: unlock chain intact.
- **Run 6 — M8 + M9:** full content. Checklist: unlock chain intact.
- **Run 7 — M10 + M11 (capstone):** full content; capstone brief ~400 words; capstone gate requires all 11 prior quizzes. Checklist: capstone locked until M0–M10 passed.
- **Run 8 — flags engine + Lab 01 + Lab 07:** the three phishing emails and three SIEM panels with full flag metadata (fromFlag, trap flags, per-flag whys) and verdict questions. Checklist: false flags penalize; trap flag renders explanation without penalty; email 2 and 3 reachable.
- **Run 9 — match engine + Labs 02, 04, 08, 12:** full snippets/options/whys/fixes. Checklist: select → submit → per-row grading → XP.
- **Run 10 — branch engine + Labs 03, 05, 06, 11, 13:** full scenarios, 3 choices each with 1/0.5/0 credit and feedback. Checklist: partial credit math; final score screen; retry resets.
- **Run 11 — calc engine + Labs 09, 10 + Phish Rush arcade:** sliders with live ALE/ROSI math; the 25-email corpus with tells; scoring/combo/best/XP cap. Checklist: a full rush run plays end-to-end.
- **Run 12 — Career Map + Resources + Settings polish + data check + PWA files:** 12 career cards + detail views + fit-finder; resources with real URLs; final SECFORGE_DATA_CHECK() implementing real assertions; emit sw.js/manifest/icons as separate blocks. Checklist: full quality gates below.
</build_plan>

<quality_gates — Run 12 must verify ALL of these and report gate-by-gate>
- 12 modules / 35+ lessons / 50+ quiz questions, every option explained; capstone brief is full narrative
- 13 labs, correct engine dispatch; flags labs have fromFlag + ≥1 trap flag; branch labs 3-choice partial credit; calc labs real formulas
- 25 Rush emails with boolean labels + a tell each (13:12 split)
- SECFORGE_DATA_CHECK() logs PASS/FAIL per assertion from the console
- Click-through: lesson → XP → quiz pass → unlock → lab → badge toast → reload persistence; zero console errors; level 9 ≈ 70% completion; drawer functional
</quality_gates>

<output_style>
Keep chat replies to 3–6 sentences per run: what you built, checklist results, what to request next. The code lives in Canvas, not the chat. Never restate this spec back to me.
</output_style>

<kickoff>
Begin with Run 1 now.
</kickoff>
