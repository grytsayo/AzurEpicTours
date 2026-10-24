(() => {
  'use strict';
  const translations = window.weeklyTourTranslations;
  const $ = id => document.getElementById(id);
  let lang = 'en';
  try { lang = localStorage.getItem('selectedLanguage') || 'en'; } catch {}
  if (!translations[lang]) lang = 'en';
  let departures = [], loadState = 'loading', selected = null;
  const tr = key => translations[lang][key];
  const locale = () => ({ en: 'en-GB', ru: 'ru-RU', fr: 'fr-FR' })[lang];
  const money = value => new Intl.NumberFormat(locale(), { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  function dates(d) {
    const format = new Intl.DateTimeFormat(locale(), { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
    return format.formatRange(new Date(`${d.startDate}T12:00:00Z`), new Date(`${d.endDate}T12:00:00Z`));
  }
  function node(tag, text, className) {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
  }
  function renderDepartures() {
    const container = $('departures');
    container.replaceChildren();
    if (loadState !== 'ready' || !departures.length) {
      const box = node('div', undefined, 'empty-state');
      box.append(node('h3', tr(loadState === 'loading' ? 'loading' : loadState === 'error' ? 'error' : 'empty')));
      if (loadState !== 'loading') {
        box.append(node('p', tr('emptyText')));
        const button = node('button', tr('ask'));
        button.type = 'button'; button.onclick = () => openRequest(null); box.append(button);
      }
      container.append(box); return;
    }
    for (const d of departures) {
      const card = node('article', undefined, 'departure');
      const full = d.availableSeats === 0;
      const low = d.availableSeats !== null && d.availableSeats <= 2 && !full;
      const availability = d.availableSeats === null ? tr('onRequest') : full ? tr('full') : tr(low ? 'low' : 'available').replace('{n}', d.availableSeats);
      card.append(node('span', availability, `badge ${full ? 'full' : low ? 'low' : ''}`));
      card.append(node('h3', dates(d)));
      card.append(node('p', tr(d.departureStatus === 'confirmed' ? 'confirmed' : 'forming'), 'date-note'));
      card.append(node('div', money(d.priceEur), 'price'), node('div', tr('room'), 'note'));
      const button = node('button', tr(full ? 'waitlist' : 'request'), full ? 'secondary' : '');
      button.type = 'button'; button.onclick = () => openRequest(d); card.append(button); container.append(card);
    }
  }
  function updateContactLinks() {
    const input = $('guests');
    const valid = input.checkValidity();
    const dateText = selected ? dates(selected) : tr('unspecified');
    const message = tr(selected?.availableSeats === 0 ? 'waitMessage' : 'message').replace('{dates}', dateText).replace('{n}', input.value);
    $('contact-whatsapp').href = `https://wa.me/33624729983?text=${encodeURIComponent(message)}`;
    $('contact-email').href = `mailto:azurepictours@gmail.com?subject=${encodeURIComponent(tr('subject'))}&body=${encodeURIComponent(message)}`;
    for (const id of ['contact-email', 'contact-whatsapp']) $(id).setAttribute('aria-disabled', String(!valid));
  }
  function renderDialog() {
    $('request-title').textContent = tr(selected?.availableSeats === 0 ? 'waitlist' : selected ? 'request' : 'ask');
    $('selected').textContent = selected ? `${dates(selected)} · ${money(selected.priceEur)} / ${tr('per')}` : tr('unspecified');
    updateContactLinks();
  }
  function openRequest(d) {
    selected = d;
    $('guests').value = '1';
    $('guests').max = d?.availableSeats > 0 ? d.availableSeats : 50;
    renderDialog(); $('request').showModal();
  }
  function changeLanguage(next) {
    if (!translations[next]) return;
    lang = next;
    try { localStorage.setItem('selectedLanguage', lang); } catch {}
    document.documentElement.lang = lang;
    document.title = tr('meta');
    document.querySelector('meta[name="description"]').content = tr('description');
    document.querySelector('meta[property="og:title"]').content = tr('meta');
    document.querySelector('meta[property="og:description"]').content = tr('description');
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = tr(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', tr(el.dataset.i18nAria)); });
    document.querySelectorAll('[data-lang]').forEach(el => {
      const active = el.dataset.lang === lang;
      el.setAttribute('aria-pressed', String(active));
      el.classList.toggle('active', active);
    });
    renderDepartures(); renderDialog();
  }
  document.querySelectorAll('[data-lang]').forEach(button => button.onclick = () => changeLanguage(button.dataset.lang));
  document.querySelector('.close').onclick = () => $('request').close();
  $('guests').oninput = updateContactLinks;
  for (const id of ['contact-email', 'contact-whatsapp']) $(id).onclick = e => {
    if (!$('guests').reportValidity()) e.preventDefault();
  };
  changeLanguage(lang);
  async function load() {
    try {
      const response = await fetch('/.netlify/functions/weekly-departures', { cache: 'no-store', signal: AbortSignal.timeout(12000) });
      if (!response.ok) throw new Error('Availability unavailable');
      const data = await response.json();
      if (!Array.isArray(data.departures)) throw new Error('Invalid response');
      departures = data.departures; loadState = 'ready';
    } catch { loadState = 'error'; }
    renderDepartures();
  }
  load();
  // Returning to the page refreshes manually managed availability.
  document.addEventListener('visibilitychange', () => { if (!document.hidden) load(); });
})();
