# 📝 Инструкция по созданию нового тура

Этот документ объясняет, как использовать `tour-template.html` для добавления новых туров на сайт.

---

## 🚀 Быстрый старт

### Шаг 1: Копируйте шаблон
```bash
# Скопируйте tour-template.html и переименуйте
# Например, для тура "Cannes & Antibes":
cp tour-template.html cannes-antibes-tour.html
```

### Шаг 2: Создайте папку для фото
```bash
# Создайте папку в images/
mkdir images/cannes-antibes
# Поместите туда 8 фотографий: image_01.jpg, image_02.jpg и т.д.
```

### Шаг 3: Откройте файл и найдите секции с комментариями

---

## 📋 Что нужно заменить в файле

### 1. **META TAGS (строки 5-40)**

#### Title (строка 5)
```html
<!-- ЗАМЕНИТЬ: Название тура | Длительность | Ключевые места | AzurEpicTours -->
<title id="page-title">ВАШ ТУР | 6 Hours | Cannes & Antibes | AzurEpicTours</title>
```

#### Description (строка 8)
```html
<!-- ЗАМЕНИТЬ: Краткое описание тура до 160 символов -->
<meta id="meta-description" name="description" content="Ваше описание тура с ключевыми местами и особенностями.">
```

#### Keywords (строка 9)
```html
<!-- ЗАМЕНИТЬ: Ключевые слова через запятую -->
<meta id="meta-keywords" name="keywords" content="Cannes tour, Antibes tour, French Riviera, private tour">
```

#### Canonical URL (строка 12)
```html
<!-- ЗАМЕНИТЬ: URL вашего тура -->
<link rel="canonical" href="https://www.azurepictours.com/cannes-antibes-tour.html">
```

#### Open Graph Meta Tags (строки 17-25)
```html
<!-- ЗАМЕНИТЬ: Название и описание для соц. сетей -->
<meta id="og-title" property="og:title" content="Ваш тур | AzurEpicTours">
<meta id="og-description" property="og:description" content="Описание для Facebook">
<!-- ЗАМЕНИТЬ: Путь к главному фото -->
<meta property="og:image" content="https://www.azurepictours.com/images/cannes-antibes/image_01.jpg">
<!-- ЗАМЕНИТЬ: URL страницы -->
<meta property="og:url" content="https://www.azurepictours.com/cannes-antibes-tour.html">
```

---

### 2. **HERO SECTION (строки 59-76)**

```html
<section class="hero">
    <!-- ЗАМЕНИТЬ: Название тура -->
    <h1 data-i18n="tourTitle">Cannes & Antibes: Private Tour</h1>

    <!-- ЗАМЕНИТЬ: Подзаголовок -->
    <p class="subtitle" data-i18n="tourSubtitle">6 hours exploring the French Riviera glamour</p>

    <div class="tour-meta">
        <div class="meta-item">
            <span>⏱️</span>
            <!-- ЗАМЕНИТЬ: Длительность -->
            <span data-i18n="duration">Duration: 6 hours</span>
        </div>
        <div class="meta-item">
            <span>💰</span>
            <!-- ЗАМЕНИТЬ: Цена -->
            <span data-i18n="priceFrom">From €350</span>
        </div>
        <div class="meta-item">
            <span>🌍</span>
            <span data-i18n="languages">Languages: EN, FR, RU</span>
        </div>
    </div>
</section>
```

---

### 3. **PHOTO GALLERY (строки 80-115)**

```html
<div class="gallery">
    <!-- ЗАМЕНИТЬ: Пути к вашим фото (минимум 4, рекомендуется 8) -->
    <picture>
        <source srcset="./images/cannes-antibes/image_01.webp" type="image/webp">
        <img src="./images/cannes-antibes/image_01.jpg"
             alt="Описание фото на английском"
             onclick="openLightbox(this.src)"
             loading="lazy">
    </picture>

    <!-- Повторите для всех фото -->
    <picture>
        <source srcset="./images/cannes-antibes/image_02.webp" type="image/webp">
        <img src="./images/cannes-antibes/image_02.jpg"
             alt="Описание второго фото"
             onclick="openLightbox(this.src)"
             loading="lazy">
    </picture>

    <!-- ... добавьте ещё 6 фото ... -->
</div>
```

**Совет**: Можно использовать только .jpg без .webp, но .webp быстрее загружается.

---

