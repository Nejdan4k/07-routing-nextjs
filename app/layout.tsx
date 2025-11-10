import type { ReactNode } from "react";
import { TanStackProvider } from "@/components/TanStackProvider/TanStackProvider";
import Header from "@/components/Header/Header";

import { Footer } from "@/components/Footer/Footer";
import "./globals.css";

export const metadata = {
  title: "NoteHub",
  description: "Manage your personal notes efficiently",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#f8f9fa",
            }}
          >
            <Header />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
          </div>
        </TanStackProvider>
      </body>
    </html>
  );
}