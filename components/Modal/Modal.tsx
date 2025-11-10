"use client";

import { ReactNode, useEffect } from "react";
import css from "./Modal.module.css";

export default function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", onKey);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("keydown", onKey);
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  const stop = (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation();

  return (
    <div
      className={css.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal} onClick={stop}>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            background: "transparent",
            border: "none",
            fontSize: 20,
            color: "#6c757d",
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}