### 4. **ABOUT THE TOUR (строки 119-132)**

```html
<div class="section">
    <h2 data-i18n="aboutTitle">✨ About the Tour</h2>
    <!-- ЗАМЕНИТЬ: Описание вашего тура -->
    <p data-i18n="aboutText">Ваше описание тура. Расскажите о том, что делает этот тур особенным.</p>

    <h3 data-i18n="highlightsTitle">🎯 Highlights</h3>
    <ul class="highlights-list">
        <!-- ЗАМЕНИТЬ: Основные места тура (5-10 пунктов) -->
        <li data-i18n="highlight1">Первое важное место</li>
        <li data-i18n="highlight2">Второе важное место</li>
        <li data-i18n="highlight3">Третье важное место</li>
        <li data-i18n="highlight4">Четвёртое важное место</li>
        <li data-i18n="highlight5">Пятое важное место</li>
    </ul>
</div>
```

---

### 5. **ITINERARY (строки 135-200)**

```html
<div class="section">
    <h2 data-i18n="itineraryTitle">🗺️ Itinerary</h2>

    <!-- ЗАМЕНИТЬ: Добавьте ваши остановки -->
    <div class="itinerary-item">
        <strong data-i18n="stop1Name">Первая остановка</strong>
        <span class="time" data-i18n="stop1Time">(30 min)</span>
        <p data-i18n="stop1Desc">Описание первой остановки</p>
    </div>

    <div class="itinerary-item">
        <strong data-i18n="stop2Name">Вторая остановка</strong>
        <span class="time" data-i18n="stop2Time">(1 hour)</span>
        <p data-i18n="stop2Desc">Описание второй остановки</p>
    </div>

    <!-- Добавьте столько остановок, сколько нужно -->
</div>
```

---

### 6. **WHAT'S INCLUDED (строки 201-217)**

```html
<div class="section">
    <h2 data-i18n="includedTitle">✅ What's Included</h2>
    <div class="includes-grid">
        <!-- ЗАМЕНИТЬ: Что включено -->
        <div class="includes-item included" data-i18n="inc1">Трансфер от/до отеля</div>
        <div class="includes-item included" data-i18n="inc2">Личный водитель-гид</div>
        <div class="includes-item included" data-i18n="inc3">Сопровождение гида</div>

        <!-- ЗАМЕНИТЬ: Что НЕ включено -->
        <div class="includes-item not-included" data-i18n="notInc1">Еда и напитки</div>
        <div class="includes-item not-included" data-i18n="notInc2">Входные билеты (~€10/чел)</div>
    </div>
</div>
```

---

### 7. **PRICING (строки 231-241)**

```html
<div class="cta-section">
    <div class="price-info">
        <div>
            <!-- ЗАМЕНИТЬ: Старая цена -->
            <span class="price-info-old">€400</span>
            <!-- ЗАМЕНИТЬ: Процент скидки -->
            <span class="price-info-discount-badge">-15%</span>
        </div>
        <!-- ЗАМЕНИТЬ: Новая цена -->
        <span class="price-info-new">€340</span>
    </div>
    <button onclick="openBookingModal()" class="book-btn" data-i18n="bookButton">Book This Tour</button>
</div>
```

---

### 8. **SOCIAL SHARING (строки 259-310)**

```html
<!-- ЗАМЕНИТЬ: URL вашего тура во ВСЕХ ссылках -->
<a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.azurepictours.com%2Fcannes-antibes-tour.html"
   ...>

<a href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fwww.azurepictours.com%2Fcannes-antibes-tour.html&text=Cannes%20Antibes%20Tour"
   ...>
```

---

### 9. **RELATED TOURS (строки 313-341)**

```html
<div class="related-tours">
    <h2 data-i18n="relatedToursTitle">🌟 You May Also Like</h2>
    <div class="related-tours-grid">

        <!-- ЗАМЕНИТЬ: Выберите 2 других тура для рекомендаций -->
        <a href="./monaco-majesty.html" class="related-tour-card">
            <picture>
                <source srcset="./images/monaco-majesty/MC_magesty_01.webp" type="image/webp">
                <img src="./images/monaco-majesty/MC_magesty_01.jpg" alt="Monaco Majesty" loading="lazy">
            </picture>
            <div class="related-tour-info">
                <h3>Monaco Majesty</h3>
                <p data-i18n="relatedTourDesc_monaco-majesty">Discover Monaco's glamour</p>
                <span class="related-tour-cta" data-i18n="learnMore">Learn More →</span>
            </div>
        </a>

        <!-- Второй рекомендованный тур -->
        <a href="./grand-riviera-tour.html" class="related-tour-card">
            <!-- ... -->
        </a>
    </div>
</div>
```

