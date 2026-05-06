# Habits

A full-stack habit tracking application with daily completion tracking, visual analytics, and MQTT-based event logging.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Recharts, React Query
- **Backend**: Node.js, Express, TypeScript, PostgreSQL
- **Infrastructure**: Docker Compose, Grafana

## Getting Started

### Prerequisites

- Docker & Docker Compose

### Setup

1. Clone the repo and copy the environment file:

```bash
cp .env.example .env
```

2. Start all services:

```bash
docker compose up -d
```

This starts PostgreSQL, the backend server, and the frontend (served via Nginx).

- **Frontend**: http://localhost
- **Server API**: http://localhost:3001
- **Grafana** (if configured): http://localhost:3000

### Development

#### Backend

```bash
cd server
npm install
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
├── server/          # Express API server
├── frontend/        # React + Vite client
├── grafana/         # Grafana provisioning configs
├── schema.sql       # PostgreSQL schema & seed data
├── docker-compose.yml
└── .env.example
```

## License

MIT
