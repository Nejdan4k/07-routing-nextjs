'use client';

import { useState, useEffect } from 'react';
import css from './SearchBox.module.css';

interface SearchBoxProps {
  onSearch: (query: string) => void;
}

export default function SearchBox({ onSearch }: SearchBoxProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const delay = setTimeout(() => {
      onSearch(value.trim());
    }, 500);
    return () => clearTimeout(delay);
  }, [value, onSearch]);

  return (
    <div>
      <input
        type="text"
        className={css.input}
        placeholder="Search notes..."
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  );
}