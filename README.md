# Log Analysis Platform

Full-stack project for importing, processing, and analyzing application logs.

## Stack

- Backend: Node.js, Express, TypeScript, TypeORM, PostgreSQL
- Frontend: React, Vite, TypeScript, Tailwind CSS, Recharts
- Infra: Docker, Docker Compose

## Architecture decisions

The solution keeps the existing layered structure intact: Express routes delegate to controllers, services handle import/query logic, repositories apply TypeORM filters and aggregations, and the frontend consumes the same API contract already in use. This preserves the current architecture while adding the minimum required extensions for date filtering, trend analysis and resilient imports.

## Features

- Upload of log files in `.txt` and `.log` format
- Validation of log line format during import without interrupting the full batch
- Storage in PostgreSQL
- Log listing with filters, search and date range filtering
- Statistics by log level and time window
- Dashboard with trend visualization and existing charts preserved

## API examples

### List logs with date range

```http
GET /api/logs?level=ERROR&search=database&startDate=2026-08-01&endDate=2026-08-31&page=1&limit=20
```

### Dashboard trends

```http
GET /api/dashboard/trends
```

Response example:

```json
[
  { "period": "2026-08-01", "count": 53 },
  { "period": "2026-08-02", "count": 71 }
]
```

### Upload response

```json
{
  "imported": 2500,
  "ignored": 12,
  "durationMs": 143
}
```

## Services

- API: http://localhost:3001
- Swagger: http://localhost:3001/api-docs
- Frontend: http://localhost:5173
- PostgreSQL: localhost:5432

## Install dependencies and run with Docker Compose

Install the dependencies for both apps:

```powershell
cd api
npm install

cd ../web
npm install
```

From the project root, start the application with Docker Compose:

```powershell
cd ..
docker-compose up --build
```

## Local development

### 1) backend

```bash
cd api
npm install
npm run dev
```

### 2) frontend

```bash
cd web
npm install
npm run dev
```

## Supported log format

Each line must follow this pattern:

```txt
YYYY-MM-DD HH:MM:SS LEVEL Message
```

Example:

```txt
2026-08-02 10:15:32 INFO User authenticated successfully
2026-08-02 10:15:40 WARN Payment service timeout
2026-08-02 10:16:01 ERROR Database connection failed
```

## Environment variables

API configuration uses environment variables such as:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=logdb
DB_SCHEMA=public
```

Frontend can optionally use:

```env
VITE_API_URL=http://localhost:3001/api
```

## Notes

- The project is intended to be run with Docker for the fastest setup.
- Use the file import flow to add log batches to PostgreSQL.
- Invalid log lines are skipped individually and counted in the ignored total instead of aborting the whole import.
- The application returns structured HTTP errors for invalid files, invalid params and invalid dates.
