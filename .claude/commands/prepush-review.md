Run the following review before any commit or push. Do not commit or push.

1. Run `git status` and show the output.

2. Run `git diff --stat` and show the output.

3. Categorize each changed file by risk level:
   - HIGH: monaco-majesty.html, monaco-coastline.html, grand-riviera-tour.html, monaco-by-night.html, js/booking-modal.js, styles.css
   - MEDIUM: index.html, privacy-policy.html, tour-template.html
   - LOW: sitemap.xml, robots.txt, site.webmanifest, images/
   - UNKNOWN: any file not in the core production list from CLAUDE.md — flag explicitly

4. Based on changed files, list what must be verified in browser:
   - For any tour page change: open that page, check layout on desktop and mobile, open and close booking modal
   - For styles.css change: check all pages that use it for layout regressions
   - For booking modal JS change: test modal open, close, date selection, guest count, and form submission on all 4 tour pages
   - For index.html change: check homepage layout and all navigation links
   - For language string changes: switch EN / RU / FR and verify each affected string

5. Warn if any changed file appears unrelated to the stated task:
   - Flag files outside the expected scope
   - Flag changes to more files than the task requires
   - Suggest whether the extra changes should be committed separately or reverted
