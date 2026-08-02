# Log Analysis Platform

Full-stack project for importing, processing, and analyzing application logs.

## Stack

- Backend: Node.js, Express, TypeScript, TypeORM, PostgreSQL
- Frontend: React, Vite, TypeScript, Tailwind CSS, Recharts
- Infra: Docker, Docker Compose

## Features

- Upload of log files in `.txt` and `.log` format
- Validation of log line format before import
- Storage in PostgreSQL
- Log listing with filters
- Statistics by log level and time window
- Dashboard for visual analysis

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
- Invalid log lines are rejected with a clear validation message.
