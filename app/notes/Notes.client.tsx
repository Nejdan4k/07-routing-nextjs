'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './NotesPage.module.css';

export default function NotesClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [isModalOpen, setModalOpen] = useState(false);

 
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  
  useEffect(() => {
    setPage(1);
  }, [search]);

  const queryKey = useMemo(
    () => ['notes', { page, search: debouncedSearch }],
    [page, debouncedSearch]
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: () => fetchNotes({ page, search: debouncedSearch }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox onSearch={setSearch} />

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

        <button
          className={css.button}
          type="button"
          onClick={() => setModalOpen(true)}
        >
          Create note +
        </button>
      </div>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Error: {(error as Error).message}</p>}
      {data && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <NoteForm
            onCancel={() => setModalOpen(false)}
            onSuccess={() => setModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}