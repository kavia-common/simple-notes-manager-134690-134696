import React, { useEffect, useRef, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * NoteEditor
 * Controlled editor for title and content with save/cancel buttons.
 */
export default function NoteEditor({
  note,
  onChange,
  onSave,
  onCancel,
  saving = false,
}) {
  const [local, setLocal] = useState(note || { title: "", content: "" });
  const titleRef = useRef(null);

  useEffect(() => {
    setLocal(note || { title: "", content: "" });
  }, [note?.id]); // reset when switching notes

  useEffect(() => {
    onChange?.(local);
  }, [local]); // notify parent for autosave or state

  useEffect(() => {
    if (titleRef.current && (!note?.title || note?.title === "Untitled")) {
      titleRef.current.focus();
    }
  }, [note?.id]);

  return (
    <div className="editor" role="main" aria-label="Note editor">
      {!note ? (
        <div className="placeholder">
          Select a note or create a new one to start editing.
        </div>
      ) : (
        <>
          <div className="editor-toolbar">
            <div className="left">
              <input
                ref={titleRef}
                className="title-input"
                placeholder="Note title"
                value={local.title || ""}
                onChange={(e) =>
                  setLocal((p) => ({ ...p, title: e.target.value }))
                }
                aria-label="Note title"
              />
            </div>
            <div className="right">
              <button
                className="btn"
                onClick={() => onCancel?.()}
                aria-label="Close editor"
                title="Close editor"
              >
                Close
              </button>
              <button
                className="btn primary"
                disabled={saving}
                onClick={() => onSave?.(local)}
                aria-label="Save note"
                title="Save note"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
          <textarea
            className="content-input"
            placeholder="Write your note here..."
            value={local.content || ""}
            onChange={(e) =>
              setLocal((p) => ({ ...p, content: e.target.value }))
            }
            aria-label="Note content"
          />
        </>
      )}
    </div>
  );
}
