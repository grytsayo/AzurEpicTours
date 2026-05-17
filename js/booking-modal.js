// js/booking-modal.js
// Booking modal with GYG-style calendar grid.
// Drop-in for static HTML pages — no build step, no framework.
// Usage: BookingModal.init({ tourId, apiBaseUrl, apiKey, lang, modalId })
// Then window.openBookingModal() / window.closeBookingModal() are available.

(function (global) {
  'use strict';

  // ── Built-in translations (booking-modal keys only) ──────────────────────────
  // Page-level translations (tour content, nav, footer) stay inline per HTML file.
  // We read them from window.translations[lang] if present, falling back to these.

  const BUILT_IN = {
    en: {
      bkStep1Title:      '1. Choose a date',
      bkTimeLabel:       'Available time slots',
      bkSlotsHint:       'Select a date to see availability',
      bkNoSlots:         'No slots available for this date',
      bkNextBtn:         'Continue',
      bkBack:            'Back',
      bkStep2Title:      '2. Your details',
      bkNameLabel:       'Full name *',
      bkEmailLabel:      'Email *',
      bkPhoneLabel:      'Phone / WhatsApp *',
      bkGuestsLabel:     'Participants *',
      bkLanguageLabel:   'Preferred language',
      bkSubmitBtn:       'Confirm Booking',
      bkSending:         'Sending…',
      bkErrorRequired:   'Please fill in all required fields.',
      bkErrorInvalidEmail: 'Please enter a valid email address.',
      bkErrorNetwork:    'Network error. Please try again.',
      bkErrorBooking:    'Booking failed. Please try again.',
      bkErrorAvailability: 'Could not load availability. Please try again.',
      bkSummaryDate:     'Date:',
      bkSummaryTime:     'Time:',
      bkSuccessTitle:    'Booking Confirmed!',
      bkSuccessMsg:      "Your booking has been received. We'll send a confirmation to your email shortly.",
      bkDoneBtn:         'Close',
      bkCalMonths:       ['January','February','March','April','May','June','July','August','September','October','November','December'],
      bkCalWeekdays:     ['Mo','Tu','We','Th','Fr','Sa','Su'],
      bkCalLoading:      'Loading calendar…',
      bkCalLoadError:    'Could not load availability. Please try again.',
      bkCalRetry:        'Retry',
      bkCalSelectPrompt: 'Select a date',
      bkCalNoSlots:      'No availability',
      bkCalSlotsFor:     'Available times for',
      bkCalPrevMonth:    'Previous month',
      bkCalNextMonth:    'Next month',
    },
    ru: {
      bkStep1Title:      '1. Выберите дату',
      bkTimeLabel:       'Доступные слоты',
      bkSlotsHint:       'Выберите дату, чтобы увидеть доступность',
      bkNoSlots:         'На эту дату нет доступных слотов',
      bkNextBtn:         'Далее',
      bkBack:            'Назад',
      bkStep2Title:      '2. Ваши данные',
      bkNameLabel:       'Полное имя *',
      bkEmailLabel:      'Email *',
      bkPhoneLabel:      'Телефон / WhatsApp *',
      bkGuestsLabel:     'Количество человек *',
      bkLanguageLabel:   'Язык переписки',
      bkSubmitBtn:       'Подтвердить бронирование',
      bkSending:         'Отправка…',
      bkErrorRequired:   'Заполните все обязательные поля.',
      bkErrorInvalidEmail: 'Введите корректный email.',
      bkErrorNetwork:    'Ошибка сети. Попробуйте ещё раз.',
      bkErrorBooking:    'Не удалось забронировать. Попробуйте ещё раз.',
      bkErrorAvailability: 'Не удалось загрузить доступность. Попробуйте ещё раз.',
      bkSummaryDate:     'Дата:',
      bkSummaryTime:     'Время:',
      bkSuccessTitle:    'Бронирование подтверждено!',
      bkSuccessMsg:      'Ваше бронирование получено. Мы отправим подтверждение на ваш email.',
      bkDoneBtn:         'Закрыть',
      bkCalMonths:       ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
      bkCalWeekdays:     ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'],
      bkCalLoading:      'Загрузка календаря…',
      bkCalLoadError:    'Не удалось загрузить доступность. Попробуйте ещё раз.',
      bkCalRetry:        'Повторить',
      bkCalSelectPrompt: 'Выберите дату',
      bkCalNoSlots:      'Нет доступных мест',
      bkCalSlotsFor:     'Доступное время на',
      bkCalPrevMonth:    'Предыдущий месяц',
      bkCalNextMonth:    'Следующий месяц',
    },
    fr: {
      bkStep1Title:      '1. Choisissez une date',
      bkTimeLabel:       'Créneaux disponibles',
      bkSlotsHint:       'Sélectionnez une date pour voir les disponibilités',
      bkNoSlots:         'Aucun créneau disponible pour cette date',
      bkNextBtn:         'Continuer',
      bkBack:            'Retour',
      bkStep2Title:      '2. Vos coordonnées',
      bkNameLabel:       'Nom complet *',
      bkEmailLabel:      'Email *',
      bkPhoneLabel:      'Téléphone / WhatsApp *',
      bkGuestsLabel:     'Participants *',
      bkLanguageLabel:   'Langue de communication',
      bkSubmitBtn:       'Confirmer la réservation',
      bkSending:         'Envoi en cours…',
      bkErrorRequired:   'Veuillez remplir tous les champs obligatoires.',
      bkErrorInvalidEmail: 'Veuillez entrer une adresse email valide.',
      bkErrorNetwork:    'Erreur réseau. Veuillez réessayer.',
      bkErrorBooking:    'La réservation a échoué. Veuillez réessayer.',
      bkErrorAvailability: 'Impossible de charger les disponibilités. Veuillez réessayer.',
      bkSummaryDate:     'Date :',
      bkSummaryTime:     'Heure :',
      bkSuccessTitle:    'Réservation confirmée !',
      bkSuccessMsg:      'Votre réservation a été reçue. Nous vous enverrons une confirmation par email.',
      bkDoneBtn:         'Fermer',
      bkCalMonths:       ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
      bkCalWeekdays:     ['Lu','Ma','Me','Je','Ve','Sa','Di'],
      bkCalLoading:      'Chargement du calendrier…',
      bkCalLoadError:    'Impossible de charger les disponibilités. Veuillez réessayer.',
      bkCalRetry:        'Réessayer',
      bkCalSelectPrompt: 'Sélectionnez une date',
      bkCalNoSlots:      'Aucune disponibilité',
      bkCalSlotsFor:     'Heures disponibles pour le',
      bkCalPrevMonth:    'Mois précédent',
      bkCalNextMonth:    'Mois suivant',
    },
  };

  // ── Constants ─────────────────────────────────────────────────────────────────

  var BK_ACCENT      = '#d4a574';   // slot pill gold (unchanged)
  var BK_PURPLE      = '#667eea';   // brand purple
  var WINDOW_DAYS    = 90;          // bookable horizon
  var MOBILE_BP      = 768;         // px — matches existing site breakpoint

  // ── Module state ─────────────────────────────────────────────────────────────

  var _opts          = null;   // init options
  var _modal         = null;   // DOM: #bookingUnavailableModal
  var _step1         = null;   // DOM: #bk-step1
  var _calRoot       = null;   // DOM: .bk-cal-root (created by us inside _step1)
  var _selectedDate  = null;   // 'YYYY-MM-DD' or null
  var _selectedTime  = null;   // 'HH:MM' or null
  var _viewMonth     = 0;      // 0 = current calendar month, 1 = next, etc.
                               // always measured from _today's month
  var _cache         = {};     // 'YYYY-MM' → { available: bool, slot_count: int } per day
                               // key is YYYY-MM-DD, outer key not used — flat map
                               // Actually: _cache['YYYY-MM-DD'] = { available, slot_count }
  var _cachedMonths  = {};     // 'YYYY-MM' → true  (which months have been fetched)
  var _today         = null;   // Date object at local midnight

  // ── Translation helper ────────────────────────────────────────────────────────

  function t(key) {
    var lang = _opts ? _opts.lang() : 'en';
    // Prefer page-level translations if they include this key
    var pageTrans = global.translations;
    if (pageTrans && pageTrans[lang] && pageTrans[lang][key] !== undefined) {
      return pageTrans[lang][key];
    }
    var fallback = BUILT_IN[lang] || BUILT_IN['en'];
    return fallback[key] !== undefined ? fallback[key] : key;
  }

  // ── Date utilities ────────────────────────────────────────────────────────────

  function todayLocal() {
    var d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function dateToStr(d) {
    // Returns 'YYYY-MM-DD' from a Date object (local time)
    var y  = d.getFullYear();
    var mo = String(d.getMonth() + 1).padStart(2, '0');
    var da = String(d.getDate()).padStart(2, '0');
    return y + '-' + mo + '-' + da;
  }

  function strToDate(s) {
    // Parse 'YYYY-MM-DD' as local midnight
    var parts = s.split('-');
    return new Date(+parts[0], +parts[1] - 1, +parts[2]);
  }

  function lastDayOfMonth(year, month) {
    // month: 0-based
    return new Date(year, month + 1, 0).getDate();
  }

  // Returns the Date for the first day of the month that is `offset` months
  // from _today's month. offset=0 → current month, offset=1 → next month, etc.
  function monthStart(offset) {
    return new Date(_today.getFullYear(), _today.getMonth() + offset, 1);
  }

  // 'YYYY-MM' key for a given month-start Date
  function monthKey(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  }

  // Horizon: today + WINDOW_DAYS
  function horizonDate() {
    var h = new Date(_today);
    h.setDate(h.getDate() + WINDOW_DAYS);
    return h;
  }

  // ── API fetch ─────────────────────────────────────────────────────────────────

  function apiFetch(path, options) {
    var base = {
      headers: {
        'Authorization': 'Bearer ' + _opts.apiKey,
        'Content-Type':  'application/json',
      },
    };
    if (options) {
      if (options.method) base.method = options.method;
      if (options.body)   base.body   = options.body;
    }
    return fetch(_opts.apiBaseUrl + path, base);
  }

  // Fetch a single month (lazy-load on nav) or two months (initial open).
  // Stores results into _cache and _cachedMonths.
  // Returns a Promise that resolves when done (or rejects on network error).
  function fetchMonths(fromDate, toDate) {
    var from = dateToStr(fromDate);
    var to   = dateToStr(toDate);
    var url  = '/availability?from=' + from + '&to=' + to + '&tour=' + _opts.tourId;

    return apiFetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data.days) throw new Error('Unexpected API response');
        var days = data.days;
        Object.keys(days).forEach(function (dateStr) {
          var info = days[dateStr][_opts.tourId];
          if (info) {
            _cache[dateStr] = { available: info.available, slot_count: info.slot_count };
          }
        });
        // Mark every month in [fromDate, toDate] as cached
        var cur = new Date(fromDate.getFullYear(), fromDate.getMonth(), 1);
        var end = new Date(toDate.getFullYear(), toDate.getMonth(), 1);
        while (cur <= end) {
          _cachedMonths[monthKey(cur)] = true;
          cur.setMonth(cur.getMonth() + 1);
        }
      });
  }

  // ── Calendar rendering ────────────────────────────────────────────────────────

  // Returns true if the device is in mobile width
  function isMobile() {
    return global.innerWidth <= MOBILE_BP;
  }

  // How many months are visible at once
  function visibleMonthCount() {
    return isMobile() ? 1 : 2;
  }

  // Build a single .bk-cal-month element for the given month.
  // year, month: 0-based month.
  function renderMonthEl(year, month) {
    var today   = _today;
    var horizon = horizonDate();
    var months  = t('bkCalMonths');
    var wdays   = t('bkCalWeekdays');

    var wrap = document.createElement('div');
    wrap.className = 'bk-cal-month';

    // Month title
    var title = document.createElement('div');
    title.className = 'bk-cal-month-title';
    title.textContent = months[month] + ' ' + year;
    wrap.appendChild(title);

    // Weekday header row
    var wrow = document.createElement('div');
    wrow.className = 'bk-cal-weekdays';
    wdays.forEach(function (d) {
      var s = document.createElement('span');
      s.textContent = d;
      wrow.appendChild(s);
    });
    wrap.appendChild(wrow);

    // Day grid
    var grid = document.createElement('div');
    grid.className = 'bk-cal-grid';

    var firstDay = new Date(year, month, 1).getDay(); // 0=Sun…6=Sat
    // Convert Sunday-based to Monday-based (0=Mon … 6=Sun)
    var leadingBlanks = (firstDay + 6) % 7;
    var daysInMonth   = lastDayOfMonth(year, month);

    // Leading blank cells
    for (var b = 0; b < leadingBlanks; b++) {
      var blank = document.createElement('div');
      blank.className = 'bk-cal-day bk-cal-day--empty';
      grid.appendChild(blank);
    }

    // Day cells
    for (var d = 1; d <= daysInMonth; d++) {
      var cellDate    = new Date(year, month, d);
      var dateStr     = dateToStr(cellDate);
      var cell        = document.createElement('div');
      var isToday     = (cellDate.getTime() === today.getTime());
      var isPast      = cellDate < today;
      var isBeyond    = cellDate > horizon;
      var cached      = _cache[dateStr];
      var isAvailable = cached && cached.available;
      var classes     = ['bk-cal-day'];

      if (isPast || isBeyond) {
        classes.push('bk-cal-day--out-of-range');
      } else if (isAvailable) {
        classes.push('bk-cal-day--available');
        cell.setAttribute('tabindex', '0');
        cell.setAttribute('data-date', dateStr);
        cell.setAttribute('title', t('bkCalSlotsFor') + ' ' + dateStr);
      } else {
        // In-window but fully booked or not yet loaded (treat as unavailable)
        classes.push('bk-cal-day--unavailable');
      }

      if (isToday) classes.push('bk-cal-day--today');
      if (dateStr === _selectedDate) classes.push('bk-cal-day--selected');

      cell.className = classes.join(' ');
      cell.textContent = d;

      if (cell.hasAttribute('data-date')) {
        cell.addEventListener('click', function (e) {
          onDayClick(e.currentTarget.getAttribute('data-date'));
        });
        cell.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onDayClick(e.currentTarget.getAttribute('data-date'));
          }
        });
      }

      grid.appendChild(cell);
    }

    wrap.appendChild(grid);
    return wrap;
  }

  // Re-render the full calendar area (header + month(s)).
  // Does not touch the slot pills area.
  function renderCalendar() {
    if (!_calRoot) return;

    var header    = _calRoot.querySelector('.bk-cal-header');
    var monthsRow = _calRoot.querySelector('.bk-cal-months-row');
    var prevBtn   = _calRoot.querySelector('.bk-cal-prev');
    var nextBtn   = _calRoot.querySelector('.bk-cal-next');

    if (!header || !monthsRow || !prevBtn || !nextBtn) return;

    var count   = visibleMonthCount();
    var horizon = horizonDate();

    // Clear existing month columns
    monthsRow.innerHTML = '';

    for (var i = 0; i < count; i++) {
      var ms = monthStart(_viewMonth + i);
      monthsRow.appendChild(renderMonthEl(ms.getFullYear(), ms.getMonth()));
    }

    // Prev: disable when leftmost visible month IS the current calendar month
    var canPrev = _viewMonth > 0;
    prevBtn.disabled = !canPrev;
    prevBtn.style.opacity         = canPrev ? '1' : '0.3';
    prevBtn.style.cursor          = canPrev ? 'pointer' : 'not-allowed';
    prevBtn.style.pointerEvents   = canPrev ? 'auto' : 'none';

    // Next: disable when advancing by 1 would make the leftmost month start
    // entirely beyond the horizon.
    var nextLeftStart = monthStart(_viewMonth + 1);
    var canNext = nextLeftStart <= horizon;
    nextBtn.disabled = !canNext;
    nextBtn.style.opacity         = canNext ? '1' : '0.3';
    nextBtn.style.cursor          = canNext ? 'pointer' : 'not-allowed';
    nextBtn.style.pointerEvents   = canNext ? 'auto' : 'none';
  }

  // Show the loading overlay, hide the months row
  function showCalLoading() {
    if (!_calRoot) return;
    var loading   = _calRoot.querySelector('.bk-cal-loading');
    var monthsRow = _calRoot.querySelector('.bk-cal-months-row');
    var errorEl   = _calRoot.querySelector('.bk-cal-error');
    if (loading)   loading.style.display   = 'block';
    if (monthsRow) monthsRow.style.display = 'none';
    if (errorEl)   errorEl.style.display   = 'none';
  }

  // Hide loading overlay, show months row
  function hideCalLoading() {
    if (!_calRoot) return;
    var loading   = _calRoot.querySelector('.bk-cal-loading');
    var monthsRow = _calRoot.querySelector('.bk-cal-months-row');
    if (loading)   loading.style.display   = 'none';
    if (monthsRow) monthsRow.style.display = '';
  }

  // Show error state inside calendar area with a Retry button
  function showCalError(retryFn) {
    if (!_calRoot) return;
    var loading   = _calRoot.querySelector('.bk-cal-loading');
    var monthsRow = _calRoot.querySelector('.bk-cal-months-row');
    var errorEl   = _calRoot.querySelector('.bk-cal-error');
    if (loading)   loading.style.display   = 'none';
    if (monthsRow) monthsRow.style.display = 'none';
    if (errorEl) {
      errorEl.innerHTML = '';
      var msg = document.createElement('p');
      msg.textContent = t('bkCalLoadError');
      msg.style.cssText = 'margin:0 0 12px; color:#e53e3e; font-size:.9rem;';
      var btn = document.createElement('button');
      btn.textContent = t('bkCalRetry');
      btn.style.cssText = 'padding:8px 20px; background:' + BK_PURPLE + '; color:white; border:none; border-radius:8px; cursor:pointer; font-size:.9rem;';
      btn.addEventListener('click', function () {
        errorEl.style.display = 'none';
        retryFn();
      });
      errorEl.appendChild(msg);
      errorEl.appendChild(btn);
      errorEl.style.display = 'block';
    }
  }

  // Ensure the months visible at _viewMonth (and +1 on desktop) are cached.
  // If not cached, fetch and re-render. Shows loading overlay during fetch.
  function ensureMonthsCached(onReady) {
    var count      = visibleMonthCount();
    var needed     = [];

    for (var i = 0; i < count; i++) {
      var ms  = monthStart(_viewMonth + i);
      var key = monthKey(ms);
      if (!_cachedMonths[key]) needed.push(ms);
    }

    if (needed.length === 0) {
      onReady();
      return;
    }

    // Compute from/to spanning all needed months
    var earliest = needed[0];
    var latest   = needed[needed.length - 1];
    var fromDate = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
    var lastDayN = lastDayOfMonth(latest.getFullYear(), latest.getMonth());
    var toDate   = new Date(latest.getFullYear(), latest.getMonth(), lastDayN);

    // Clamp toDate to horizon
    var hz = horizonDate();
    if (toDate > hz) toDate = hz;

    showCalLoading();

    fetchMonths(fromDate, toDate)
      .then(function () {
        hideCalLoading();
        onReady();
      })
      .catch(function () {
        showCalError(function () {
          ensureMonthsCached(onReady);
        });
      });
  }

  // ── Slot pills (single-day fetch) ─────────────────────────────────────────────

  function onDayClick(dateStr) {
    _selectedDate = dateStr;
    _selectedTime = null;

    // Update selected highlight in grid (re-render calendar so --selected moves)
    renderCalendar();

    // Show slots area and load
    var slotsWrap = _calRoot.querySelector('.bk-cal-slots-wrap');
    if (slotsWrap) slotsWrap.style.display = 'block';

    loadSlots(dateStr);
  }

  function loadSlots(dateStr) {
    var slotsDiv = _calRoot.querySelector('.bk-cal-slots');
    var loading  = _calRoot.querySelector('.bk-cal-slots-loading');
    var errDiv   = _calRoot.querySelector('.bk-cal-slots-error');
    var nextBtn  = _step1.querySelector('.bk-next-btn');

    _selectedTime = null;
    if (nextBtn) nextBtn.disabled = true;

    slotsDiv.innerHTML = '';
    if (errDiv)  { errDiv.style.display  = 'none'; errDiv.textContent = ''; }
    if (loading) loading.style.display  = 'block';

    apiFetch('/availability?date=' + dateStr + '&tour=' + _opts.tourId)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (loading) loading.style.display = 'none';
        var slots = (data.availability && data.availability[_opts.tourId] &&
                     data.availability[_opts.tourId].slots) || [];

        if (!slots.length) {
          var p = document.createElement('p');
          p.style.cssText = 'color:#aaa; font-size:.9rem; margin:0;';
          p.textContent = t('bkNoSlots');
          slotsDiv.appendChild(p);
          return;
        }

        slots.forEach(function (slot) {
          var btn = document.createElement('button');
          btn.textContent = slot.start + (slot.end ? '–' + slot.end : '');
          btn.dataset.time = slot.start;
          btn.className = 'bk-slot-btn';
          btn.style.cssText = 'padding:9px 18px; border-radius:8px; border:2px solid; font-size:.95rem; cursor:pointer; transition:all .2s; font-weight:500;';

          if (slot.available) {
            btn.style.borderColor = BK_ACCENT;
            btn.style.background  = 'white';
            btn.style.color       = BK_ACCENT;
            btn.addEventListener('click', function () { selectSlot(btn, slot.start); });
          } else {
            btn.style.borderColor = '#e2e8f0';
            btn.style.background  = '#f7f7f7';
            btn.style.color       = '#bbb';
            btn.disabled = true;
          }
          slotsDiv.appendChild(btn);
        });
      })
      .catch(function () {
        if (loading) loading.style.display = 'none';
        if (errDiv) {
          errDiv.textContent    = t('bkErrorAvailability');
          errDiv.style.display  = 'block';
        }
      });
  }

  function selectSlot(btn, time) {
    _selectedTime = time;
    var slotsDiv = _calRoot.querySelector('.bk-cal-slots');
    slotsDiv.querySelectorAll('.bk-slot-btn').forEach(function (b) {
      b.style.background = 'white';
      b.style.color      = BK_ACCENT;
      b.style.borderColor = BK_ACCENT;
    });
    btn.style.background  = BK_ACCENT;
    btn.style.color       = 'white';
    var nextBtn = _step1.querySelector('.bk-next-btn');
    if (nextBtn) nextBtn.disabled = false;
  }

  // ── Step navigation ───────────────────────────────────────────────────────────

  function goToStep2() {
    if (!_selectedTime || !_selectedDate) return;
    document.getElementById('bk-step1').style.display = 'none';
    document.getElementById('bk-step2').style.display = 'block';
    var summary = document.getElementById('bk-summary');
    if (summary) {
      summary.innerHTML =
        '<strong>📅 ' + t('bkSummaryDate') + '</strong> ' + _selectedDate +
        ' &nbsp;|&nbsp; <strong>⌛ ' + t('bkSummaryTime') + '</strong> ' + _selectedTime;
    }
  }

  function goToStep1() {
    document.getElementById('bk-step2').style.display = 'none';
    document.getElementById('bk-step1').style.display = 'block';
  }

  function submitBooking() {
    var name     = document.getElementById('bk-name').value.trim();
    var email    = document.getElementById('bk-email').value.trim();
    var phone    = document.getElementById('bk-phone').value.trim();
    var guests   = parseInt(document.getElementById('bk-guests').value, 10);
    var language = document.getElementById('bk-language').value;
    var errDiv   = document.getElementById('bk-submit-error');
    errDiv.style.display = 'none';

    if (!name || !email || !phone || !guests || guests < 1) {
      errDiv.textContent   = t('bkErrorRequired');
      errDiv.style.display = 'block';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errDiv.textContent   = t('bkErrorInvalidEmail');
      errDiv.style.display = 'block';
      return;
    }

    var btn = document.getElementById('bk-submit-btn');
    btn.disabled    = true;
    btn.textContent = t('bkSending');

    apiFetch('/book', {
      method: 'POST',
      body:   JSON.stringify({
        tour:         _opts.tourId,
        date:         _selectedDate,
        time:         _selectedTime,
        name:         name,
        email:        email,
        phone:        phone,
        participants: guests,
        language:     language,
      }),
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.success) {
          document.getElementById('bk-step2').style.display = 'none';
          document.getElementById('bk-step3').style.display = 'block';
        } else {
          errDiv.textContent   = data.error || t('bkErrorBooking');
          errDiv.style.display = 'block';
          btn.disabled         = false;
          btn.textContent      = t('bkSubmitBtn');
        }
      })
      .catch(function () {
        errDiv.textContent   = t('bkErrorNetwork');
        errDiv.style.display = 'block';
        btn.disabled         = false;
        btn.textContent      = t('bkSubmitBtn');
      });
  }

  // ── Modal DOM builder ─────────────────────────────────────────────────────────

  // Rebuild #bk-step1 contents with the calendar widget.
  // Called once per modal open (after first init) — idempotent via _calRoot check.
  function buildStep1() {
    _step1 = document.getElementById('bk-step1');
    if (!_step1) return;

    // Clear old date-input markup, inject calendar root
    _step1.innerHTML = '';

    // Step heading
    var heading = document.createElement('h3');
    heading.setAttribute('data-i18n', 'bkStep1Title');
    heading.style.cssText = 'margin-top:0; margin-bottom:16px;';
    heading.textContent = t('bkStep1Title');
    _step1.appendChild(heading);

    // Calendar root
    _calRoot = document.createElement('div');
    _calRoot.className = 'bk-cal-root';

    // ── Calendar header ──
    var header = document.createElement('div');
    header.className = 'bk-cal-header';

    var prevBtn = document.createElement('button');
    prevBtn.className = 'bk-cal-nav bk-cal-prev';
    prevBtn.setAttribute('aria-label', t('bkCalPrevMonth'));
    prevBtn.innerHTML = '&#8249;';
    prevBtn.addEventListener('click', function () {
      if (_viewMonth <= 0) return;
      _viewMonth--;
      ensureMonthsCached(function () { renderCalendar(); });
    });

    var monthsRow = document.createElement('div');
    monthsRow.className = 'bk-cal-months-row';

    var nextBtn = document.createElement('button');
    nextBtn.className = 'bk-cal-nav bk-cal-next';
    nextBtn.setAttribute('aria-label', t('bkCalNextMonth'));
    nextBtn.innerHTML = '&#8250;';
    nextBtn.addEventListener('click', function () {
      _viewMonth++;
      ensureMonthsCached(function () { renderCalendar(); });
    });

    header.appendChild(prevBtn);
    header.appendChild(monthsRow);
    header.appendChild(nextBtn);

    // ── Loading overlay ──
    var loading = document.createElement('div');
    loading.className = 'bk-cal-loading';
    loading.textContent = t('bkCalLoading');
    loading.style.display = 'none';

    // ── Error area ──
    var errorEl = document.createElement('div');
    errorEl.className = 'bk-cal-error';
    errorEl.style.display = 'none';

    // ── Slot pills area ──
    var slotsWrap = document.createElement('div');
    slotsWrap.className = 'bk-cal-slots-wrap';
    slotsWrap.style.display = 'none';

    var slotsLabel = document.createElement('label');
    slotsLabel.className = 'bk-cal-slots-label';
    slotsLabel.textContent = t('bkCalSelectPrompt');

    var slotsDiv = document.createElement('div');
    slotsDiv.className = 'bk-cal-slots';

    var slotsLoading = document.createElement('div');
    slotsLoading.className = 'bk-cal-slots-loading';
    slotsLoading.style.display = 'none';
    slotsLoading.style.cssText += 'color:' + BK_ACCENT + '; font-size:.9rem; margin-top:6px;';
    slotsLoading.textContent = 'Loading slots…';

    var slotsError = document.createElement('div');
    slotsError.className = 'bk-cal-slots-error';
    slotsError.style.cssText = 'display:none; color:#e53e3e; font-size:.9rem; margin-top:6px;';

    slotsWrap.appendChild(slotsLabel);
    slotsWrap.appendChild(slotsDiv);
    slotsWrap.appendChild(slotsLoading);
    slotsWrap.appendChild(slotsError);

    // ── Continue button ──
    var contBtn = document.createElement('button');
    contBtn.className = 'book-btn bk-next-btn';
    contBtn.style.cssText = 'margin-top:20px; padding:12px 36px; font-size:1rem; display:block; width:100%;';
    contBtn.setAttribute('data-i18n', 'bkNextBtn');
    contBtn.textContent = t('bkNextBtn');
    contBtn.disabled = true;
    contBtn.addEventListener('click', goToStep2);

    _calRoot.appendChild(header);
    _calRoot.appendChild(loading);
    _calRoot.appendChild(errorEl);
    _calRoot.appendChild(slotsWrap);

    _step1.appendChild(_calRoot);
    _step1.appendChild(contBtn);
  }

  // Wire up the "Back" and "Confirm Booking" buttons in steps 2/3
  // (those buttons exist in static HTML with onclick= attributes, but we also
  //  expose goToStep1/submitBooking on window so the onclick= calls still work)
  function wireStep2Buttons() {
    var backBtn = document.querySelector('#bk-step2 button[onclick="goToStep1()"]');
    if (backBtn) {
      backBtn.removeAttribute('onclick');
      backBtn.addEventListener('click', goToStep1);
    }
    var submitBtn = document.getElementById('bk-submit-btn');
    if (submitBtn) {
      submitBtn.removeAttribute('onclick');
      submitBtn.addEventListener('click', submitBooking);
    }
    var doneBtn = document.querySelector('#bk-step3 button[onclick="closeBookingModal()"]');
    if (doneBtn) {
      doneBtn.removeAttribute('onclick');
      doneBtn.addEventListener('click', close);
    }
  }

  // ── Modal open / close / reset ────────────────────────────────────────────────

  function resetForm() {
    _selectedDate = null;
    _selectedTime = null;
    _viewMonth    = 0;

    document.getElementById('bk-step1').style.display = 'block';
    document.getElementById('bk-step2').style.display = 'none';
    document.getElementById('bk-step3').style.display = 'none';

    var submitBtn = document.getElementById('bk-submit-btn');
    if (submitBtn) {
      submitBtn.disabled    = false;
      submitBtn.textContent = t('bkSubmitBtn');
    }
    var submitErr = document.getElementById('bk-submit-error');
    if (submitErr) submitErr.style.display = 'none';
    var summary = document.getElementById('bk-summary');
    if (summary) summary.innerHTML = '';
    var langSel = document.getElementById('bk-language');
    if (langSel) langSel.value = _opts.lang();
  }

  function open() {
    if (!_modal) return;
    _modal.style.display      = 'block';
    document.body.style.overflow = 'hidden';
    resetForm();
    buildStep1();

    // Initial fetch: current month + next month in one call
    var ms0     = monthStart(0);
    var ms1     = monthStart(1);
    var fromD   = new Date(ms0.getFullYear(), ms0.getMonth(), 1);
    var lastDay = lastDayOfMonth(ms1.getFullYear(), ms1.getMonth());
    var toD     = new Date(ms1.getFullYear(), ms1.getMonth(), lastDay);
    // Clamp to horizon
    var hz = horizonDate();
    if (toD > hz) toD = hz;

    showCalLoading();

    fetchMonths(fromD, toD)
      .then(function () {
        hideCalLoading();
        renderCalendar();
      })
      .catch(function () {
        showCalError(function () {
          open();  // retry = re-open from scratch (resets state cleanly)
        });
      });
  }

  function close() {
    if (!_modal) return;
    _modal.style.display         = 'none';
    document.body.style.overflow = 'auto';
  }

  function destroy() {
    _opts         = null;
    _modal        = null;
    _step1        = null;
    _calRoot      = null;
    _selectedDate = null;
    _selectedTime = null;
    _viewMonth    = 0;
    _cache        = {};
    _cachedMonths = {};
    global.openBookingModal  = undefined;
    global.closeBookingModal = undefined;
  }

  // ── Public init ───────────────────────────────────────────────────────────────

  function init(options) {
    // Idempotent: if already initialised for the same modal, skip
    if (_opts && _opts.modalId === options.modalId) return;

    _opts  = options;
    _today = todayLocal();
    _cache        = {};
    _cachedMonths = {};
    _viewMonth    = 0;

    _modal = document.getElementById(options.modalId);
    if (!_modal) {
      console.error('[BookingModal] Modal element not found:', options.modalId);
      return;
    }

    wireStep2Buttons();

    // Close on backdrop click
    _modal.addEventListener('click', function (e) {
      if (e.target === _modal) close();
    });

    // Expose on window so existing onclick= attributes keep working
    global.openBookingModal  = open;
    global.closeBookingModal = close;

    // Also expose the step helpers for any inline onclick= that may call them
    global.goToStep1   = goToStep1;
    global.goToStep2   = goToStep2;
    global.submitBooking = submitBooking;
  }

  // ── Exports ───────────────────────────────────────────────────────────────────

  global.BookingModal = {
    init:    init,
    open:    function () { open(); },
    close:   function () { close(); },
    destroy: destroy,
  };

}(window));
