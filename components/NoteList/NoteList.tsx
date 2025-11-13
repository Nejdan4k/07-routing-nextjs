"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote, type PaginatedNotesResponse } from "@/lib/api";
import type { Note } from "@/types/note";
import css from "./NoteList.module.css";

export interface NoteListProps {
  notes: Note[];
  enableDelete?: boolean;
}

export default function NoteList({
  notes,
  enableDelete = true,
}: NoteListProps) {
  const qc = useQueryClient();

  const {
    mutate,
    isPending,
    variables: deletingId,
    isError,
    error,
  } = useMutation({
    mutationFn: (id: string | number) => deleteNote(String(id)),

    
    onMutate: async (id: string | number) => {
      await qc.cancelQueries({ queryKey: ["notes"] });

      const prev = qc.getQueriesData<PaginatedNotesResponse>({
        queryKey: ["notes"],
      });

      prev.forEach(([key, data]) => {
        if (!data) return;
        qc.setQueryData<PaginatedNotesResponse>(key, {
          ...data,
          notes: data.notes.filter((n) => String(n.id) !== String(id)),
        });
      });

      return { prev };
    },

    
    onError: (_err, _id, ctx) => {
      if (!ctx?.prev) return;
      ctx.prev.forEach(([key, data]) => {
        qc.setQueryData(key, data);
      });
    },

    
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  if (!notes?.length) return <p>No notes found.</p>;

  return (
    <ul className={css.list}>
      {notes.map((n) => {
        const pending = isPending && String(deletingId) === String(n.id);

        return (
          <li key={n.id} className={css.listItem}>
            <h3 className={css.title}>{n.title}</h3>
            <p className={css.content}>{n.content}</p>

            <div className={css.footer}>
              
              <div className={css.tagsContainer}>
                {n.tags?.length > 0 ? (
                  n.tags.map((t) => (
                    <span key={t} className={css.tag} title={t}>
                      {t}
                    </span>
                  ))
                ) : (
                  <span className={css.tag}>No tag</span>
                )}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <Link className={css.link} href={`/notes/${n.id}`}>
                  View details
                </Link>

                {enableDelete && (
                  <button
                    className={css.button}
                    onClick={() => mutate(n.id)}
                    disabled={pending}
                    aria-busy={pending}
                  >
                    {pending ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>
            </div>

            {isError && String(deletingId) === String(n.id) && (
              <p className={css.error}>
                {(error as Error)?.message ?? "Failed to delete note"}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}