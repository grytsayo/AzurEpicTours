# Azure Epic Tours — Frontend Site

## Purpose
Static marketing site for azurepictours.com.
Stack: plain HTML + CSS + JS, no build step.
Production: Netlify.
This repo is frontend only. Backend booking logic lives in a separate repo.

## Project paths and URLs
- Local: `D:\Azurepictrips\WEB developement\Project Claude`
- GitHub: `github.com/grytsayo/AzurEpicTours`
- Production: `https://azurepictours.com`
- Deploy: Netlify auto-publishes from `main`

## Related backend
- Backend repo: `github.com/grytsayo/azure-epic-tours-api`
- Local backend path: `D:\Azurepictrips\WEB developement\tour-api`
- Booking endpoint: `https://azure-epic-tours.vercel.app/api/book`
- Do not implement backend logic changes in this repo

## Before any edit
Run:
```bash
cd "D:\Azurepictrips\WEB developement\Project Claude"
git fetch origin
git status
git log --oneline -5
```

If remote has new commits, run `git pull` before editing.

## Deployment rules
- Deploy ONLY through `git push origin main`
- Never use `netlify deploy --prod`
- Never use drag-and-drop deploy in Netlify Dashboard
- Production must always match git history

## Why this rule exists
A rogue Netlify deploy created a 4-month drift between git and production.
Recovery required restoring production state into git in commit `50dc135`.
Do not repeat this.

## Core production files
- `index.html`
- `monaco-majesty.html`
- `monaco-coastline.html`
- `grand-riviera-tour.html`
- `monaco-by-night.html`
- `privacy-policy.html`
- `tour-template.html`
- `styles.css`
- `js/booking-modal.js`
- `images/`
- `sitemap.xml`
- `robots.txt`
- `site.webmanifest`

Treat these as production-critical.

## Tour page architecture
Each tour page is a separate HTML file.
Booking modal logic is mirrored across the 4 tour pages.
The main difference is `BK_TOUR_ID`.
Language dictionaries (`en`, `ru`, `fr`) are embedded in page scripts.

## Rule for booking modal edits
If editing booking modal logic:
1. Change one page first
2. Review diff carefully
3. Apply the same logical change to the other 3 tour pages
4. Verify all 4 pages stay consistent

Never update only one tour page unless the change is intentionally page-specific.

## URL rules
- Site uses clean URLs on Netlify
- Internal links should use `/monaco-majesty`, not `/monaco-majesty.html`
- Do not break clean URL behavior

## What not to touch unless explicitly asked
- favicon set
- `site.webmanifest`
- `robots.txt`
- `sitemap.xml`
- legacy SEO/report markdown files
- one-off utility scripts

## Repo hygiene
The root contains one-off scripts and report files.
Do not treat them as production code.
Prefer moving:
- utility scripts -> `scripts/`
- reports and audits -> `docs/`

## Visual safety rules
Before commit:
- open affected pages locally in browser
- verify layout on desktop
- verify layout on mobile-width viewport
- verify booking modal still opens and closes
- verify no broken links or missing images
- verify language switch still works if affected

## Pre-commit checklist
Before commit always run:
```bash
git status
git diff --stat
```

Then manually verify affected pages in browser.

## Git rules
- Make focused commits
- Avoid unrelated cleanup mixed with feature work
- Do not delete files unless sure they are not used in production
- Ask before large structural changes

## Windows notes
- `LF will be replaced by CRLF` is expected on Windows
- If git shows dubious ownership:
```bash
git config --global --add safe.directory "D:/Azurepictrips/WEB developement/Project Claude"
```

## Definition of done
A frontend task is done only if:
- requested pages are updated
- mirrored modal changes are applied consistently
- local visual check is complete
- git diff is reasonable
- changes are committed and pushed through git only
