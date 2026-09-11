# Jedi Archives v12 — GitHub Pages / HoloPanel

Полная рабочая версия архива Серы Аверн.

## Запуск
```bash
npm install
npm run dev
```

## .env
Скопируйте `.env.example` в `.env` и укажите:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- при необходимости `VITE_ADMIN_EMAIL`

Пароль администратора в проект не записывается. Авторизация выполняется через Supabase Auth.

## Supabase
Выполните `SUPABASE_POLICIES.sql` целиком. Скрипт:
- включает RLS;
- настраивает публичное чтение;
- разрешает изменения авторизованному пользователю;
- создаёт таблицу `gallery`, если её нет;
- добавляет координаты узлов и таблицу `character_links` для связей между персонажами;
- настраивает Storage policies для bucket `archive`.

Для уже настроенного проекта можно отдельно повторно выполнить `NETWORK_SCHEMA.sql` —
это безопасная миграция тех же колонок и таблицы сети. Bucket `archive` создайте как Public в Supabase Storage.

## Таблицы
`character`: id, name, first_name, last_name, species, age, height, homeworld, status, callsign, summary, appearance, personality, preferences, dislikes, motivation, image_url.

`chapters`: id, created_at, title, chapter_number, content, cover_image, published.

`relationships`: id, name, role, relation, quote, image_url, holo_effect,
`pos_x`, `pos_y`, `group_tag`.

`character_links`: id, from_id, to_id, link_type, note. `from_id` и `to_id`
ссылаются на записи `relationships`; порядок пары хранится как `from_id < to_id`.

`gallery`: id, created_at, title, caption, image_url, sort_order.

Возраст и рост хранятся числовыми значениями. Интерфейс форматирует их как `3 стандартных года` и `72 см`.

### Сеть персонажей
В админ-панели откройте вкладку «Сеть связей»:
1. В матрице отметьте пересечение двух персонажей, чтобы создать прямую связь между ними.
2. Перетащите узел мышью по карте — координаты сохраняются в `relationships.pos_x` и `relationships.pos_y` после отпускания кнопки.
3. «ПО КРУГУ» расставляет выбранную группу, а «АВТО» сбрасывает её координаты к секторной раскладке.
На публичной странице «Взаимоотношения» голубые линии показывают связи с Серой,
фиолетовые — связи между остальными персонажами.

## v7
- улучшенная HoloPanel-разметка и фоновые HUD-линии;
- линии находятся позади текста и карточек;
- полное имя Сера Аверн корректно собирается из `name` или `first_name` + `last_name`;
- пустые таблицы Supabase не затирают локальные записи;
- главы можно добавлять, редактировать, публиковать/скрывать и удалять;
- отношения можно добавлять, редактировать и удалять;
- галерея поддерживает таблицу `gallery` и основной портрет;
- админка защищена Supabase Auth.


## V8 data source fix
When Supabase is configured, the database is authoritative. The UI no longer silently replaces empty database results with hardcoded character/history/relationship content. Character updates verify that Supabase actually returned an updated row and report RLS/missing-record errors.

## V9 fixes
- Character save no longer sends unsupported `appearance`, `personality`, `preferences`, `dislikes`, `motivation`, `callsign`, `first_name`, or `last_name` columns.
- Storage bucket is configurable with `VITE_SUPABASE_STORAGE_BUCKET` and defaults to `archive`.
- Run `SUPABASE_STORAGE.sql` once in Supabase SQL Editor to create the bucket and authenticated upload/update/delete policies.

## V10 Datapad Glitch
Added layered datapad interference, large background HUD scan lines, rare scan glitches, heading slice effects, terminal button sweeps and status flicker. Decorative effects are behind panel content so they do not obscure readable text.


## v11 GitHub Pages
- Исправлен `base` Vite для репозитория `seraavern`: `/seraavern/`.
- React Router использует базовый путь автоматически, поэтому переходы не уходят на `https://10kara.github.io/character`.
- В сборку добавляется `404.html`, чтобы прямое открытие `/seraavern/character`, `/history`, `/relationships`, `/gallery` и `/admin` не давало 404.
- GitHub Actions собирает проект напрямую и передаёт Supabase-переменные из Secrets.
- Storage bucket берётся из `VITE_SUPABASE_STORAGE_BUCKET`, по умолчанию `archive`.

## v12 чистка карты связей + голо-курсор
- На «Взаимоотношениях» убраны декоративный узел `СЕРА АВЕРН` (чёрная плашка
  `.relation-node` поверх карточек) и пунктирные связи `.relation-lines`;
  классы `.relation-map/.relation-node/.relation-lines` удалены из стилей,
  сетка `.relations` осталась как есть.
- Системный курсор скрыт (`html.cursor-custom ... cursor:none`), виден только
  голо-орб `.cursor-orb`. Компонент `Cursor` ведёт его по `clientX/clientY`
  через `transform` + `requestAnimationFrame` (без задержки и без расчёта от
  `--mx/--my`), реагирует на наведение (кнопки, ссылки, карточки), текст в
  полях (вертикальная засветка) и нажатие.
- Орб рендерится порталом в `document.body`, поэтому `overflow:hidden` и
  `filter` у `.shell` (force-mode) не ломают `position:fixed`.
- Тема `imperial` (клавиша `T`) зеркалится на `<html>`, чтобы орб перекрашивался.
- На устройствах без точного указателя (`(hover:hover) and (pointer:fine)`
  не совпало) системный курсор не скрывается и орб не показывается.
