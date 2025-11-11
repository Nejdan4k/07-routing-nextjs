"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import type { Note } from "@/types/note";
import Modal from "@/components/Modal/Modal";
import NotePreview from "@/components/NotePreview/NotePreview";

export default function NoteModalPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery<Note>({
    queryKey: ["note", params.id],
    queryFn: () => fetchNoteById(params.id),
    refetchOnMount: false,
  });

  return (
    <Modal open onClose={() => router.back()}>
      {isLoading ? (
        <p style={{ padding: 16 }}>Loading, please wait...</p>
      ) : isError ? (
        <div style={{ padding: 16 }}>
          <button onClick={() => router.back()} aria-label="Close">
            ← Back
          </button>
          <p style={{ color: "#b91c1c" }}>
            {(error as Error)?.message ?? "Failed to load note"}
          </p>
        </div>
      ) : (
        <NotePreview note={data ?? null} onBack={() => router.back()} />
      )}
    </Modal>
  );
}
