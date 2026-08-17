import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import PageTransition from "@/components/PageTransition";
import { LeftSlotProvider, LeftSlotContent } from "@/components/LeftSlot";
import { NavContextProvider } from "@/components/NavContext";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Armon Naeini",
  description: "Product, Exhibits, Research",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Start both faces on the first network trip. Without this the browser can't
            discover them until globals.css has been fetched and parsed, which puts the
            fonts a full round-trip behind. `crossOrigin` is required even same-origin —
            fonts fetch in CORS mode, and omitting it causes a second, duplicate request. */}
        <link rel="preload" href="/fonts/bit.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/mondwest.otf" as="font" type="font/otf" crossOrigin="anonymous" />
      </head>
      <body>
        <NavContextProvider>
        <LeftSlotProvider>
          <main className="site-shell">
            <div className="site-sidebar">
              <Nav />
              <LeftSlotContent />
            </div>

            <PageTransition>{children}</PageTransition>

            <Link
              href="/"
              aria-label="Home"
              className="home-mark"
            >
              ✦
            </Link>
          </main>
        </LeftSlotProvider>
        </NavContextProvider>
      </body>
    </html>
  );
}
