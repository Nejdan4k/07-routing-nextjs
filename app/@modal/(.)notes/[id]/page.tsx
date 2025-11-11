"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { fetchNoteById } from "@/lib/api";
import type { Note } from "@/types/note";
import Modal from "@/components/Modal/Modal";
import NotePreview from "@/components/NotePreview/NotePreview";

export default function NoteModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next 16: params — це Promise, розпаковуємо через use()
  const { id } = use(params);
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery<Note, AxiosError>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    retry: false,
    refetchOnWindowFocus: false,
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
          <p style={{ color: "#b91c1c", marginTop: 12 }}>
            {error?.response?.status === 404
              ? "Note not found"
              : error?.message ?? "Failed to load note"}
          </p>
        </div>
      ) : (
        <NotePreview note={data ?? null} onBack={() => router.back()} />
      )}
    </Modal>
  );
}
