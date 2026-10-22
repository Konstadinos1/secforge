/* SecForge — modules 5 & 6: Application/Data Security & Cloud Architecture */
'use strict';

const M5 = {
  id: 'm5', num: '05', title: 'Application & Data Security', sub: 'Secure SDLC, the vulnerability hall of fame, encryption that actually helps.',
  mins: 30,
  lessons: [
    {
      id: 'l1', title: 'Secure SDLC & devsecops', mins: 7,
      body: `<p>Security bolts-on badly. Build it into the pipeline:</p>
<ul>
<li><strong>Design:</strong> threat models (module 2) + security review gates for high-risk changes.</li>
<li><strong>Code:</strong> secure coding standards, peer review, secrets scanning pre-commit.</li>
<li><strong>Build/CI:</strong> SAST (code patterns), SCA (dependency CVEs), container/IaC scanning; gate merges on severity thresholds, not on "no findings ever."</li>
<li><strong>Test:</strong> DAST against running apps, security unit tests for authz logic, fuzzing for parsers.</li>
<li><strong>Deploy/Run:</strong> signed artifacts, attestation (SLSA levels), runtime protection (WAF, RASP-as-appropriate), continuous monitoring.</li>
</ul>
<p>The architect's job is choosing gates: every control adds latency to delivery. Put hard gates where risk is existential (auth, payments, secrets) and advisory signals elsewhere.</p>`,
      callout: `<b>OWASP Top 10</b> is a category map, not a checklist. Your own top 10 comes from your own bug bounty + pentest + SAST data.`,
      terms: [['SAST / DAST', 'Static / Dynamic application security testing'], ['SCA', 'Software Composition Analysis — dependency risk'], ['SLSA', 'Supply-chain Levels for Software Artifacts (1-3)'], ['SBOM', 'Software Bill of Materials — the ingredient list']],
    },
    {
      id: 'l2', title: 'The hall of fame: injection, XSS, deserialization', mins: 8,
      body: `<p>The classics never die, they just change syntax:</p>
<ul>
<li><strong>Injection (SQLi, command, LDAP...):</strong> untrusted data becomes code. Fix is structural: parameterized queries / prepared statements, ORMs, never string-concatenated commands. WAFs are a speed bump, not the fix.</li>
<li><strong>XSS:</strong> attacker script runs in a victim's browser. Fix: context-aware output encoding, templating with auto-escaping, CSP as defense in depth, HttpOnly cookies to blunt session theft.</li>
<li><strong>Insecure deserialization:</strong> untrusted serialized objects become executing code (Java gadgets, Python pickle). Fix: never deserialize untrusted native formats; use JSON with schema validation.</li>
<li><strong>SSRF:</strong> server is tricked into fetching attacker-chosen URLs — the cloud killer (metadata endpoints, 169.254.169.254). Fix: allowlists for outbound fetches, IMDSv2-style protections, network policy.</li>
<li><strong>Path traversal & file upload:</strong> normalize/allowlist paths; validate content, store outside webroot, randomize names.</li>
</ul>`,
      callout: `<b>Pattern to internalize:</b> every one of these is "data crosses a trust boundary and is interpreted as instructions." Validate/encode at the boundary — the same rule as module 2's DFDs.`,
      terms: [['CSP', 'Content Security Policy — browser-side blast-radius control'], ['SSRF', 'Server-Side Request Forgery'], ['Gadget Chain', 'Sequence of library calls turned into an exploit via deserialization'], ['Parameterization', 'Separating code from data at the SQL/command interface']],
    },
    {
      id: 'l3', title: 'Cryptography for architects', mins: 8,
      body: `<p>You will never invent crypto — you must <em>deploy</em> it correctly. The working knowledge:</p>
<ul>
<li><strong>In transit:</strong> TLS 1.2+ (prefer 1.3), modern cipher suites, HSTS, certificate automation. Internal traffic too (mTLS in service meshes).</li>
<li><strong>At rest:</strong> AES-256-GCM; full-disk for loss, <em>field/application-level</em> encryption for breach containment. Envelope encryption via KMS.</li>
<li><strong>Key hierarchy:</strong> root keys in HSM → key-encryption keys → data keys. Rotation, separation of duties, documented recovery (else you've built an availability incident with extra steps).</li>
<li><strong>Hashing:</strong> passwords get slow, salted, memory-hard functions (Argon2id, bcrypt, scrypt) — never SHA for passwords. Integrity gets SHA-256+; signatures use Ed25519/ECDSA/RSA.</li>
<li><strong>Randomness:</strong> CSPRNG only. Math.random has killed real products.</li>
<li><strong>Tokenization/pseudonymization:</strong> replace sensitive values with surrogates so most systems never touch the real data.</li>
</ul>`,
      callout: `<b>Architect's crypto checklist:</b> What's protected? From whom? Where are the keys, who can use them, how do they rotate, and what happens on recovery? If any answer is "I assume," it's a finding.`,
      terms: [['Envelope Encryption', 'Data keys encrypt data; KEKs encrypt data keys'], ['Argon2id', 'Current default password-hashing function'], ['mTLS', 'Mutual TLS — both sides authenticate with certificates'], ['CSPRNG', 'Cryptographically Secure Pseudo-Random Number Generator']],
    },
  ],
  quiz: {
    pass: 0.7, xp: 150,
    questions: [
      { q: 'A legacy service builds SQL as: "SELECT * FROM users WHERE name = \'" + input + "\'". The correct structural fix is:', opts: ['Escape single quotes in input', 'A parameterized query / prepared statement', 'A WAF rule blocking quotes', 'Base64-encode the input'], correct: 1,
        why: 'Parameterization separates code from data at the protocol level — escaping and WAF rules are bypassable second lines. This is the structural fix, not a filter.' },
      { q: 'Which password storage is architecturally acceptable?', opts: ['SHA-256 with a salt', 'AES-256 encryption', 'Argon2id with per-user salt', 'MD5 fast hash'], correct: 2,
        why: 'Password storage needs deliberately slow, memory-hard hashing (Argon2id/bcrypt/scrypt). SHA/MD5 are fast (GPU-friendly); encryption is reversible with the key.' },
      { q: 'SSRF is especially catastrophic in cloud environments because:', opts: ['It consumes bandwidth', 'The instance metadata service can hand over credentials from a forged request', 'It breaks TLS', 'It triggers autoscaling costs'], correct: 1,
        why: '169.254.169.254 returns instance credentials to anyone on the host — SSRF there becomes instant privilege escalation (IMDSv2 and metadata network policy are the mitigations).' },
      { q: 'In envelope encryption, the role of the Key Encryption Key is to:', opts: ['Encrypt the bulk data directly', 'Encrypt/wrap the data keys, which encrypt the bulk data', 'Sign all transactions', 'Generate TLS certificates'], correct: 1,
        why: 'Hierarchy: KEK (in KMS/HSM, rarely used, tightly controlled) wraps many data keys — enabling rotation and access control without re-encrypting everything.' },
    ],
  },
};

