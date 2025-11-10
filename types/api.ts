import type { Note } from "./note";

export interface FetchNotesParams {
  page: number;
  search?: string;
  perPage?: number;
  tag?: string; 
}

export interface NotesListResponse {
  notes: Note[];
  totalPages: number;
}