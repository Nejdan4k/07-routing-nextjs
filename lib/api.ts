import axios, { AxiosInstance } from 'axios';
import type { Note, CreateNoteDto } from '@/types/note';
import type { FetchNotesParams, NotesListResponse } from '@/types/api';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://notehub-public.goit.study/api';
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const instance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

interface ApiListResponse<T> {
  notes: T[];
  totalPages: number;
}


export async function fetchNotes({
  page,
  search,
  perPage = 8,
}: FetchNotesParams): Promise<NotesListResponse> {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('perPage', String(perPage));

  
  if (typeof search === 'string' && search.trim()) {
    params.set('search', search.trim());
  }

  const { data } = await instance.get<ApiListResponse<Note>>(
    `/notes?${params.toString()}`
  );

  return { notes: data.notes, totalPages: data.totalPages };
}


export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await instance.get<Note>(`/notes/${id}`);
  return data;
}


export async function createNote(dto: CreateNoteDto): Promise<Note> {
  const { data } = await instance.post<Note>('/notes', dto);
  return data;
}


export async function deleteNote(id: string): Promise<Note> {
  const { data } = await instance.delete<Note>(`/notes/${id}`);
  return data;
}