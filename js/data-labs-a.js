/* SecForge — labs, phishing corpus, arcade, career map. Part 1: labs 01-06 */
'use strict';

const LABS_A = [
  {
    id: 'phishing', num: '01', title: 'Phishing Forensics Lab', type: 'flags',
    xp: 140, gate: 'm1', desc: 'Work three suspicious emails: click every red flag, then answer the triage questions like a SOC analyst.',
    intro: `You are on incident triage. For each email: <b>click every element that indicates phishing</b> (sender, domains, links, urgency, attachments, content tells), then answer the verdict questions. Wrong clicks on innocent elements count against you — real analysts must justify every flag.`,
    emails: [
      {
        from: 'IT Help Desk <it-helpdesk@micros0ft-secure.com>',
        subject: 'URGENT: Your password expires in 24 hours',
        date: 'Today, 6:47 AM',
        to: 'all-staff@yourcompany.com',
        fromFlag: 'sender',
        bodyHtml: `<p><span class="fl" data-flag="greeting">Dear User</span>,</p>
<p>Your mailbox password will <span class="fl" data-flag="urgency">expire in 24 hours</span>. Failure to update will result in <span class="fl" data-flag="threat">permanent account deletion and loss of all company data</span>.</p>
<p>Kindly <a class="linkish"><span class="fl" data-flag="link">click here</span></a> to validate your credentials immediately on our <span class="fl" data-flag="domain">secure portal: http://micros0ft-secure.com/verify</span></p>
<p>Thank you,<br>IT Support Team</p>`,
        flags: [
          { id: 'sender', label: 'Sender domain micros0ft-secure.com', why: 'Digit-squatting ("o"→"0") plus a non-corporate domain. The real IT would write from @yourcompany.com. Check the actual address, not the display name.' },
          { id: 'domain', label: 'http:// (no TLS) + typo domain in the link', why: 'Credential-harvesting portal on a lookalike domain, delivered over plain HTTP. Two tells in one URL.' },
          { id: 'urgency', label: 'False urgency: "expires in 24 hours"', why: 'Countdown pressure is engineered to suppress critical thinking. Legit password expiry notices reference the real policy window and never threaten same-day deletion.' },
          { id: 'threat', label: 'Threat of permanent deletion', why: 'Real IT does not delete mailboxes by email decree. Escalating consequences + a convenient link is the classic pressure pattern.' },
          { id: 'link', label: 'Generic "click here" hyperlink', why: 'Display text and actual href differ — hover before clicking. Here the target is the attacker portal.' },
          { id: 'greeting', label: 'Generic greeting? NO — this one is personalized-ish "Dear User"', why: 'Hmm, actually: "Dear User" IS generic. But generic greetings alone are weak evidence — judged as a minor tell, not a red flag. (If you clicked it, no penalty applied.)', trap: true },
        ],
        traps: ['greeting'],
        questions: [
          { q: 'What is the attacker\'s primary objective?', opts: ['Destroy company data', 'Harvest credentials on a fake portal', 'Sell the email list', 'DDoS the mail server'], correct: 1,
            why: 'Everything funnels to the "validate your credentials" portal — a credential-harvest page. The deletion threat exists to motivate the click.' },
          { q: 'Best first response as the recipient?', opts: ['Forward it to coworkers as a warning', 'Report to security (phishing button) without clicking anything, delete nothing', 'Reply asking if it is real', 'Click the link but enter fake credentials'], correct: 1,
            why: 'Report, don\'t interact. Security can hunt for other recipients, block the domain, and warn — the original email is evidence.' },
          { q: 'Which control would have neutralized this campaign at the architecture layer?', opts: ['Email authentication (SPF/DKIM/DMARC) with quarantine + a lookalike-domain detector', 'Longer passwords', 'Disabling all email', 'Antivirus on laptops'], correct: 0,
            why: 'DMARC fails on the spoofed-ish lookalike and the lookalike-domain classifier flags micros0ft-secure before delivery — architectural controls beat user vigilance.' },
        ],
      },
      {
        from: 'Michael Chen <m.chen@vendor-billing.co.com>',
        subject: 'Updated banking details — Invoice #88213 payable today',
        date: 'Yesterday, 4:12 PM',
        to: 'accounts.payable@yourcompany.com',
        fromFlag: 'sender',
        bodyHtml: `<p>Hello,</p>
<p>This is Michael from vendor accounts. We have updated our banking information effective <span class="fl" data-flag="urgency">immediately</span>. Please process invoice #88213 (<span class="fl" data-flag="amount">$48,750.00</span>) to the <span class="fl" data-flag="content">new account below</span> by end of day.</p>
<div class="codeblock">Bank: offshore-meridian-trust.bz
Account: 8845 2210 9912
IBAN: BZ33 OSMB 8845 2210 9912</div>
<p>Please confirm once wired. <span class="fl" data-flag="content">Do not call our old number — it is being migrated today</span>.</p>
<p>Best regards,<br>Michael Chen<br>Vendor Accounts</p>`,
        flags: [
          { id: 'sender', label: 'Lookalike sender domain (.co.com impersonating .com)', why: 'vendor-billing.co.com vs the real vendor-billing.com — the .co.com suffix is a whole different registration. Always expand the full domain.' },
          { id: 'urgency', label: '"Effective immediately / end of day" pressure', why: 'Wire fraud runs on the clock. Payment-process changes in the real world take verified channels, not same-day deadlines.' },
          { id: 'content', label: '"Do not call our old number" — isolation play', why: 'Preempting verification is THE BEC tell. The attacker knows a callback defeats them, so they forbid it. Any message discouraging verification is an attack.' },
          { id: 'amount', label: 'Large precise amount with wire instruction', why: 'The payload: a real-time payment instruction to attacker-controlled details. In BEC the "attachment" is the money movement itself.' },
        ],
        traps: [],
        questions: [
          { q: 'This campaign class is best described as:', opts: ['Credential phishing', 'Business Email Compromise (BEC / invoice fraud)', 'Ransomware delivery', 'Whaling espionage'], correct: 1,
            why: 'No malware, no credentials — pure fraud via payment redirection. BEC causes billions in losses annually and lives entirely in trust manipulation.' },
          { q: 'The control that stops this even when the user is fooled:', opts: ['Spam filters', 'Out-of-band callback to a verified vendor contact + dual approval for bank-detail changes', 'Stronger passwords', 'Disabling HTML email'], correct: 1,
            why: 'Process controls: verify changes via a known-good channel and require two approvers. BEC defeats people; it cannot defeat a callback to a number from the vendor master file.' },
          { q: 'A register of vendor banking details verified annually is an example of:', opts: ['Detective control', 'Preventive administrative control', 'Corrective control', 'Deterrent control'], correct: 1,
            why: 'The verified register + change process prevents unauthorized redirection before payment. The callback itself is detective/preventive too — the register is the administrative foundation.' },
        ],
      },
      {
        from: 'DocuSign <dse-sign@docusign.net>',
        subject: 'Completed: Please review the unsigned document',
        date: 'Today, 9:02 AM',
        to: 'you@yourcompany.com',
        fromFlag: 'brand',
        bodyHtml: `<p><b>Document Ready for Review</b></p>
<p>You have a document awaiting your signature: <b>"Q4_Employee_Benefits_2026.pdf.exe"</b></p>
<div class="attach">📄 Q4_Employee_Benefits_2026.<span class="fl" data-flag="attach">pdf.exe</span> · 843 KB</div>
<p><span class="fl" data-flag="link">Review document →</span> (https://docusign.lorem-login.top/opensign?doc=8842)</p>
<p>DocuSign rarely sends attachments... but this one <span class="fl" data-flag="urgency">expires in 1 hour</span> and requires immediate action.</p>
<p>Thank you,<br>DocuSign Notary Team</p>`,
        flags: [
          { id: 'brand', label: 'Brand display name + real-looking sender (dse-sign@docusign.net)', why: 'The sneaky part: docusign.net is a REAL DocuSign sending domain, so the From row alone looks clean. DocuSign itself warns they rarely attach files — when the brand story and the payload disagree, trust the payload analysis, not the envelope.' },
          { id: 'attach', label: 'Double extension: .pdf.exe', why: 'The real payload. Windows hides known extensions by default, so victims see "document.pdf". A document never needs an .exe.' },
          { id: 'link', label: 'Lookalike link domain (lorem-login.top)', why: 'docusign.lorem-login.top is a subdomain of lorem-login.top — attackers rent docusign.* on any domain they own. The registered domain is what matters.' },
          { id: 'urgency', label: '"Expires in 1 hour" manufactured deadline', why: 'Same pressure pattern as every phishing kit. Real DocuSign envelopes sit in queues for days.' },
        ],
        questions: [
          { q: 'The .pdf.exe attachment most likely delivers:', opts: ['A corrupted PDF', 'Malware — loader/rat/ransomware via a masqueraded executable', 'A digitally signed contract', 'Nothing; it is a bluff'], correct: 1,
            why: 'Double extensions are malware masquerading 101. Opening it executes attacker code — endpoint EDR and attachment detonation/sandboxing are the technical backstops.' },
          { q: 'Why does impersonating a trusted SaaS brand work so well?', opts: ['Users hate DocuSign', 'Trust transfer: users expect documents from these brands and habituate to "Review document" flows', 'The emails are unblockable', 'Legal protection for attackers'], correct: 1,
            why: 'Brand impersonation exploits learned behavior. Architectural answer: allow-list known senders, detonate attachments, rewrite/inspect links — and train the hover reflex.' },
          { q: 'As SOC lead, which is the correct immediate action set?', opts: ['Delete the email everywhere and move on', 'Block sender/URL/attachment hash, hunt for other recipients, detonate sample in sandbox, raise awareness with a screenshotted warning', 'Reply to the sender', 'Wait for more reports first'], correct: 1,
            why: 'Contain (block indicators), hunt (who else got it), analyze (sandbox), immunize (awareness with a real example). Deleting the evidence everywhere destroys your hunting data.' },
        ],
      },
    ],
  },
  {
    id: 'owasp', num: '02', title: 'Web Attack Lab: OWASP Top 10', type: 'match',
    xp: 130, gate: 'm5', desc: 'Six vulnerable code snippets. Match each to its attack class, then check your mental patch.',
    intro: `Each snippet below ships in a real app somewhere. For each: select the vulnerability class, submit, and study the fix — the explanations are the actual lesson.`,
    items: [
      { code: `// GET /api/user?profileId=<input>\nconst q = "SELECT name, ssn FROM users WHERE id = '" + req.query.profileId + "'";\ndb.query(q, (e, rows) => res.json(rows));`, opts: ['SQL Injection', 'XSS', 'IDOR', 'SSRF'],
        correct: 0, fix: 'Parameterized: db.query("... WHERE id = ?", [req.query.profileId]) — and note it is ALSO an IDOR: any caller can pass any profileId. Both fixes needed.',
        why: 'String concatenation puts untrusted input into the SQL grammar itself. Parameterization separates code from data; authorization checks (is this MY profileId?) are a separate, mandatory control.' },
      { code: `// Comment section\nfunction renderComment(c) {\n  document.getElementById("wall").innerHTML += "<div>" + c.text + "</div>";\n}`, opts: ['Stored XSS', 'CSRF', 'Open Redirect', 'Path Traversal'],
        correct: 0, fix: 'textContent (not innerHTML), context-aware output encoding, plus a Content-Security-Policy as the safety net.',
        why: 'Attacker text becomes HTML. Stored = every viewer executes it — session theft, keyloggers, worm propagation. Encoding at output, per context, kills the class.' },
      { code: `// POST /api/avatar  (session of any logged-in user)\napp.post("/avatar", (req) => {\n  const p = "/var/www/uploads/" + req.body.filename;\n  fs.readFile(p, cb);  // serves the file back\n});`, opts: ['Path Traversal', 'XSS', 'Deserialization', 'Clickjacking'],
        correct: 0, fix: 'Reject client-supplied paths: generate the server-side name yourself (UUID), validate extension+content, serve via a handler that never re-derives paths.',
        why: 'filename=../../../etc/passwd escapes the uploads directory. Normalize (path.resolve) and reject anything escaping the base — or better, never let clients name server files.' },
      { code: `// Internal health-check feature\napp.get("/fetch", (req) => {\n  const url = req.query.url;\n  http.get(url, (r) => r.pipe(res));  // SSRF?\n});`, opts: ['SSRF', 'SQLi', 'XXE', 'Reflected XSS'],
        correct: 0, fix: 'Allowlist destinations/protocols; deny link-local metadata IPs (169.254.169.254), localhost, and internal ranges; run the fetcher in a network-isolated segment with no metadata route.',
        why: 'Attackers point the server at itself: cloud metadata credentials, internal admin panels, Redis. In cloud, SSRF-to-metadata is frequently instant privilege escalation.' },
      { code: `// Session restore\nconst sess = deserialize(req.cookies.token);\nloginAs(sess.user);`, opts: ['Insecure Deserialization', 'CSRF', 'IDOR', 'ReDoS'],
        correct: 0, fix: 'Sign-then-encrypt structured tokens (or use your framework\'s sessions); never deserialize untrusted native formats; verify before use.',
        why: 'Client-controlled serialized objects become code (gadget chains) or forged identities. The cookie IS the attacker\'s input — treating it as trusted state is the fatal flaw.' },
      { code: `<a href="/redirect?to=<user supplied URL>">\n// server: res.redirect(req.query.to);`, opts: ['Open Redirect', 'SSRF', 'XSS', 'Clickjacking'],
        correct: 0, fix: 'Allowlist of redirect targets or local-path-only redirects; if business needs external redirects, show an interstitial with the full destination.',
        why: 'Phishers abuse YOUR trusted domain: legit.com/redirect?to=evil.com survives link scanners and borrows your reputation. Allowlist destinations.' },
    ],
  },
  {
    id: 'threatmodel', num: '03', title: 'Threat Model a Login Flow', type: 'branch',
    xp: 130, gate: 'm2', desc: 'Live STRIDE session: model a password reset design choice-by-choice and watch your score react.',
    intro: `A web app's password reset flow needs design decisions. Answer as the architect — some choices are outright wrong, some are merely acceptable. Full pass scores 5/5; safe-but-partial answers score partial credit, exactly like a real design review.`,
    steps: [
      { step: 1, scenario: `The reset endpoint accepts POST /reset { email }. An attacker submits ANY email address. What must the response behavior be?`,
        choices: [
          { t: 'Always respond identically — "If that email exists, we sent a link" — and send real mail only to real addresses', pts: 1, cls: 'good', fb: 'Correct: response uniformity kills user enumeration. The side channel (response time, mail queue) should be uniform too.' },
          { t: 'Return "No such user" immediately so legitimate users get fast feedback', pts: 0, cls: 'bad', fb: 'That is an enumeration oracle: attackers harvest valid accounts for phishing and password-spraying. UX is adjusted with copy, not by leaking account existence.' },
          { t: 'Return "No such user" only for obviously fake domains, real check otherwise', pts: 0, cls: 'bad', fb: 'Any differential response is a usable oracle. Uniform, always.' },
        ] },
      { step: 2, scenario: `The reset token itself. Which design is correct?`,
        choices: [
          { t: 'Cryptographically random (CSPRNG, ≥128 bits), single-use, short TTL (15 min), stored hashed server-side, invalidated on use', pts: 1, cls: 'good', fb: 'All five properties matter: unpredictability, one-time use, expiry, hashed storage (a DB leak must not yield working tokens), and invalidation.' },
          { t: 'UUID v4 and expire in 24 hours for user convenience', pts: 0.5, cls: 'ok', fb: 'UUIDv4 randomness is fine, but 24h doubles the attack window and single-use/hashed-storage went unspecified. Safe-ish, sloppy.' },
          { t: 'Sequential token (user123, user124...) — simple to debug', pts: 0, cls: 'bad', fb: 'Guessable tokens = account takeover for free. Token entropy is the entire control.' },
        ] },
      { step: 3, scenario: `Threat modeling the flow, where does the highest-value trust boundary sit?`,
        choices: [
          { t: 'Between the email provider and the user\'s inbox — token-in-transit exposure and mailbox compromise dominate', pts: 1, cls: 'good', fb: 'Yes: the mailbox is usually the weakest link (IMAP without MFA, password reuse). This insight should push you toward passkeys/webauthn instead of email-based recovery.' },
          { t: 'Between the load balancer and app servers', pts: 0, cls: 'bad', fb: 'TLS covers that hop and it is inside your trust domain. The classic modeling error: drawing boundaries around infrastructure you own instead of around data you must protect.' },
          { t: 'Between the browser and the CSS files', pts: 0, cls: 'bad', fb: 'Not a security-relevant boundary for this flow.' },
        ] },
      { step: 4, scenario: `New requirement: "Let users skip email — answer 2 security questions instead." Your call?`,
        choices: [
          { t: 'Reject — answers are researchable/enumerable, non-rotating, and stored secrets; offer email+MFA or passkey recovery instead', pts: 1, cls: 'good', fb: 'Security questions are folklore, not factors: mothers\' maiden names are on social media. NIST 800-63B dropped them as memorized secrets. Offer verifiable recovery flows instead.' },
          { t: 'Approve but require 3 questions and encrypt answers at rest', pts: 0, cls: 'bad', fb: 'Encryption at rest does not fix enumerable answers. The control fails because the secret is public information, not because of storage.' },
          { t: 'Approve for low-risk accounts only', pts: 0.5, cls: 'ok', fb: 'Tiering reduces exposure but low-value accounts pivot (password reuse). Defensible as an interim step — as a destination it is weak.' },
        ] },
      { step: 5, scenario: `Final: which monitoring makes this flow observable enough to defend?`,
        choices: [
          { t: 'Alert on reset-request velocity per IP/actor, token-use failure spikes, and reset-after-breach patterns; log token request/use events (never the token)', pts: 1, cls: 'good', fb: 'This is detection engineering: the flow\'s abuse patterns become detections with thresholds. Logging the token itself would be a new vulnerability.' },
          { t: 'No monitoring needed; resets are user-initiated and harmless', pts: 0, cls: 'bad', fb: 'Password reset IS the account-takeover chokepoint — silent abuse is how ATO persists invisibly.' },
          { t: 'Log full reset URLs including tokens for support debugging', pts: 0, cls: 'bad', fb: 'Tokens in logs = permanent valid credentials in your log store. Log the event, never the secret.' },
        ] },
    ],
  },
  {
    id: 'idor', num: '04', title: 'IAM & Access-Control Lab', type: 'match',
    xp: 130, gate: 'm4', desc: 'Six access-control designs: spot the broken authorization pattern in each.',
    intro: `Authentication answers "who are you" — every bug below is about the OTHER question: "may you touch this?" Match each design to its failure class.`,
    items: [
      { code: `GET /api/invoices/9042  →  200 OK (any logged-in user)\nGET /api/invoices/9043  →  200 OK (any logged-in user)\n// no ownership check anywhere in the handler`, opts: ['IDOR / BOLA', 'Privilege escalation', 'CSRF', 'Session fixation'],
        correct: 0, fix: 'Object-level authorization on every request: does this SUBJECT own/may access THIS object? Centralize it (policy engine or framework guard) — per-endpoint memory fails.',
        why: 'The #1 API vulnerability (OWASP API Top 10, A1). Sequential IDs make enumeration trivial; the fix is per-object authorization, not UUID obfuscation (UUIDs leak via logs, referrers, and other users).' },
      { code: `if (user.role === "admin") { showAdmin(); }\n// admin functions ALSO verified client-side only:\n// the API route /api/admin/users has NO role check`, opts: ['Missing server-side function-level authorization', 'SQL injection', 'Reflected XSS', 'Open redirect'],
        correct: 0, fix: 'Authorize at every layer: route-level middleware asserting role claims server-side, defense in depth, tests that probe admin routes as plain user.',
        why: 'Hiding the UI is not access control. Any authenticated user who guesses /api/admin/users is admin. Function-level checks belong in the server, enforced by middleware, not in JavaScript.' },
      { code: `function promote(userId) {\n  if (params.role) user.role = params.role;  // mass assignment\n  save(user);\n}`, opts: ['Mass assignment → privilege escalation', 'Clickjacking', 'Directory traversal', 'ReDoS'],
        correct: 0, fix: 'Explicit field allowlists for every bind (strong parameters); role changes via separate admin-only, approval-tracked flows.',
        why: '"role" arrived in the request body and was bound straight onto the user object — a self-service promotion endpoint. Mass assignment has padded many bug-bounty reports.' },
      { code: `// Password reset verifies identity by:\n// 1) username  2) mother's maiden name (from public social media)\n// then allows setting a new password`, opts: ['Weak identity proofing / knowledge-based auth failure', 'Brute force', 'Session hijacking', 'Token replay'],
        correct: 0, fix: 'Knowledge-based "secrets" that are public are not factors. Use verified channels (email/phone possession), passkey re-auth, or step-up with possession factors.',
        why: 'KBA answers are researchable, non-revolvable, and shared across sites. This is exactly the help-desk/social-engineering path in the 2022 Uber compromise — proofing strength is an architectural property.' },
      { code: `// OAuth implementation\nif (req.query.state) { /* fine, whatever */ }\nconst token = exchangeCode(req.query.code);  // state never validated`, opts: ['CSRF → authorization code interception', 'XSS', 'Insecure deserialization', 'Clickjacking'],
        correct: 0, fix: 'state: random per-flow, bound to the session, verified on callback. PKCE for all public clients (and honestly for confidential ones too).',
        why: 'Unvalidated state = login CSRF and code injection: victims get bound to attacker accounts or leak codes. OAuth 2.1 simply requires PKCE — implementers who skip state/PKCE ship takeover flows.' },
      { code: `# S3 bucket policy\n{ "Effect": "Allow", "Principal": "*", "Action": "s3:*",\n  "Resource": "arn:aws:s3:::company-backups/*" }`, opts: ['Public exposure / over-permissive resource policy', 'Container escape', 'Log forging', 'Race condition'],
        correct: 0, fix: 'Least privilege: named principals, minimal actions (s3:GetObject for a specific prefix), conditions (aws:SecureTransport, IP constraints), and continuous public-access checks.',
        why: 'Principal "*" makes the backup bucket — your crown jewels — readable (and writable!) by the entire internet. This exact misconfiguration is behind a long line of real breaches.' },
    ],
  },
  {
    id: 'incident', num: '05', title: 'Ransomware Incident Commander', type: 'branch',
    xp: 140, gate: 'm7', desc: '3:12 AM. Ransom note on a finance share. Make the calls — scoring mirrors real IR trade-offs.',
    intro: `You are the incident commander. The clock and the budget are real; some decisions are wrong outright, some are defensible-but-costly. Full command scores 5/5.`,
    steps: [
      { step: 1, scenario: `MON 03:12 — A fileserver shows README_RESTORE.txt; 4,000 files renamed. EDR shows PsExec from FIN-ACC-07 using a domain admin account "svc_backup" at 03:04. FIRST action?`,
        choices: [
          { t: 'Isolate FIN-ACC-07 and the fileserver (network quarantine via EDR), preserve volatile evidence, open the IR bridge', pts: 1, cls: 'good', fb: 'Contain the known blast, keep memory for forensics, start the clock on coordination. Containment before eradication — always.' },
          { t: 'Power off every server immediately', pts: 0, cls: 'bad', fb: 'Bulk power-off destroys memory evidence and halts logging you will need for scope. Surgical isolation, not the killing blow.' },
          { t: 'Pay the ransom within the 48h discount window', pts: 0, cls: 'bad', fb: 'It is hour one and you know nothing of scope or exfiltration. Payment decisions belong to executives + counsel much later, informed by facts. Also: sanctions screening is legally mandatory first.' },
        ] },
      { step: 2, scenario: `MON 04:00 — svc_backup is in Domain Admins. The backup console (domain-joined!) shows its retention jobs were deleted yesterday. What does this tell you and what follows?`,
        choices: [
          { t: 'Initial access + persistence likely days old; adversary prepared the ground. Declare a major incident, engage IR retainers, assume backups compromised, start restoring from immutable/offline copies', pts: 1, cls: 'good', fb: 'Deleting retention = pre-staging. This is a mature intrusion, not opportunistic noise — scope accordingly and treat in-domain backups as attacker-reachable.' },
          { t: 'Just restore last night\'s backup to the same domain and resume', pts: 0, cls: 'bad', fb: 'You would re-encrypt: the intruder persists in identity and likely holds the backup console. Restoring into a compromised identity plane re-opens the blast radius.' },
          { t: 'Wait for the ransom note deadline to clarify intent', pts: 0, cls: 'bad', fb: 'The note is theater with a countdown; your architecture (module 8) already told you backups were reachable. Waiting burns the containment window.' },
        ] },
      { step: 3, scenario: `MON 09:00 — Legal flags: the finance share held regulated HR data; leak site listing is threatened. What enters the response NOW?`,
        choices: [
          { t: 'Counsel-led: regulatory clocks (72h-style) assessed, exfiltration evidence hunted (egress logs, staging patterns), disclosure decision tree prepared', pts: 1, cls: 'good', fb: 'Double-extortion makes it a data breach even if you restore perfectly. Notification duties hinge on exfiltration facts — evidence and counsel, in that order.' },
          { t: 'Public statement: "No data was accessed"', pts: 0, cls: 'bad', fb: 'You cannot assert that yet, and premature certainty becomes the story when listings appear. Statements follow evidence.' },
          { t: 'Ignore exfiltration; focus 100% on decryption', pts: 0, cls: 'bad', fb: 'Modern ransomware exfiltrates FIRST. Skipping the hunt means your regulator learns before you do.' },
        ] },
      { step: 4, scenario: `TUE — Eradication planning. Attack path: VPN (unpatched appliance) → svc_backup (no MFA) → domain admin → fileserver + backup console. Which eradication set is CORRECT?`,
        choices: [
          { t: 'Rebuild identity trust (reset all privileged credentials + KRBTGT twice, revoke sessions/tokens), rebuild affected hosts from known-good, patch/replace the VPN, MFA the backup plane', pts: 1, cls: 'good', fb: 'Textbook: identity-first eradication, clean rebuilds, close the entry vector, protect the backup plane. Anything less invites the return visit.' },
          { t: 'Run antivirus scans on all machines and delete the ransomware binaries', pts: 0, cls: 'bad', fb: 'Deleting binaries leaves credentials, tokens, scheduled tasks, and the unfixed VPN entry intact. Re-infection within weeks is the standard outcome.' },
          { t: 'Change the svc_backup password and monitor', pts: 0.5, cls: 'ok', fb: 'Necessary, wildly insufficient: domain admin compromise, persistence, and the open front door remain.' },
        ] },
      { step: 5, scenario: `POST-INCIDENT — blameless review. Which finding set is architectural (yours to own) rather than operational blame?`,
        choices: [
          { t: 'Backup plane shared the domain with no MFA and no immutable tier; VPN unpatched; detection relied on humans noticing renames', pts: 1, cls: 'good', fb: 'These are design defects (modules 4, 7, 8). The review\'s output: funded architectural fixes with owners and dates — not "users should click less."' },
          { t: 'The finance manager opened the phishing email that started it', pts: 0, cls: 'bad', fb: 'If your architecture depends on nobody ever clicking, the architecture is the defect. Phishing is a when; controls must assume it.' },
          { t: 'On-call took 20 minutes instead of 10 to respond', pts: 0.5, cls: 'ok', fb: 'Response speed matters, but it is a symptom of investment in tooling/automation, not a root cause. Note it; fix the architecture.' },
        ] },
    ],
  },
  {
    id: 'zerotrust', num: '06', title: 'Zero Trust Design Sprint', type: 'branch',
    xp: 140, gate: 'm3', desc: 'Migrate a 400-person company from flat network + VPN to zero trust, decision by decision.',
    intro: `The company: one flat office network, full-tunnel VPN, on-prem AD, lifting workloads to AWS. Design the zero-trust migration — sequencing and architecture both score.`,
    steps: [
      { step: 1, scenario: `First deliverable on the whiteboard?`,
        choices: [
          { t: 'Protect surface: crown-jewel apps + data flows (who/what accesses what, from where) — inventory before policy', pts: 1, cls: 'good', fb: 'ZT starts with the protect surface (the inverse of attack surface). You cannot write per-app policy for apps you cannot enumerate.' },
          { t: 'Buy a ZTNA broker and deploy it company-wide Friday', pts: 0, cls: 'bad', fb: 'Product-first ZT fails: enforcement without decisions (PDP) and without inventory is a VPN with different branding.' },
          { t: 'Microsegment every subnet immediately', pts: 0.5, cls: 'ok', fb: 'A worthy destination — attempted before inventory, it breaks production and gets rolled back by Monday. Sequence matters.' },
        ] },
      { step: 2, scenario: `Pilot target: the finance reporting app (10 users, highest-value data). Access policy should evaluate:`,
        choices: [
          { t: 'Identity (federated, phishing-resistant MFA) + device posture (managed, patched, EDR healthy) + session risk score, re-evaluated continuously', pts: 1, cls: 'good', fb: 'That is the 800-207 trust algorithm: subject + device + behavioral/conditional signals per request, continuously. Authenticated-once-then-everything is legacy thinking.' },
          { t: 'Username + password (they are finance, they are careful)', pts: 0, cls: 'bad', fb: 'Credentials leak; "careful" is not a control. The pilot exists to prove context-based access works.' },
          { t: 'IP allowlist of the office', pts: 0, cls: 'bad', fb: 'Location is the weakest signal and office-IP trust is exactly the implicit trust ZT removes.' },
        ] },
      { step: 3, scenario: `Legacy problem: an on-prem fileserver speaks SMB and cannot join the identity-based access fabric. Migration answer?`,
        choices: [
          { t: 'Enclave it: put the fileserver in its own segment behind an enforcing gateway (PEP) that requires identity+posture to reach SMB', pts: 1, cls: 'good', fb: 'Legacy systems are enclaved behind policy enforcement points — classic 800-207. ZT is not rip-and-replace; it is fencing what cannot be modernized.' },
          { t: 'Leave it on the flat network; nobody hacks fileshares', pts: 0, cls: 'bad', fb: 'SMB lateral movement is the oldest trick in intrusions (and the ransomware standard). The exception becomes the breach path.' },
          { t: 'Replace it this quarter before any ZT work continues', pts: 0.5, cls: 'ok', fb: 'Eventually correct, but blocking the whole program on a hardware refresh is how ZT programs die. Enclave now, migrate on roadmap.' },
        ] },
      { step: 4, scenario: `VPN retirement policy — what is the right end state?`,
        choices: [
          { t: 'Per-app ZTNA for humans; network-level access only as exception (break-glass, tightly scoped, MFA + session recorded)', pts: 1, cls: 'good', fb: 'ZTNA covers the 95%; the residual network-level need becomes a monitored, scoped exception — not the default path.' },
          { t: 'Keep VPN as primary, add a second password', pts: 0, cls: 'bad', fb: 'Network-level trust + one more password is still implicit trust architecture.' },
          { t: 'Full-tunnel VPN but with hardware tokens', pts: 0.5, cls: 'ok', fb: 'Better auth, same broken model: once on, everything reachable. The scope of trust is the flaw, not the factor.' },
        ] },
      { step: 5, scenario: `Six months in: how do you PROVE the program works (board asks)?`,
        choices: [
          { t: 'Validated metrics: % access decisions with full context, coverage heat-map vs ATT&CK, lateral-movement tests blocked in purple-team runs, VPN exceptions count trending to zero', pts: 1, cls: 'good', fb: 'Module 10 in action: outcome metrics + adversarial validation. "We bought ZTNA" is not evidence; blocked lateral movement is.' },
          { t: 'Show the vendor invoice', pts: 0, cls: 'bad', fb: 'Purchase is intent, not outcome.' },
          { t: 'Report zero incidents', pts: 0, cls: 'bad', fb: 'Absence of incidents is not evidence of control — it may be absence of detection. Measure coverage and validated resistance.' },
        ] },
    ],
  },
];
