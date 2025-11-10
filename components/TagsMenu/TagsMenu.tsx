"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import css from "./TagsMenu.module.css";

const TAGS = ["All", "Work", "Personal", "Todo", "Meeting", "Shopping"] as const;

export default function TagsMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const handleSelect = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={css.menuContainer} ref={rootRef}>
      <button
        type="button"
        className={css.menuButton}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        Notes ▾
      </button>

      {open && (
        <ul className={css.menuList} role="menu" aria-label="Filter by tag">
          {TAGS.map((tag) => {
            const href =
              tag === "All"
                ? "/notes/filter/all"
                : `/notes/filter/${tag.toLowerCase()}`;
            return (
              <li key={tag} className={css.menuItem} role="none">
                <Link
                  href={href}
                  prefetch={false}
                  className={css.menuLink}
                  role="menuitem"
                  onClick={handleSelect}
                >
                  {tag}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}