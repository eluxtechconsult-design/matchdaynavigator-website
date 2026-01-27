
MATCHDAY NAVIGATOR — WORLD CUP 2026 (DARK BEST-IN-CLASS)
-------------------------------------------------------
Render settings (confirmed):
- Publish Directory: public
- Build Command: (empty)

Deploy steps:
1) Copy all files from this ZIP into your GitHub repo under /public/
   Specifically:
     /public/worldcup-2026/index.html
     /public/worldcup-2026/app.js
     /public/worldcup-2026/app.css
     /public/worldcup-2026/ui.css
     /public/worldcup-2026/clusters.css
     /public/assets/data/cities.json
     /public/assets/data/stadiums.json

2) Commit & push → Render auto-deploys.
3) Open https://www.matchdaynavigator.com/worldcup-2026/

Notes:
- SPA routing uses query params (?city=..., ?stadium=...). No extra pages required.
- If CSP blocks CDNs, ask for the "local vendors" variant and I will add vendor files under /public/assets/vendor/ and switch tags in index.html.
