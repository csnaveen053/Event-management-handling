# Event Management

Calendar CRUD app (React + Vite frontend, FastAPI backend).

- **Local frontend:** http://localhost:5173
- **Live site:** https://event-management-handling.vercel.app

## Deploy on Vercel

The app lives in `event_management-main/frontend/`, not the repo root. Root `vercel.json` points Vercel at that folder so builds do not 404.

1. Push this repo to GitHub and import it in [Vercel](https://vercel.com).
2. Redeploy (no need to set Root Directory manually if `vercel.json` is present).
3. The `/events` API runs as Vercel serverless functions in `/api` (no separate backend deploy required).
4. Optional: set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` for persistent storage; optional `VITE_API_URL` only if the API is hosted elsewhere.

See [event_management-main/README.md](event_management-main/README.md) for local development.

# Project Structure (How folders are organized)

Event-management-handling/
├── api/                     ← Vercel serverless functions (backend on cloud)
├── event_management-main/
│   ├── frontend/            ← React + Vite app
│   └── backend/             ← FastAPI + SQLite (for local dev)
├── vercel.json              ← Tells Vercel where to find the frontend
└── package.json
