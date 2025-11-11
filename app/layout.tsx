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
  modal,            // ✅ додали проп для паралельного слота
}: {
  children: ReactNode;
  modal: ReactNode; // ✅ типізували
}) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <Header />
          {children}
          {modal}      {/* ✅ рендеримо слот @modal тут */}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
