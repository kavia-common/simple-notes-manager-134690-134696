//
// Simple API service for interacting with the backend notes API,
// with a robust mock fallback if the backend is not reachable.
//
// PUBLIC_INTERFACE
export async function fetchNotes() {
  /** Fetch all notes from backend or mock store. */
  return requestWithMock("GET", "/notes");
}

// PUBLIC_INTERFACE
export async function createNote(note) {
  /** Create a new note with title and content. */
  return requestWithMock("POST", "/notes", note);
}

// PUBLIC_INTERFACE
export async function updateNote(id, updates) {
  /** Update an existing note by ID with given updates. */
  return requestWithMock("PUT", `/notes/${id}`, updates);
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete note by ID. */
  return requestWithMock("DELETE", `/notes/${id}`);
}

/**
 * Core request function that tries real backend first, falls back to mock.
 * Backend base URL is taken from env (REACT_APP_NOTES_API_URL). If not set,
 * will attempt to use relative path (for same-origin proxy setups).
 */
async function requestWithMock(method, path, body) {
  const base =
    process.env.REACT_APP_NOTES_API_URL && process.env.REACT_APP_NOTES_API_URL.trim().length > 0
      ? process.env.REACT_APP_NOTES_API_URL.trim().replace(/\/+$/, "")
      : "";

  const endpoint = `${base}${path}`;
  try {
    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: method === "GET" || method === "DELETE" ? undefined : JSON.stringify(body || {}),
    });

    if (!res.ok) {
      // If backend is unreachable or returns 5xx/4xx, throw to trigger mock
      throw new Error(`HTTP ${res.status}`);
    }
    if (method === "DELETE") {
      return { success: true };
    }
    return await res.json();
  } catch (_e) {
    // Fallback to mock
    return mockRequest(method, path, body);
  }
}

/**
 * In-memory mock store with localStorage persistence across reloads
 */
const LS_KEY = "notes_mock_store_v1";

function loadMock() {
  try {
    const data = JSON.parse(localStorage.getItem(LS_KEY) || "null");
    if (data && Array.isArray(data.notes)) {
      return data;
    }
  } catch {
    // ignore
  }
  // default seed data
  const seed = {
    notes: [
      {
        id: "1",
        title: "Welcome to Simple Notes",
        content:
          "This is a demo note. You can create, edit, and delete notes.\n\nIf the backend is not available, your notes are stored locally.",
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Tips",
        content:
          "- Click a note to edit\n- Use the + New Note button to create\n- Use the trash icon to delete\n- Changes save instantly",
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    ],
  };
  saveMock(seed);
  return seed;
}

function saveMock(state) {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

async function mockRequest(method, path, body) {
  // simulate latency
  await new Promise((r) => setTimeout(r, 120));

  const store = loadMock();
  if (method === "GET" && path === "/notes") {
    return store.notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }
  if (method === "POST" && path === "/notes") {
    const now = new Date().toISOString();
    const newNote = {
      id: uid(),
      title: (body?.title || "Untitled").trim(),
      content: body?.content || "",
      createdAt: now,
      updatedAt: now,
    };
    store.notes.unshift(newNote);
    saveMock(store);
    return newNote;
  }
  const match = path.match(/^\/notes\/(.+)$/);
  if (match) {
    const id = match[1];
    const idx = store.notes.findIndex((n) => n.id === id);
    if (idx === -1) {
      if (method === "DELETE") return { success: true };
      throw new Error("Not found");
    }
    if (method === "PUT") {
      const now = new Date().toISOString();
      store.notes[idx] = {
        ...store.notes[idx],
        ...body,
        updatedAt: now,
      };
      saveMock(store);
      return store.notes[idx];
    }
    if (method === "DELETE") {
      store.notes.splice(idx, 1);
      saveMock(store);
      return { success: true };
    }
  }
  throw new Error("Unsupported mock request");
}
