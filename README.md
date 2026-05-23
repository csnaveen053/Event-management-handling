# Event Management

Calendar CRUD app (React + Vite frontend, FastAPI backend).

- **Local frontend:** http://localhost:5173
- **Live site:** https://event-management-handling.vercel.app

## Deploy on Vercel

The app lives in `event_management-main/frontend/`, not the repo root. Root `vercel.json` points Vercel at that folder so builds do not 404.

1. Push this repo to GitHub and import it in [Vercel](https://vercel.com).
2. Redeploy (no need to set Root Directory manually if `vercel.json` is present).
3. Deploy the **backend** separately (Render, Railway, etc.) — Vercel only hosts the static frontend.
4. In Vercel → **Settings → Environment Variables**, set `VITE_API_URL` to your API base URL (e.g. `https://your-api.onrender.com`).

See [event_management-main/README.md](event_management-main/README.md) for local development.
