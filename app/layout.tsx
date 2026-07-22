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
