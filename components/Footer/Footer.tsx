'use client';

import css from './Footer.module.css';

export function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>Developer: Stryzhavchuk Anton</p>
          <p>
            Contact us:{' '}
            <a href="mailto:student@notehub.app">mailto:student@notehub.app</a>
          </p>
        </div>
      </div>
    </footer>
  );
}