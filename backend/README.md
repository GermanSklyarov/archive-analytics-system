# Backend

Backend-часть системы анализа архивных данных на `NestJS`.

## Что здесь есть

- REST API для пользователей, архивных записей, аналитики и сохраненных результатов;
- импорт файлов `CSV/XLSX`;
- Swagger-документация;
- интеграция с PostgreSQL через `TypeORM`.

## Быстрый старт

```bash
npm install
npm run start:dev
```

## Полезные команды

```bash
npm test
npm run build
npm run test:e2e
```

## Документация API

После запуска Swagger доступен по адресу:

```text
http://localhost:3000/api/docs
```

Подробное описание проекта и всех endpoint'ов находится в корневом [README](../README.md).
