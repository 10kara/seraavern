# Jedi Archives v7 — HoloPanel

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
- настраивает Storage policies для bucket `archive`.

Bucket `archive` создайте как Public в Supabase Storage.

## Таблицы
`character`: id, name, first_name, last_name, species, age, height, homeworld, status, callsign, summary, appearance, personality, preferences, dislikes, motivation, image_url.

`chapters`: id, created_at, title, chapter_number, content, cover_image, published.

`relationships`: id, name, role, relation, quote.

`gallery`: id, created_at, title, caption, image_url, sort_order.

Возраст и рост хранятся числовыми значениями. Интерфейс форматирует их как `3 стандартных года` и `72 см`.

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
