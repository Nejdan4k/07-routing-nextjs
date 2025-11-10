import css from "./SidebarNotes.module.css";

const TAGS = ["all", "work", "personal", "todo", "meeting", "shopping"];

export default function SidebarNotesDefault() {
  return (
    <nav aria-label="Notes filters">
      <ul className={css.menuList}>
        {TAGS.map((tag) => {
          const href = `/notes/filter/${tag}`;
          
          const label = tag.charAt(0).toUpperCase() + tag.slice(1);

          return (
            <li key={tag} className={css.menuItem}>
              <a href={href} className={css.menuLink}>
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}