const M6 = {
  id: 'm6', num: '06', title: 'Cloud & Infrastructure Security', sub: 'Shared responsibility, IaC guardrails, containers, and Kubernetes.',
  mins: 32,
  lessons: [
    {
      id: 'l1', title: 'Shared responsibility & landing zones', mins: 8,
      body: `<p>The cloud division of labor: provider secures the cloud (hardware, hypervisor, managed-service internals); you secure <strong>what you put in it</strong> — and critically, the split slides by service type. In SaaS you configure the product; in IaaS you harden the OS. Most cloud breaches are customer-side misconfigurations: public storage buckets, over-permissive IAM, disabled logging.</p>
<p>An architect's first cloud move is a <strong>landing zone</strong>: account/subscription topology (prod vs non-prod, per-BU), org policies/SCPs and Azure Policy denying dangerous defaults, centralized networking (hub-spoke, private endpoints), centralized identity federation, org-wide logging and billing guards, and golden modules so the secure path is also the fastest path.</p>`,
      callout: `<b>Tell:</b> if creating an account means a blank console, your landing zone doesn't exist — every team is inventing (and misconfiguring) its own architecture.`,
      terms: [['SCP', 'Service Control Policy — org-level guardrails in AWS'], ['Landing Zone', 'Pre-built secure multi-account foundation'], ['Hub-Spoke', 'Centralized network transit with isolated spokes'], ['Private Endpoint', 'PaaS services reachable only via private IPs']],
    },
    {
      id: 'l2', title: 'Infrastructure as Code & policy as code', mins: 8,
      body: `<p>IaC (Terraform, CloudFormation, Bicep, Pulumi) turns infrastructure into reviewable, versioned, testable code — the only way security scales:</p>
<ul>
<li><strong>Golden modules:</strong> pre-approved building blocks (encrypted bucket + logging + tags) so teams inherit controls by default.</li>
<li><strong>Static scanning in CI:</strong> Checkov/tfsec/Semgrep before apply; drift detection after.</li>
<li><strong>Policy as code gatekeeper:</strong> OPA/Sentinel/Kyverno enforce org rules at plan/apply/admission — "no public buckets" becomes code, not a memo.</li>
<li><strong>Immutable infrastructure:</strong> never patch pets; rebuild from images (golden AMIs, signed) — configuration drift and untracked snowflakes are where incidents live.</li>
<li><strong>Blast-radius design:</strong> separate state files and accounts per environment; least-privilege pipeline identities; state files themselves are secrets (they contain them).</li>
</ul>`,
      callout: `<b>Culture move:</b> when a team violates a cloud rule, ship them a golden module that makes the compliant way easier than the violation. Guardrails beat gates.`,
      terms: [['Drift', 'Reality diverging from declared IaC'], ['Admission Control', 'Policy enforcement at K8s API / registry deploy time'], ['Snowflake Server', 'Hand-built, unreproducible, haunted machine'], ['Signed Artifacts', 'Cryptographic provenance for images and releases']],
    },
    {
      id: 'l3', title: 'Containers & Kubernetes security', mins: 8,
      body: `<p>Containers share the host kernel — isolation is thinner than VMs, so configuration discipline carries the weight:</p>
<ul>
<li><strong>Images:</strong> minimal bases (distroless, alpine), scan in CI, sign (cosign), pin digests, run as non-root with read-only filesystems and dropped capabilities.</li>
<li><strong>Orchestration (K8s):</strong> RBAC least privilege, NetworkPolicies default-deny east-west, Pod Security Admission (restricted profile), secret management via vault/KMS integration (base64 etcd secrets are not encryption), admission policies (Kyverno/OPA Gatekeeper).</li>
<li><strong>Runtime:</strong> seccomp/AppArmor profiles, runtime detection (Falco-style), gVisor/Kata sandboxes for truly hostile multi-tenancy.</li>
<li><strong>Supply chain:</strong> your base image is someone else's dependency tree — pin, verify, rebuild on CVEs; the 2024 xz backdoor is the case study for why provenance matters.</li>
</ul>`,
      callout: `<b>K8s quick wins ranking:</b> (1) default-deny NetworkPolicies, (2) forbid privileged containers & hostPath, (3) external secret management, (4) non-root images. These four kill most real container attack paths.`,
      terms: [['Distroless', 'Image with only the runtime — no shell, no package manager'], ['Pod Security Admission', 'K8s built-in pod hardening profiles'], ['CRI', 'Container Runtime Interface (containerd, CRI-O)'], ['Sidecar', 'Helper container extending a pod (proxy, logger)']],
    },
  ],
  quiz: {
    pass: 0.7, xp: 150,
    questions: [
      { q: 'A team runs a managed database service. Who patches the database engine software?', opts: ['The customer, via configuration', 'The cloud provider — but the customer owns configuration, encryption, and network exposure', 'Nobody needs to', 'Shared: customer patches, provider configures'], correct: 1,
        why: 'Managed (PaaS) services: provider patches the engine; customer owns configuration, IAM, network exposure, and data protection. Misreading this split is the root of most cloud findings.' },
      { q: 'The most effective way to stop teams from creating public storage buckets org-wide is:', opts: ['Monthly email reminders', 'Org-level policy-as-code that denies public access at deployment, plus scanning for drift', 'Auditing buckets quarterly', 'Training about bucket security'], correct: 1,
        why: 'Preventive guardrails enforced by the platform (SCP/Azure Policy/OPA) beat detective audits and education — the violation becomes impossible, not just visible.' },
      { q: 'Why are Kubernetes NetworkPolicies a higher-priority control than network segmentation in VM environments often?', opts: ['They are cheaper', 'By default all pods can reach all pods — east-west is wide open until policy says otherwise', 'They encrypt traffic', 'They replace image scanning'], correct: 1,
        why: 'K8s defaults to flat allow-all pod networking; a compromised pod can traverse the cluster freely until default-deny policies segment it.' },
      { q: 'Immutable infrastructure changes the patching model to:', opts: ['SSH in and patch running servers', 'Rebuild and redeploy from patched, signed images; replace, never modify in place', 'Disable auto-updates for stability', 'Patch only during incidents'], correct: 1,
        why: 'Pets get patched by hand (and drift); cattle get replaced from a rebuilt image. Drift and configuration debt disappear as a category.' },
    ],
  },
};
