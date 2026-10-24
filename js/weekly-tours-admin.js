(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  let token = '', etag = null, dirty = false;
  const endpoint = '/.netlify/functions/weekly-departures-admin';
  const status = (message, error = false) => { $('status').textContent = message; $('status').className = error ? 'error' : ''; };
  async function api(options = {}) {
    const response = await fetch(endpoint, { ...options, cache: 'no-store', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' } });
    const body = await response.json();
    if (!response.ok) throw new Error(response.status === 401 ? 'Неверный токен или доступ не настроен.' : response.status === 409 ? 'Расписание уже изменено в другой вкладке. Загрузите свежую версию с сервера.' : body.error || 'Ошибка сервера');
    return body;
  }
  function addRow(d = {}) {
    const card = document.createElement('article'); card.className = 'card'; card.dataset.id = d.id || `art-${crypto.randomUUID()}`;
    card.innerHTML = '<h2>Заезд</h2><div class="fields"><label>Начало<input name="startDate" type="date" required></label><label>Окончание (6-й день)<input name="endDate" type="date" required></label><label>Вместимость<input name="capacity" type="number" min="1" max="50" required></label><label>Свободных мест<input name="availableSeats" type="number" min="0" max="50"></label><label>Цена за человека, €<input name="priceEur" type="number" min="1" max="100000" required></label><label>Статус<select name="departureStatus"><option value="forming">Набор группы</option><option value="confirmed">Заезд подтверждён</option><option value="cancelled">Отменён</option></select></label></div><div class="actions"><label class="check"><input type="checkbox" name="published">Опубликован</label><button type="button" class="secondary duplicate">Дублировать</button></div>';
    const values = { startDate: '', endDate: '', capacity: 6, availableSeats: 6, priceEur: 1200, departureStatus: 'forming', published: false, ...d };
    for (const [name, value] of Object.entries(values)) {
      const input = card.querySelector(`[name="${name}"]`); if (!input) continue;
      if (input.type === 'checkbox') input.checked = value; else input.value = value ?? '';
    }
    card.querySelector('[name="startDate"]').addEventListener('change', e => {
      if (!e.target.value) return;
      const end = new Date(`${e.target.value}T12:00:00Z`); end.setUTCDate(end.getUTCDate() + 5);
      card.querySelector('[name="endDate"]').value = end.toISOString().slice(0, 10);
    });
    card.querySelector('.duplicate').onclick = () => {
      const copy = readRow(card); delete copy.id; copy.published = false;
      addRow(copy); dirty = true; status('Копия добавлена как черновик. Измените даты перед публикацией.');
    };
    $('rows').append(card);
  }
  function readRow(card) {
    const val = name => card.querySelector(`[name="${name}"]`).value;
    return { id: card.dataset.id, startDate: val('startDate'), endDate: val('endDate'), capacity: Number(val('capacity')), availableSeats: val('availableSeats') === '' ? null : Number(val('availableSeats')), priceEur: Number(val('priceEur')), departureStatus: val('departureStatus'), published: card.querySelector('[name="published"]').checked };
  }
  async function load() {
    status('Загружаем расписание…');
    const data = await api(); etag = data.etag; $('rows').replaceChildren(); data.departures.forEach(addRow); dirty = false;
    $('manager').hidden = false; $('login').hidden = true;
    status(data.updatedAt ? `Загружено. Последнее сохранение: ${new Date(data.updatedAt).toLocaleString('ru-RU', { timeZone: 'Europe/Paris' })} (Париж).` : 'Загружены стартовые заезды. Можно редактировать.');
  }
  $('login').onsubmit = async e => {
    e.preventDefault(); token = $('token').value.trim(); $('token').value = '';
    try { await load(); } catch (error) { token = ''; status(error.message, true); }
  };
  $('add').onclick = () => { addRow(); dirty = true; };
  $('schedule').oninput = () => { dirty = true; };
  $('schedule').onsubmit = async e => {
    e.preventDefault();
    const departures = Array.from($('rows').children, readRow);
    if (departures.some(d => d.availableSeats !== null && d.availableSeats > d.capacity)) { status('Свободных мест не может быть больше вместимости.', true); return; }
    $('save').disabled = true; $('add').disabled = true; $('reload').disabled = true; $('logout').disabled = true;
    const submitted = JSON.stringify(departures);
    status('Сохраняем…');
    try {
      const result = await api({ method: 'POST', body: JSON.stringify({ departures, etag }) });
      etag = result.etag;
      dirty = JSON.stringify(Array.from($('rows').children, readRow)) !== submitted;
      status(dirty ? 'Сохранено. Есть новые несохранённые изменения.' : 'Сохранено. Сайт показывает новое расписание при обновлении страницы.');
    } catch (error) { status(error.message, true); }
    finally { for (const id of ['save', 'add', 'reload', 'logout']) $(id).disabled = false; }
  };
  $('reload').onclick = async () => {
    if (dirty && !confirm('Загрузить с сервера и сбросить несохранённые изменения?')) return;
    try { await load(); } catch (error) { status(error.message, true); }
  };
  $('logout').onclick = () => {
    if (dirty && !confirm('Выйти без сохранения изменений?')) return;
    token = ''; etag = null; dirty = false; $('rows').replaceChildren(); $('manager').hidden = true; $('login').hidden = false; status('Вы вышли.');
  };
  window.addEventListener('beforeunload', e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });
})();
