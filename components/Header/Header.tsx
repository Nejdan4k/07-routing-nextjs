import Link from "next/link";
import TagsMenu from "@/components/TagsMenu/TagsMenu";
import css from "./Header.module.css";

export default function Header() {
  return (
    <header className={css.header}>
      {/* Логотип веде на головну */}
      <Link href="/" aria-label="Home" className={css.headerLink}>
        NoteHub
      </Link>

      {/* Основна навігація */}
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li className={css.navigationItem}>
            <Link href="/" className={css.navigationLink}>
              Home
            </Link>
          </li>

          <li className={css.navigationItem}>
            {/* ✅ Додано пряме посилання на /notes/filter/all */}
            <Link href="/notes/filter/all" className={css.navigationLink}>
              All notes
            </Link>
          </li>

          <li className={css.navigationItem}>
            {/* Додатково залишено TagsMenu, якщо потрібно */}
            <TagsMenu />
          </li>
        </ul>
      </nav>
    </header>
  );
}