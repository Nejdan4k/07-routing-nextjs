import axios, { type AxiosInstance } from "axios";
import type { Note } from "@/types/note";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://notehub-public.goit.study/api";
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export const instance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
});

export interface PaginatedNotesResponse {
  notes: Note[];
  page: number;
  perPage: number;
  totalPages: number;
  total: number;
}

export interface FetchNotesParams {
  q?: string;
  page?: number;
  perPage?: number;
  tag?: string | null;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  tag?: string;
  tags?: string[];
}

function normalizeTag(tag?: string | null): string | undefined {
  if (!tag || tag === "all") return undefined;
  return tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
}

export async function fetchNotes(
  params: FetchNotesParams = {}
): Promise<PaginatedNotesResponse> {
  const { q, page = 1, perPage = 8, tag } = params;

  const search = new URLSearchParams();
  search.set("page", String(page));
  search.set("perPage", String(perPage));

  if (q && q.trim()) search.set("search", q.trim());

  const normTag = normalizeTag(tag);
  if (normTag) search.set("tag", normTag);

  const { data } = await instance.get<PaginatedNotesResponse>(
    `/notes?${search.toString()}`
  );
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const safe = encodeURIComponent(id);
  const { data } = await instance.get<Note>(`/notes/${safe}`);
  return data;
}

export async function createNote(payload: CreateNoteDto): Promise<Note> {
  const body: Record<string, unknown> = {
    title: payload.title,
    content: payload.content,
  };

  if (payload.tags && payload.tags.length) {
    body.tags = payload.tags;
  } else if (payload.tag) {
    body.tag = normalizeTag(payload.tag);
  }

  const { data } = await instance.post<Note>("/notes", body);
  return data;
}

export async function updateNote(
  id: string,
  payload: Partial<CreateNoteDto>
): Promise<Note> {
  const safe = encodeURIComponent(id);
  const body: Record<string, unknown> = {};

  if (payload.title !== undefined) body.title = payload.title;
  if (payload.content !== undefined) body.content = payload.content;

  if (payload.tags && payload.tags.length) {
    body.tags = payload.tags;
  } else if (payload.tag !== undefined) {
    body.tag = payload.tag ? normalizeTag(payload.tag) : undefined;
  }

  const { data } = await instance.patch<Note>(`/notes/${safe}`, body);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const safe = encodeURIComponent(id);
  const { data } = await instance.delete<Note>(`/notes/${safe}`);
  return data;
}
