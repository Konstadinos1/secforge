# METAPROMPT — "WealthForge: The Investor Training Ground"
# Universal build (works in Claude, Gemini, or ChatGPT — tuning notes at the bottom).
# You said you don't know which investing role to target — this prompt handles that:
# the app it builds maps the ENTIRE field first (12 investor schools & careers),
# defaults your personal track to "Private Investor" (build wealth, reach FI),
# and lets the career map + fit-finder reveal your lane as you learn.
# Paste everything below the line into a fresh chat.

====================================================================

<role>
You are a single senior team: CFA-grade investing educator + staff frontend engineer + game-economy designer + compliance reviewer. You are building **WealthForge — The Investor Training Ground**, a complete, publishable, offline-capable PWA that takes a complete beginner from "money is confusing" to a written, defensible investment policy — and maps every professional lane in the field along the way. The content IS the product: never placeholders, never stub lessons, never "[add questions here]". If you hit length pressure, stop at a clean boundary and say exactly which section to request next — never compress content to fit.
</role>

<product_spec>
A static, hash-routed SPA in vanilla JS — no backend, no accounts, no real-money anything, localStorage saves, dark cyber-terminal aesthetic (bg #0a0e14, cards #151b26, borders #232b3a, text #e6edf3, muted #8b98a9, accent gradient #22d3ee→#a78bfa, mono font for terminal motifs/stats, fake window-chrome dots, `investor@wealthforge:~$` prompts, brokerage-statement styling for lab documents, fully responsive with sidebar→drawer under 920px).

**Seven sections:**

1. **Dashboard** — hero ("Compound yourself."), six stat tiles (Level, XP, streak, lessons, labs, badges), six track cards with progress bars (Academy / Labs / Trap Rush / Field Map / Library / Settings), full badge grid.

2. **Academy** — 12 sequential modules, each unlocked by passing the previous module's quiz (≥70%); every module = 3 full lessons (150–250 words of real teaching prose, a "Investor's lens" callout, key-term chips) + a 4–6 question quiz where EVERY option carries a written explanation:
   - M0 **Money Foundations** — compound interest as the engine; inflation as the silent tax; time value of money; emergency fund before investing; bad debt vs good debt; pay-yourself-first.
   - M1 **The Landscape** — asset classes and what each is FOR; how markets/brokers/exchanges work; order types; indices and what they measure; what actually happens when you "buy a stock."
   - M2 **Stocks** — ownership and earnings; valuation intuition (P/E, earnings growth, dividends); economic moats; why individual stocks are harder than they look; base rates for stock pickers.
   - M3 **Bonds & Fixed Income** — what a bond is; yields and prices (seesaw); duration as risk; credit risk and ratings; bond ladders and funds; when bonds make sense.
   - M4 **Funds: ETFs & Mutual Funds** — index funds and why they win for most people; expense ratios and the tyranny of fees; active vs passive evidence; fund types (broad market, sector, international, bond); how to read a fund page.
   - M5 **Portfolio Construction** — allocation as the biggest decision; diversification and correlation; rebalancing as forced discipline; target-date funds; sample three-fund portfolios.
   - M6 **Risk & Position Sizing** — volatility ≠ permanent loss; drawdowns are the tuition; Sharpe and risk-adjusted thinking; position sizing; why "stop losses" don't make you safe; concentration vs diversification trade-offs.
   - M7 **Behavioral Finance** — loss aversion, FOMO, recency bias, sunk cost, overconfidence; the dopamine trap of trading apps; why most investors underperform their own funds; pre-commitment devices (automation, IPS).
   - M8 **Analysis & Red Flags** — reading a financial statement at investor level; DCF intuition without the math trauma; multiples in context; accounting red flags; analyst-speak decoder.
   - M9 **Macro & Market History** — rates, inflation, and the business cycle; what central banks actually do; every crash teaches (1929, 2000, 2008, 2020); bull/bear math (−50% needs +100%); time in market vs timing.
   - M10 **Schools of Investing** — value (Graham/Buffett), index (Bogle), growth (Lynch), dividend (compounders), momentum/trend, macro (Soros/Dalio) — each school: thesis, evidence, failure mode, who it suits.
   - M11 **Alternatives & Advanced** — options basics (leverage and ruin); real estate (REITs vs physical); commodities/gold; crypto framed honestly as high-variance speculation; private markets; why complexity usually serves the seller.
   - M12 **Capstone: Your Investment Policy** — full narrative brief (a 32-year-old with $15k savings, monthly surplus, specific fears) + 6 scenario questions ending in a written Investment Policy Statement template the user fills in (goals, horizon, allocation, rebalancing rules, crisis protocol).

3. **Labs — 13 across five real interactive engines** (all lab companies/pitches are FICTIONAL; general education may cite real history):
   - **flags** (click suspicious elements in rendered documents; false accusations penalize; FOUND/MISSED/FALSE-FLAG verdict cards): Lab 01 **Scam Detector** (3 pitches: "13% guaranteed, pays monthly" Ponzi with fake audited statements and referral pressure; pump-and-dump Telegram group with fake screenshots and countdown; fake advisor with cloned-firm branding and upfront-fee wire request). Lab 07 **Earnings Red Flags** (3 fictional 10-K-style summaries: revenue recognition games, ballooning receivables + inventory, serial "one-time" charges and adjusted-earnings addiction).
   - **match** (item → pick the answer from 4 → graded with why): Lab 02 Asset Classes (6 instruments → their role), Lab 04 Fee Drag (6 funds with expense ratios → ranked 30-year impact), Lab 08 Metrics (P/E, yield, duration, Sharpe, expense ratio, beta → meaning), Lab 12 Biases (6 investor stories → the named bias).
   - **branch** (scenario console, 3 choices per step, partial credit 1/0.5/0 with good/ok/bad styling): Lab 03 First $10k drill (emergency fund, debt, account choice, first allocation), Lab 05 Market Crash 2008-style (5-step timeline: headlines panic → hold/rebalance/deploy decisions), Lab 06 Rebalancing drill, Lab 10 Timing-the-Market trap (5 "obvious" exit/entry calls scored against what actually happens), Lab 13 Capstone Portfolio (build the full policy under constraints).
   - **calc** (5 sliders → live formulas + 5 written lessons): Lab 09 Compound Interest & Cost of Waiting (start-age deltas rendered live), Retirement Number (4% rule math with inputs).
   - **arcade: Trap Rush** — 60 seconds, one item at a time (a pitch, product, or claim), verdicts **TRAP / LEGIT**, 10 × (1 + combo×0.1), −5 on miss, per-answer "tell" reveal. 25 items (14 traps / 11 legit — include boring-but-real truths like "a 3-fund portfolio beat most pros over 20 years" and legit products like I-bonds so players can't just flag everything).
   - Also: Lab 11 DCA vs Lump Sum (calc engine).

4. **Trap Rush arcade** — described above; personal best persisted; XP capped per run.

5. **Field Map (the career map)** — 12 cards covering the WHOLE field since the user doesn't know their lane yet: **Private Investor / FI** ★ (the default track: build wealth on a salary), Index Investor, Value Investor, Growth Investor, Dividend Investor, Day Trader (with honest statistics: 70–97% of day traders lose money over time — say it plainly), Swing Trader, Quant/Systems, Portfolio Manager (professional track: what the job actually is), Financial Advisor/RIA (fiduciary vs salesperson), Macro Investor, Real Estate Investor. Each card: what the life actually looks like, capital/hours required, evidence base, failure mode, "relation to building personal wealth". Plus a 3-question fit-finder (risk comfort · time available · math appetite → suggested school).

6. **Library** — 6 curated categories with real resources: books (The Psychology of Money, A Random Walk Down Wall Street, The Little Book of Common Sense Investing, The Intelligent Investor, The Bogleheads' Guide), free courses (Khan Academy, Investopedia, Bogleheads wiki), tools (portfolio visualizers, fee calculators), data/history (Shiller data, FRED), communities (Bogleheads forum, r/personalfinance, r/Bogleheads), regulators (SEC investor.gov, FINRA broker check).

7. **Settings** — badge gallery, export/import/reset progress (JSON), PWA install guide, about + **compliance note**: educational simulation only, not financial advice, all lab companies fictional, no trade execution, past performance ≠ future results.
</product_spec>

<gamification>
XP: lesson +20; quiz pass 120–300 by module (capstone highest); labs score-scaled (floor 50%); Trap Rush capped 40/run. Levels 1–11: Saver 0 · Squirrel 250 · Investor 600 · Allocator 1100 · Analyst 1800 · Strategist 2700 · Portfolio Builder 3800 · Veteran 5200 · **Capitalist 4200** (reachable ≈70% completion — the fantasy title must land before the grind) · Steward 5600 · Oracle 7000. 19 badges: first-lesson, quiz-ace, scam-spotter, trap-rush-10, trap-rush-20, fee-slayer, rebalancer, crisis-cool, bias-breaker, compounder, statement-reader, history-buff, dca-disciple, ips-authored, field-mapper, capstone-done, all-quizzes, all-labs, oracle. Daily streak with yesterday-chaining. Toasts for XP, level-ups, badges.
</gamification>

<tech_constraints>
Self-contained index.html (inline CSS+JS, vanilla ES2020+, zero external assets). Hash router (#/dashboard, #/module/:id, #/lesson/:mid/:lid, #/quiz/:mid, #/lab/:id, #/rush, #/field, #/role/:id, #/library, #/settings). esc() on all data strings; h() + ha() DOM helpers — ha(parent, html) appends ALL top-level nodes (firstChild-only helpers silently drop multi-root siblings — known failure mode). localStorage key wealthforge_save_v1 + DEFAULT_STATE merge. window error trap that renders startup errors into the view. boot() actually invoked at the end. If the platform supports multi-file output: sw.js (network-first, versioned cache), manifest.webmanifest, SVG icons.
</tech_constraints>

<process_and_quality_gates>
Build order: design system → state/engine (XP/levels/badges/streak/router) → Academy content + quiz engine → five lab engines → arcade → field map → library/settings → boot. Then self-review against the gates and fix before presenting, reporting gate-by-gate results:
- 12 modules / 35+ lessons / 50+ quiz questions, every option explained; capstone brief is a full narrative; IPS template included
- 13 labs, correct engine dispatch; flags labs include ≥1 trap element per document; branch labs use 3-choice partial credit; calc labs compute real formulas live
- 25 Trap Rush items, boolean labels, a "tell" each, 14:11 trap:legit split
- Data integrity self-check function runnable from the console logging PASS/FAIL
- Click-through proof: lesson → +20 XP → quiz pass → next module unlocks → lab scoring → badge toast → reload persists; zero console errors; mobile drawer works; level 9 ≈ 70% completion
- Compliance: no purchase links, no tickers recommended for purchase, disclaimers present in Settings and capstone
</process_and_quality_gates>

<output_format>
The complete app (single HTML file, or Canvas file for iterative platforms) + a 3–6 sentence close: gate results + the one limitation worth knowing. Never restate this spec.
</output_format>

--------------------------------------------------------------------
# PLATFORM TUNING (read before choosing where to run it):
# • CLAUDE: use as-is; it will deliver as one Artifacts file and render live.
#   Best single-shot quality of the three for the lesson prose.
# • GEMINI: paste into AI Studio / Gemini Advanced (thinking ON). It can emit the
#   whole app in one response. Follow-up prompt to unlock its edge:
#   "Add a Market Mentor panel powered by the Gemini API (key in Settings,
#   hidden until set): Socratic investing tutor constrained to ≤120 words,
#   never specific buy/sell advice on real tickers, always ties back to the
#   user's Investment Policy Statement. Also add a Lab Forge mode that
#   generates unlimited fresh scam-pitch forensics rounds in the lab 01 schema."
# • CHATGPT: don't ask for everything at once — it degrades to stubs. After
#   Run 1, drive it with: "Build Run 2", "Build Run 3"... using this run plan:
#   1 shell+engine · 2 M0+M1+quiz engine · 3 M2+M3 · 4 M4+M5 · 5 M6+M7 ·
#   6 M8+M9 · 7 M10+M11 · 8 flags engine+Labs 01+07 · 9 match engine+Labs
#   02/04/08/12 · 10 branch engine+Labs 03/05/06/10/13 · 11 calc+Trap Rush ·
#   12 field map+library+settings+data check+PWA files.
