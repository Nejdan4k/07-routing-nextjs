"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import type { NoteTag } from "@/types/note";
import css from "./CreateNote.module.css";

export default function CreateNote() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState<NoteTag>("Todo"); 

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setOpen(false);
      setTitle("");
      setContent("");
      setTag("Todo");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    
    mutate({ title, content, tag: tag as NoteTag });
  };

  return (
    <div className={css.container}>
      {!open ? (
        <button
          type="button"
          className={css.openButton}
          onClick={() => setOpen(true)}
        >
          Create note
        </button>
      ) : (
        <form onSubmit={handleSubmit} className={css.form}>
          <input
            type="text"
            value={title}
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            className={css.input}
            required
          />
          <textarea
            value={content}
            placeholder="Content"
            onChange={(e) => setContent(e.target.value)}
            className={css.textarea}
            required
          />
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value as NoteTag)} 
            className={css.select}
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Todo">Todo</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </select>

          <div className={css.actions}>
            <button type="submit" className={css.submitButton} disabled={isPending}>
              {isPending ? "Creating..." : "Add"}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}