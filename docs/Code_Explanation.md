# Code Explanation

## Overview
- **Purpose**: Generate personalized meal plans using an LLM (Ollama) with a React frontend and an Express backend.
- **Tech stack**: React + Vite (`frontend/`), Node.js + Express (`backend/`), optional Docker Compose (`docker-compose.yml`).

## High-level Architecture
```mermaid
flowchart LR
  UI[Frontend (React/Vite)] -- /api/* --> API[Backend (Express)]
  API -- chat --> OLLAMA[(Ollama LLM)]
```

- **Frontend** (`frontend/`):
  - Vite dev server on `http://localhost:5173` with proxy for `/api` to `http://localhost:5000` configured in `frontend/vite.config.js`.
  - React components collect user inputs (age, sex, height, weight, preferences) and call `POST /api/generate-meals`.

- **Backend** (`backend/`):
  - Entry: `backend/src/index.js` starts Express, sets JSON parsing, CORS, and routes under `/api`.
  - Health check: `GET /api/health` returns `{ status: 'ok' }`.
  - Meal generation route: `backend/src/routes/generateMeals.js` validates input with `Joi`, builds a prompt, calls `chatWithOllama()` and returns the model output.
  - Ollama client: `backend/src/ollamaClient.js` reads `OLLAMA_HOST` (default `http://localhost:11434`) and `OLLAMA_MODEL` (default `llama3.2`), and posts to `/api/chat` with a simple system+user message.

- **Docker** (`docker-compose.yml`):
  - `ollama` service exposes `11434`.
  - `api` builds `./backend`, exposes `5000`, links to `ollama` via `OLLAMA_HOST=http://ollama:11434`.
  - `web` builds `./frontend`, serves static build via a web server on port `3000`.

## Key Files
- `backend/src/index.js`: Express app setup and server listen.
- `backend/src/routes/generateMeals.js`: Input schema, prompt builder, route handler.
- `backend/src/ollamaClient.js`: Axios client to Ollama Chat API.
- `frontend/vite.config.js`: Vite dev server port and API proxy.
- `docker-compose.yml`: Multi-service orchestration for `ollama`, `api`, `web`.

## Request Flow
1. User submits preferences in the frontend.
2. Frontend calls `POST /api/generate-meals` with JSON body.
3. Backend validates with Joi and builds a domain prompt.
4. Backend calls Ollama Chat (`/api/chat`) with `model=OLLAMA_MODEL`.
5. Response content is returned to the frontend and rendered as markdown.

## Environment Variables
- Backend:
  - `PORT` (default `5000`).
  - `OLLAMA_HOST` (default `http://localhost:11434`).
  - `OLLAMA_MODEL` (default `llama3.2`).

## Error Handling
- Validation errors return `400` with Joi `details`.
- Upstream errors (e.g., Ollama not reachable) return `500` with `details`.

## Extensibility Tips
- Add more routes in `backend/src/routes/` and mount in `index.js`.
- Adjust prompt composition in `buildPrompt()` to change tone/format.
- Swap models by setting `OLLAMA_MODEL`.
- Add auth/middleware by extending Express setup before routes.
