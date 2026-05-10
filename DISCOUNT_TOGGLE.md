# Как вернуть скидку на сайт AzurEpic Tours

> Памятка для будущего Олега и/или AI-ассистента.
> Создана: 2026-05-10

---

## Текущее состояние

Скидка **скрыта** через CSS feature-toggle в `styles.css`.

- Посетители видят **нативную (не скидочную) цену** — например €225
- Цена со скидкой (€180) и бейдж `-20%` есть в HTML, но скрыты через CSS
- Все HTML-файлы туров (`index.html`, `monaco-by-night.html`, `monaco-majesty.html`, `monaco-coastline.html`, `grand-riviera-tour.html`, `tour-template.html`) содержат полную скидочную разметку — данные не потеряны

---

## Как вернуть скидку (быстрый путь)

### 1. Создать ветку под изменения

```powershell
cd "D:\Azurepictrips\WEB developement\Project Claude"
git checkout main
git pull
git checkout -b restore-discount
```

### 2. Удалить TEMP-блок из `styles.css`

Открыть `styles.css`, прокрутить **в самый конец файла**. Найти блок, начинающийся со строки:

```css
/* ============================================
   TEMP: Hide discount UI — 2026-05-10 (updated)
```

Удалить **весь блок целиком**, включая:
- Правила `.tour-price-new`, `.price-info-new` (скрывают цену со скидкой)
- Правила `.tour-price-discount-badge`, `.price-info-discount-badge` (скрывают бейдж)
- Override-правила для `.tour-price-old` и `.price-info-old` (промоутят оригинальную цену)
- **Мобильный media query** для `.price-info-old` (важно — не забыть его, он отдельным блоком ниже)

После удаления в конце файла должны остаться только оригинальные стили сайта.

### 3. Проверить локально

```powershell
start index.html
start monaco-majesty.html
```

Должно быть видно:
- Зачёркнутая старая цена (€225) мелким серо-фиолетовым
- Фиолетовый бейдж `-20%`
- Цена со скидкой (€180) крупно красным

### 4. Закоммитить и смерджить

```powershell
git add styles.css
git commit -m "restore: bring back discount UI"
git push -u origin restore-discount
git checkout main
git merge restore-discount
git push
git branch -d restore-discount
git push origin --delete restore-discount
```

Netlify авто-задеплоит через 1-2 минуты. Проверить на `azurepictours.com` **в инкогнито** (иначе словишь старый CSS из кеша).

---

## Как изменить размер скидки

Если нужно поменять процент скидки или цены, а не просто вернуть всё как было — править надо **в HTML**, не в CSS:

### Где менять (в каждом из 6 HTML-файлов):

```html
<div class="tour-price">         <!-- или .price-info на страницах туров -->
    <div>
        <span class="tour-price-old">€225</span>            <!-- ← старая цена -->
        <span class="tour-price-discount-badge">-20%</span> <!-- ← процент скидки -->
    </div>
    <span class="tour-price-new">€180</span>                <!-- ← цена со скидкой -->
</div>
```

### Файлы со скидочной разметкой:

| Файл | Что внутри |
|---|---|
| `index.html` | 4 карточки туров на главной |
| `monaco-by-night.html` | 1 цена на странице тура |
| `monaco-majesty.html` | 1 цена на странице тура |
| `monaco-coastline.html` | 1 цена на странице тура |
| `grand-riviera-tour.html` | 1 цена на странице тура |
| `tour-template.html` | Шаблон для новых туров |

⚠️ При изменении процента не забудь обновить **обе цифры** — и старую цену, и новую (со скидкой), и сам бейдж процента. Иначе математика не сойдётся и клиент это заметит.

---

## Промпт для Claude Code (если хочешь автоматизировать)

> Restore the discount UI on AzurEpic Tours site.
>
> 1. Open `styles.css` and find the block at the end labeled `TEMP: Hide discount UI — 2026-05-10`. Delete this entire block, including the mobile media query override for `.price-info-old` that follows it.
>
> 2. Do not touch any HTML files — discount markup is preserved there.
>
> 3. Show me `git diff styles.css`.

---

## История изменений

- **2026-05-10** — скидка скрыта (commit `6a9a77b`, ветка `remove-discount-mention` → `main`)
- **YYYY-MM-DD** — скидка возвращена (заполнить, когда вернёшь)
