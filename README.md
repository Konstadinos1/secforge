# SecForge — Security Architect Academy

**▶ Live app: https://konstadinos1.github.io/secforge/**

A free, offline-capable training ground for aspiring **Security Architects**: 12 theory modules, 13 hands-on labs (phishing forensics, ransomware incident command, zero-trust sprint, AI prompt-injection defense, capstone triage…), the **Phish Rush** arcade, a full cybersecurity career map, XP/levels/badges, and daily streaks.

No backend. No accounts. No tracking. Progress lives in your browser (export it from Settings as JSON). Install it as a PWA from the live URL and everything works offline.

## Run locally

Open `index.html` directly, or serve the folder:

```bash
python -m http.server 8765
# → http://127.0.0.1:8765
```

`run.bat` (Windows) does both in one double-click.

## Structure

```
index.html          app shell
styles.css          design system (dark cyber-terminal)
js/data-*.js        curriculum, labs, arcade corpus, career map (pure data)
js/engine.js        state, XP/levels/badges, router
js/app.js           views + interactive lab engines
sw.js               service worker (network-first, offline fallback)
tests/              data integrity checks (node tests/data-check via vm)
metaprompts/        prompts that regenerate/extend this app with AI
```

## Extend it

All content is plain JS data — add a module, a lab, or arcade emails without touching the engine. The `metaprompts/` folder contains prompts that rebuild or extend the app with Claude, Gemini, or ChatGPT.

## Ethics

Defensive education only. Skills are for protecting systems you are authorized to protect.

## License

MIT
