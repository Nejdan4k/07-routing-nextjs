"use client";

import Link from "next/link";
import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { deleteNote, type PaginatedNotesResponse } from "@/lib/api";
import type { Note } from "@/types/note";
import css from "./NoteList.module.css";

export interface NoteListProps {
  notes: Note[];
  enableDelete?: boolean;
}

// Допоміжне: беремо універсальний id без any
function getNoteId(n: Note): string {
  return String(n.id ?? n._id ?? "");
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
  } = useMutation<
    // TData
    unknown,
    // TError
    AxiosError,
    // TVariables
    string,
    // TContext
    { prev: Array<[QueryKey, PaginatedNotesResponse | undefined]> }
  >({
    mutationFn: (id: string) => deleteNote(id),

    // оптимістичне видалення
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ["notes"] });

      const prev = qc.getQueriesData<PaginatedNotesResponse>({
        queryKey: ["notes"],
      });

      prev.forEach(([key, data]) => {
        if (!data) return;
        qc.setQueryData<PaginatedNotesResponse>(key, {
          ...data,
          notes: data.notes.filter((n) => getNoteId(n) !== id),
        });
      });

      return { prev: prev as Array<[QueryKey, PaginatedNotesResponse | undefined]> };
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
        const noteId = getNoteId(n);
        const pending = isPending && String(deletingId) === noteId;

        return (
          <li key={noteId} className={css.listItem}>
            <h3 className={css.title}>{n.title}</h3>
            <p className={css.content}>{n.content}</p>

            <div className={css.footer}>
              <div className={css.tagsContainer}>
                {n.tags?.length ? (
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
                <Link
                  className={css.link}
                  href={`/notes/${encodeURIComponent(noteId)}`}
                >
                  View details
                </Link>

                {enableDelete && (
                  <button
                    className={css.button}
                    onClick={() => mutate(noteId)}
                    disabled={pending}
                    aria-busy={pending}
                  >
                    {pending ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>
            </div>

            {isError && String(deletingId) === noteId && (
              <p className={css.error}>
                {error?.response?.data && typeof error.response.data === "object"
                  ? // якщо бек вернув {message: "..."}
                    // @ts-expect-error — узагальнений guard
                    (error.response.data.message as string) ?? error.message
                  : error?.message ?? "Failed to delete note"}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
