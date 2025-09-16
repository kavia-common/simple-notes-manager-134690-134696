import React from "react";
import { formatDate, truncate } from "../utils/format";

/**
 * PUBLIC_INTERFACE
 * NotesList
 * Renders a list of notes with selection and delete controls.
 */
export default function NotesList({ notes, selectedId, onSelect, onDelete }) {
  return (
    <div className="notes-list" role="navigation" aria-label="Notes list">
      <div className="list-header">
        <span className="muted">Notes</span>
        <span className="count" aria-label={`Total notes ${notes.length}`}>{notes.length}</span>
      </div>
      {notes.length === 0 && (
        <div className="empty">No notes yet. Create your first note!</div>
      )}
      <ul>
        {notes.map((n) => (
          <li key={n.id} className={n.id === selectedId ? "active" : ""}>
            <button
              className="note-item"
              onClick={() => onSelect?.(n)}
              aria-current={n.id === selectedId ? "true" : "false"}
            >
              <div className="title-row">
                <span className="title">{n.title || "Untitled"}</span>
                <span className="date" title={n.updatedAt}>
                  {formatDate(n.updatedAt)}
                </span>
              </div>
              <div className="preview">{truncate(n.content || "")}</div>
            </button>
            <button
              className="icon danger"
              title="Delete note"
              aria-label={`Delete note ${n.title || "Untitled"}`}
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(n);
              }}
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
