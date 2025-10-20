# Deployment Guide

## Overview
This guide explains how to run and deploy the app in two ways:
- Docker Compose (recommended for all-in-one local/host deployment)
- Local development without Docker

The stack consists of:
- Frontend: React + Vite (`frontend/`)
- Backend: Node.js + Express (`backend/`)
- LLM: Ollama (pulls model `llama3.2` by default)

## Prerequisites
- Node.js 18+ and npm
- Git (optional)
- For Docker path: Docker Desktop (Windows/macOS) or Docker Engine + Docker Compose
- For local path: Ollama installed and running locally

## Environment Variables
Backend uses the following variables (with defaults):
- `PORT` (default `5000`)
- `OLLAMA_HOST` (default `http://localhost:11434`)
- `OLLAMA_MODEL` (default `llama3.2`)

When using Docker Compose, `api` is configured with `OLLAMA_HOST=http://ollama:11434` and `OLLAMA_MODEL=llama3.2`.

## Option A: Run with Docker Compose (Recommended)
1. Install and start Docker Desktop.
2. From the repository root, run:
```bash
docker compose up --build
```
3. Open the application:
- Web (static build): http://localhost:3000
- API: http://localhost:5000
- Ollama: http://localhost:11434

Notes:
- First run may take time to pull the `ollama/ollama` image and the LLM model on demand.
- You can change the model by editing `docker-compose.yml` (`OLLAMA_MODEL`).

### Managing the stack
- Stop: `Ctrl+C` in the terminal, or `docker compose down`
- Rebuild after changes: `docker compose up --build`
- View logs: `docker compose logs -f`

## Option B: Local Development (No Docker)
### 1) Start Ollama locally
- Install: https://ollama.com
- Start the service:
```bash
ollama serve
```
- (Optional, first run) Pull the default model:
```bash
ollama pull llama3.2
```
- Verify:
```bash
curl http://localhost:11434/api/version
```

### 2) Start the backend (API)
From `backend/`:
```bash
npm install
npm run dev
```
- The API listens on http://localhost:5000
- You can override `OLLAMA_HOST` and `OLLAMA_MODEL` via environment variables.

### 3) Start the frontend (UI)
From `frontend/`:
```bash
npm install
npm run dev
```
- The Vite dev server runs on http://localhost:5173
- Requests to `/api/*` are proxied to `http://localhost:5000` as defined in `frontend/vite.config.js`.

## Production Build without Docker
If you prefer to build and host manually:
- Frontend build (generates static files in `frontend/dist/`):
```bash
cd frontend
npm install
npm run build
```
- Serve `frontend/dist/` via a production web server (e.g., Nginx, Netlify, Vercel, or `vite preview`).
- Backend can be started with `node` or a process manager like PM2:
```bash
cd backend
npm install
npm run start
```
- Ensure an Ollama service is reachable by the backend via `OLLAMA_HOST`.

## Health Checks & Verification
- API health: `GET http://localhost:5000/api/health` → `{ "status": "ok" }`
- UI running: visit `http://localhost:5173` (dev) or `http://localhost:3000` (Docker)
- Ollama up: `GET http://localhost:11434/api/version`

## Troubleshooting
- "ECONNREFUSED 11434": Ollama is not running or not reachable. Start `ollama serve` or bring up the Docker stack.
- Port conflicts: Change Vite port in `frontend/vite.config.js` or backend `PORT` env var.
- Slow first response: The model may load on first use; subsequent calls are faster.
- Docker ‘version is obsolete’ warning: You can remove the `version:` field in `docker-compose.yml` (Compose v2 ignores it).

## Security & Hardening (Production)
- Put the API behind a reverse proxy (Nginx/Caddy) with TLS.
- Configure CORS restrictions on the API.
- Set appropriate timeouts and request size limits.
- Monitor Ollama and API logs; set resource limits for containers.
- Consider authentication if exposing the API publicly.

## File Map
- `backend/`: Express API (`src/index.js`, `src/routes/generateMeals.js`, `src/ollamaClient.js`)
- `frontend/`: React/Vite app (`vite.config.js`)
- `docker-compose.yml`: Orchestrates `ollama`, `api`, and `web`

## Change the Model
- Local dev: set `OLLAMA_MODEL` before starting backend
```bash
set OLLAMA_MODEL=llama3.2  # Windows PowerShell: $env:OLLAMA_MODEL = "llama3.2"
```
- Docker: edit `docker-compose.yml` `environment:` for the `api` service.

## Versioning
- Node.js dependencies defined in `backend/package.json` and `frontend/package.json`.
- Lockfiles are not included here; generate them on `npm install`.
