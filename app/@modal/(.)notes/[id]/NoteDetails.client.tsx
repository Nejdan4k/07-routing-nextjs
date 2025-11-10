"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import type { Note } from "@/types/note";
import css from "./NoteDetails.module.css";

export default function NoteDetailsClient({ id }: { id: string }) {
  const { data, isLoading, isError } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Failed to load note.</p>;

  return (
    <div className={css.wrapper}>
      <h2>{data.title}</h2>
      <p>{data.content}</p>
      <p>
        <small>Created: {new Date(data.createdAt).toLocaleString()}</small>
      </p>
      <p>
        <small>Updated: {new Date(data.updatedAt).toLocaleString()}</small>
      </p>
    </div>
  );
}