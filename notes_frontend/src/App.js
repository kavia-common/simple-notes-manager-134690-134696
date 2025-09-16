import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import NotesList from "./components/NotesList";
import NoteEditor from "./components/NoteEditor";
import { createNote, deleteNote, fetchNotes, updateNote } from "./services/api";

// PUBLIC_INTERFACE
function App() {
  /**
   * Notes App root component: manages theme, notes state, selection, and CRUD actions.
   */
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Load notes on mount
  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchNotes()
      .then((data) => {
        if (!alive) return;
        setNotes(Array.isArray(data) ? data : []);
        // preselect first note
        if (Array.isArray(data) && data.length > 0) {
          setSelected(data[0]);
        }
      })
      .catch(() => {
        // handled in api with mock; still gracefully degrade
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggle between light and dark theme. */
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  const onCreate = async () => {
    setSaving(true);
    try {
      const newN = await createNote({ title: "Untitled", content: "" });
      setNotes((prev) => [newN, ...prev]);
      setSelected(newN);
    } finally {
      setSaving(false);
    }
  };

  const onSave = async (payload) => {
    if (!selected) return;
    setSaving(true);
    try {
      const updated = await updateNote(selected.id, {
        title: (payload.title || "").trim() || "Untitled",
        content: payload.content || "",
      });
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      setSelected(updated);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (note) => {
    const ok = window.confirm(`Delete "${note.title || "Untitled"}"? This cannot be undone.`);
    if (!ok) return;
    setSaving(true);
    try {
      await deleteNote(note.id);
      setNotes((prev) => prev.filter((n) => n.id !== note.id));
      if (selected?.id === note.id) {
        setSelected((prev) => {
          const remain = notes.filter((n) => n.id !== note.id);
          return remain.length ? remain[0] : null;
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        (n.title || "").toLowerCase().includes(q) ||
        (n.content || "").toLowerCase().includes(q)
    );
  }, [notes, query]);

  return (
    <div className="App">
      <div className="topbar">
        <div className="brand">
          <span className="logo">✎</span>
          <span>Simple Notes</span>
        </div>
        <div className="actions">
          <input
            type="search"
            placeholder="Search notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search notes"
            className="btn ghost"
            style={{ minWidth: 200 }}
          />
          <button
            className="btn"
            onClick={onCreate}
            disabled={saving}
            aria-label="Create new note"
            title="Create new note"
          >
            + New Note
          </button>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title="Toggle theme"
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
      </div>

      <div className="main">
        <NotesList
          notes={filtered}
          selectedId={selected?.id}
          onSelect={(n) => setSelected(n)}
          onDelete={onDelete}
        />
        <NoteEditor
          note={selected}
          onChange={() => {}}
          onSave={onSave}
          onCancel={() => setSelected(null)}
          saving={saving || loading}
        />
      </div>
    </div>
  );
}

export default App;
