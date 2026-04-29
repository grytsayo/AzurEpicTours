# Azure Epic Tours — Frontend Site

## Назначение

Лендинг сайт azurepictours.com. Статичный HTML+CSS+JS, без сборки. Содержит главную, 4 страницы туров с интегрированной модалкой бронирования, и privacy policy.

## Ключевые URL

- **Локально:** `D:\Azurepictrips\WEB developement\Project Claude`
- **GitHub:** `github.com/grytsayo/AzurEpicTours` (public, ветка main)
- **Production:** `https://azurepictours.com` (Netlify)
- **Netlify Dashboard:** auto-publish от main ветки

## Связанные проекты

- **API Backend:** отдельный репо `github.com/grytsayo/azure-epic-tours-api`, локально в `D:\Azurepictrips\WEB developement\tour-api`, deployed на Vercel.
- **API endpoint бронирования:** `https://azure-epic-tours.vercel.app/api/book`. Изменения в API делаются в backend репо, не здесь.

## Перед началом работы — ОБЯЗАТЕЛЬНО

```bash
cd "D:\Azurepictrips\WEB developement\Project Claude"
git fetch origin
git status
git log --oneline -5
```

Если `git fetch` показал новые коммиты на remote — `git pull` перед правками.

## Правила деплоя

1. **Деплой ТОЛЬКО через `git push origin main`.** Netlify auto-deploy сам подхватит и задеплоит.

2. **НИКОГДА не использовать `netlify deploy --prod` или drag-and-drop в Netlify Dashboard.** Любой такой деплой создаёт "теневую" версию сайта, которая отличается от git. В апреле 2026 такой деплой привёл к 4-месячному дрейфу repo от prod, и потребовал отдельной recovery-сессии.

3. Перед коммитом обязательно:
   - `git status` — какие файлы реально меняются
   - Открыть локальные файлы в браузере и проверить что не сломано визуально
   - `git diff --stat` — масштаб изменений выглядит разумно

## Структура

- `index.html` — главная страница
- `monaco-majesty.html`, `monaco-coastline.html`, `grand-riviera-tour.html`, `monaco-by-night.html` — 4 страницы туров с модалкой бронирования
- `privacy-policy.html`
- `tour-template.html` — шаблон для добавления новых туров
- `images/`, `style.css` — ассеты

## Архитектура страниц туров

Каждая страница — самостоятельный HTML файл с inline `<script>` секцией. **Код модалки бронирования идентичен на 4 страницах** (различается только `BK_TOUR_ID`). i18n словари (en/ru/fr) встроены прямо в `<script>`, переключение языка через JS без перезагрузки страницы.

При правке модалки — менять во всех 4 файлах одинаково. Использовать паттерн: правка на одной странице → review diff → копирование того же diff на остальные 3.

## Известные особенности

- Netlify настроен на **clean URLs** — `/monaco-majesty` вместо `/monaco-majesty.html`. Внутренние ссылки на сайте используют clean URL формат (без `.html`).

- На Windows git может ругаться `LF will be replaced by CRLF` — нормально, не влияет на работу.

- Если git ругается `dubious ownership in repository` — однократно сделать:
```bash
  git config --global --add safe.directory "D:/Azurepictrips/WEB developement/Project Claude"
```

## Last critical lessons (что НЕ повторять)

- Декабрь 2025 - апрель 2026: rogue Netlify deployments создали 4-месячный gap между git HEAD (Dec 19, 2025) и production (Apr 7, 2026). Production содержал booking modal которого не было в git. Восстановлено commit `50dc135` (Sync local copy with production state). Урок: всегда коммитить и пушить, никогда не использовать `netlify deploy --prod` напрямую.
