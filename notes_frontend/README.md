# Simple Notes Frontend (React)

A lightweight React app for creating, editing, and managing notes. It talks to a backend over REST and gracefully falls back to an in-browser mock store when the backend is unavailable.

## Features

- List notes with quick previews
- Create new notes
- Edit title and content
- Delete notes with confirmation
- Search notes
- Light/Dark theme toggle
- Mock fallback: works fully offline with localStorage
- Accessible controls and keyboard-friendly

## Getting Started

Install dependencies and run:

- `npm start` — start dev server
- `npm test` — run tests
- `npm run build` — production build

Open http://localhost:3000 to use the app.

## Backend Integration

By default, the app uses an in-browser mock if the backend is not reachable. To connect to a backend, set the base URL:

1. Copy `.env.example` to `.env`:
   ```
   REACT_APP_NOTES_API_URL=http://localhost:8000
   ```
2. Ensure the backend exposes these endpoints:
   - GET `/notes` -> returns array of notes
   - POST `/notes` -> accepts `{ title, content }`, returns created note
   - PUT `/notes/:id` -> accepts `{ title, content }`, returns updated note
   - DELETE `/notes/:id` -> returns 200 on success

Note: Do not commit your `.env` with secrets. The variable is read at build time.

## Data Model

A note has:
```json
{
  "id": "string",
  "title": "string",
  "content": "string",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

## Project Structure

- `src/services/api.js` — API client with mock fallback
- `src/components/NotesList.js` — list of notes
- `src/components/NoteEditor.js` — editor UI
- `src/utils/format.js` — formatting helpers
- `src/App.js` — root UI and state

## License

MIT
