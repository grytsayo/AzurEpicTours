Before making any change, follow this sequence exactly. Do not commit or push.

1. Read CLAUDE.md and confirm the deployment rules and visual safety rules are understood.

2. Identify affected files:
   - List every file that will be modified
   - Confirm each file is a frontend asset (html, css, js, images)
   - If a file is not in the core production list from CLAUDE.md, flag it before proceeding

3. Make the smallest safe change:
   - Change only what was explicitly requested
   - Do not refactor surrounding code
   - Do not add comments, docstrings, or cleanup unrelated to the request

4. If booking modal logic was touched:
   - Check all 4 tour pages: monaco-majesty.html, monaco-coastline.html, grand-riviera-tour.html, monaco-by-night.html
   - Confirm the same logical change is applied consistently across all 4
   - Note any difference between pages (only BK_TOUR_ID should differ)

5. Run `git diff --stat` and show the output.

6. List what must be verified in browser before committing:
   - Open each affected page locally
   - Check desktop layout
   - Check mobile-width viewport (resize browser)
   - If modal was touched: open modal, close modal, submit form
   - If language strings were touched: switch between EN / RU / FR
   - If links were changed: click each changed link and verify destination
