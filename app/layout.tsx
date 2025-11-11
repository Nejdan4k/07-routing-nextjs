import type { ReactNode } from "react";
import { TanStackProvider } from "@/components/TanStackProvider/TanStackProvider";
import Header from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import "./globals.css";

export const metadata = {
  title: "NoteHub",
  description: "Manage your personal notes efficiently",
};

export default function RootLayout({
  children,
  modal,            // ⬅️ паралельний слот
}: {
  children: ReactNode;
  modal: ReactNode; // ⬅️ типізація
}) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <Header />
          {children}
          {modal}     {/* ⬅️ обов’язково рендеримо */}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
