# Azure Epic Tours — Frontend Site

## Working copies

- Primary working copy: `C:\work\azure-epic-tours\frontend`
- Synchronized copy: `D:\Azurepictrips\WEB developement\Project Claude`
- GitHub: `github.com/grytsayo/AzurEpicTours`
- Production: `https://azurepictours.com` (Netlify)

Read `CLAUDE.md` completely before changing production files.

## Before any edit

```powershell
cd "C:\work\azure-epic-tours\frontend"
git fetch origin
git status
git log --oneline -5
```

Do not start new work if the working tree contains unexplained changes. Pull remote commits before editing.

## Deploy and synchronization

Deploy only through `git push origin main`. Never deploy directly with Netlify CLI or Dashboard drag-and-drop.

After every successful push, synchronize the D: copy:

```powershell
git -C "D:\Azurepictrips\WEB developement\Project Claude" pull --ff-only origin main
```

Before commit, check `git status`, `git diff --stat`, and verify affected pages locally on desktop and mobile widths.
