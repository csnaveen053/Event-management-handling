# Event Management — Calendar CRUD

A full-stack app to create, edit, delete, and view events on a calendar. Built with **FastAPI**, **SQLite**, **React (JavaScript)**, **react-calendar**, and **Shadcn UI** (forms, dialogs, buttons).

## Project structure

```
event-management/
├── backend/     # FastAPI + SQLite REST API
├── frontend/    # React + Vite + Shadcn UI
└── README.md
```

## Prerequisites

- Python 3.10+
- Node.js 18+

## Backend setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

- API: http://localhost:8000
- Swagger docs: http://localhost:8000/docs
- SQLite database: `backend/events.db` (created automatically)

### API endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/events` | Create event |
| GET | `/events` | List all events (optional `?date=YYYY-MM-DD`) |
| GET | `/events/{id}` | Get one event |
| PUT | `/events/{id}` | Update event |
| DELETE | `/events/{id}` | Delete event |

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

- App: http://localhost:5173
- API requests are proxied to `http://localhost:8000` in development (see `frontend/vite.config.js`).

## Usage

1. Start the backend, then the frontend.
2. Pick a date on the calendar.
3. Events for that day appear in the panel on the right.
4. Use **Add Event** to create an event (title and date required).
5. Click an event or the edit icon to update it.
6. Use the delete icon or **Delete Event** in the edit dialog to remove an event.

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `""` (uses Vite proxy in dev) | Backend base URL for production builds |
