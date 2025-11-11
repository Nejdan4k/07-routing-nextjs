// ---------- Теги, що використовуємо у фільтрах/формі ----------
export type NoteTag =
  | "Work"
  | "Personal"
  | "Todo"
  | "Meeting"
  | "Shopping"
  | "Other";

// ---------- DTO для створення/оновлення нотаток ----------
// (NoteForm очікує саме цю назву типу)
export interface CreateNoteDto {
  title: string;
  content: string;
  tag?: string;     // якщо форма віддає один тег
  tags?: string[];  // або масив тегів (обидва варіанти підтримуємо)
}

// ---------- Модель нотатки ----------
// id може приходити як id або _id з бекенда
export interface Note {
  id?: string;
  _id?: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag?: NoteTag;     // опційно (деякі демо-дані мають одиночний тег)
  tags?: string[];   // опційно (масив тегів)
}
