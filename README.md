# Archive Analytics System

Система для загрузки, хранения и анализа архивных данных. Проект состоит из фронтенда на `React + Vite + react-admin` и бэкенда на `NestJS + TypeORM + PostgreSQL`.

## Возможности

- импорт `CSV/XLSX` с предварительным просмотром;
- автоматическое и ручное сопоставление колонок;
- валидация строк до загрузки;
- хранение архивных записей в PostgreSQL;
- аналитика по датам, категориям и сводным показателям;
- история выполненных аналитических запросов.

## Стек

- Frontend: `React 19`, `TypeScript`, `Vite`, `Material UI`, `react-admin`, `Recharts`
- Backend: `NestJS`, `TypeScript`, `TypeORM`, `Swagger`
- Database: `PostgreSQL 17`
- Infrastructure: `Docker Compose`

## Структура проекта

```text
archive-analytics-system/
├── backend/     # REST API, Swagger, бизнес-логика, работа с БД
├── frontend/    # административный интерфейс и дашборд
└── docker-compose.yml
```

## Запуск

### 1. Поднять PostgreSQL

```bash
docker compose up -d
```

### 2. Настроить переменные окружения для backend

Создай файл `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=archive_db
PORT=3000
```

### 3. Установить зависимости

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4. Запустить backend

```bash
cd backend
npm run start:dev
```

API будет доступно по адресу `http://localhost:3000/api`, Swagger UI по адресу `http://localhost:3000/api/docs`.

### 5. Запустить frontend

```bash
cd frontend
npm run dev
```

Интерфейс будет доступен по адресу `http://localhost:5173`.

## Основные сущности

- `users` — пользователи системы;
- `archive-records` — импортированные архивные записи;
- `analytics` — журнал аналитических запросов;
- `results` — сохраненные результаты аналитики.

## API

### Users

- `GET /api/users` — список пользователей с пагинацией и сортировкой
- `POST /api/users` — создание пользователя
- `GET /api/users/:id` — получить пользователя
- `PATCH /api/users/:id` — обновить пользователя
- `DELETE /api/users/:id` — удалить пользователя
- `DELETE /api/users` — массовое удаление пользователей

### Archive Records

- `GET /api/archive-records` — список записей с фильтрами
- `GET /api/archive-records/meta` — справочник тегов и единиц измерения
- `GET /api/archive-records/:id` — получить одну запись
- `POST /api/archive-records` — создать запись вручную
- `PATCH /api/archive-records/:id` — обновить запись
- `DELETE /api/archive-records/:id` — удалить запись
- `DELETE /api/archive-records` — массовое удаление
- `POST /api/archive-records/preview` — сырой предпросмотр файла
- `POST /api/archive-records/preview-with-mapping` — предпросмотр после маппинга
- `POST /api/archive-records/import` — импорт файла в систему

### Analytics

- `GET /api/analytics/average` — среднее значение по фильтрам
- `GET /api/analytics/by-category` — аналитика по категориям
- `GET /api/analytics/by-date` — аналитика по датам
- `GET /api/analytics/summary` — сводные показатели
- `GET /api/analytics/requests/stats` — статистика аналитических запросов

### Results

- `GET /api/results` — история сохраненных результатов
- `GET /api/results/:id` — получить результат по id
- `GET /api/results/by-request/:requestId` — получить результат по id запроса
- `DELETE /api/results` — массовое удаление результатов

## Примеры сценариев

### Импорт данных

1. Пользователь загружает `CSV` или `XLSX`.
2. Система показывает сырой предпросмотр и пытается автоматически определить колонки.
3. Пользователь при необходимости настраивает маппинг вручную.
4. Система выполняет проверку данных и показывает ошибки.
5. После подтверждения валидные строки сохраняются в БД.

### Аналитика

1. Пользователь выбирает фильтры на дашборде.
2. API считает сводные метрики и агрегаты.
3. Результат сохраняется в журнале.
4. Пользователь может открыть сохраненный результат и повторно перейти к исходным данным.

## Качество и проверка

```bash
cd backend
npm test
npm run build

cd ../frontend
npm run build
```

## Swagger

Swagger содержит описание:

- query-параметров фильтрации и пагинации;
- DTO для создания и обновления сущностей;
- ответов аналитических и импортных endpoint'ов;
- multipart endpoint'ов для предпросмотра и импорта файлов.

## Примечания

- Для простоты разработки в проекте включен `synchronize: true` в TypeORM. Для production-сценария лучше перейти на миграции.
- В текущей реализации пользователь берется из `req.user` с безопасным fallback, без полноценной аутентификации.
