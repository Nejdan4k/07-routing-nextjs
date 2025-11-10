import type { Note } from "@/types/note";
import css from "./NotePreview.module.css";

interface NotePreviewProps {
  note: Note | null;
  onBack: () => void;
}

export default function NotePreview({ note, onBack }: NotePreviewProps) {
  if (!note) return <p>Note not found.</p>;

  return (
    <div className={css.preview}>
      <button onClick={onBack} className={css.backBtn}>
        ← Back
      </button>

      <h2 className={css.title}>{note.title}</h2>
      <p className={css.content}>{note.content}</p>

      <div className={css.meta}>
        <small>Created: {new Date(note.createdAt).toLocaleString()}</small>
        <small>Updated: {new Date(note.updatedAt).toLocaleString()}</small>
      </div>
    </div>
  );
}