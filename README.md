# AI-Based Personalized Nutrition and Recipe Generator

A full-stack app that suggests meals based on health metrics and preferences using Node.js, Express, React, Docker, and Ollama.

## Quick Start (Docker)

1. Install Docker and Docker Compose.
2. From the repo root, run:

```bash
docker compose up --build
```

3. Open the web app at http://localhost:3000
4. The API is at http://localhost:5000, and Ollama at http://localhost:11434
5. The compose file sets `OLLAMA_MODEL=llama3.2`. You can change it in `docker-compose.yml`.

Note: The first run may pull the model on-demand and can take a while.

## Local Dev (no Docker)

- Start Ollama locally and ensure it's listening on http://localhost:11434
- Backend:
  - `cd backend`
  - `npm install`
  - copy `.env.example` to `.env` and adjust
  - `npm run dev`
- Frontend:
  - `cd frontend`
  - `npm install`
  - `npm run dev`
- Open http://localhost:5173 (Vite dev server). API proxies to http://localhost:5000.

## Structure

- `backend/` Express API (`/api/generate-meals`)
- `frontend/` React + Vite UI
- `docker-compose.yml` 3 services: `ollama`, `api`, `web`

## Configuration

- Backend env:
  - `PORT` default 5000
  - `OLLAMA_HOST` default http://localhost:11434
  - `OLLAMA_MODEL` default llama3.2