---

## 📌 Добавление на главную страницу (index.html)

После создания страницы тура, добавьте его на главную:

### Найдите секцию tours-grid (примерно строка 1646)

```html
<div class="tours-grid">
    <!-- Существующие туры... -->

    <!-- ДОБАВЬТЕ ваш новый тур -->
    <div class="tour-card" id="tour-cannes-antibes" onclick="window.location.href='cannes-antibes-tour.html'">
        <div class="tour-image" style="background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('./images/cannes-antibes/image_01.jpg'); background-size: cover; background-position: center;" role="img" aria-label="Cannes and Antibes French Riviera">
        </div>
        <div class="tour-content">
            <div class="tour-header">
                <h3 class="tour-title" data-i18n="tour5Title">Cannes & Antibes Tour</h3>
                <span class="tour-duration" data-i18n="tour5Duration">6 hours</span>
            </div>
            <p class="tour-tagline" data-i18n="tour5Tagline">Glamour of the French Riviera</p>
            <p class="tour-description">Explore the famous Cannes promenade and charming Antibes old town.</p>

            <div class="tour-highlights">
                <h4 data-i18n="highlightsLabel">Highlights:</h4>
                <ul>
                    <li data-i18n="tour5H1">La Croisette in Cannes</li>
                    <li data-i18n="tour5H2">Festival Palace</li>
                    <li data-i18n="tour5H3">Antibes old town</li>
                    <li data-i18n="tour5H4">Billionaire's port</li>
                </ul>
            </div>

            <div class="tour-features">
                <span class="feature-tag" data-i18n="tour5Tag1">Private tour</span>
                <span class="feature-tag" data-i18n="tour5Tag2">Hotel pickup</span>
                <span class="feature-tag" data-i18n="tour5Tag3">3 languages</span>
            </div>

            <div class="tour-footer">
                <div class="tour-price">
                    <div>
                        <span class="tour-price-old">€400</span>
                        <span class="tour-price-discount-badge">-15%</span>
                    </div>
                    <span class="tour-price-new">€340</span>
                </div>
                <button class="details-button" data-i18n="detailsButton" onclick="event.stopPropagation(); window.location.href='cannes-antibes-tour.html'">Tour Details</button>
            </div>
        </div>
    </div>
</div>
```

---

## 📂 Структура папки с фото

```
images/
└── cannes-antibes/           # Название папки = название файла тура
    ├── image_01.jpg          # Главное фото (для соц. сетей)
    ├── image_01.webp         # (опционально, но рекомендуется)
    ├── image_02.jpg
    ├── image_02.webp
    ├── image_03.jpg
    ├── image_03.webp
    ├── ...
    └── image_08.jpg
```

**Рекомендации по фото:**
- Размер: 1200x800 пикселей (минимум)
- Формат: JPG (обязательно), WebP (опционально для быстрой загрузки)
- Качество: 80-85% для JPG
- Название: Простое и понятное (image_01.jpg, image_02.jpg)

---

## ✅ Чеклист перед публикацией

- [ ] Скопировал tour-template.html и переименовал
- [ ] Создал папку с фото в images/
- [ ] Заменил все META теги (title, description, keywords)
- [ ] Заменил название тура в Hero секции
- [ ] Обновил цены и длительность
- [ ] Добавил 8 фотографий в галерею
- [ ] Написал описание тура и highlights
- [ ] Добавил маршрут (itinerary)
- [ ] Указал что включено/не включено
- [ ] Обновил URL в Social Sharing ссылках
- [ ] Выбрал 2 похожих тура для "You May Also Like"
- [ ] Добавил карточку тура на главную страницу (index.html)
- [ ] Проверил тур в браузере локально
- [ ] Закоммитил изменения в Git

---

## 🆘 Нужна помощь?

Если что-то не понятно:
1. Посмотрите на существующие туры (monaco-majesty.html, monaco-coastline.html)
2. Они используют ту же структуру
3. Можете просто копировать куски кода и менять текст

---

**Удачи в создании новых туров! 🚀**
