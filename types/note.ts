export type NoteTag =
  | "Work"
  | "Personal"
  | "Todo"
  | "Meeting"
  | "Shopping"
  | "Other";

export interface Note {
  id?: string;
  _id?: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag?: NoteTag;
  tags?: string[];
}
