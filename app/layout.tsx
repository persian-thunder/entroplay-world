import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import PageTransition from "@/components/PageTransition";
import { LeftSlotProvider, LeftSlotContent } from "@/components/LeftSlot";
import { NavContextProvider } from "@/components/NavContext";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Armon Naeini",
  description: "Design, Exhibits, Research",
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
          <main
            style={{
              position: "relative",
              width: "100vw",
              maxWidth: "2400px",
              margin: "0 auto",
              height: "100vh",
              overflow: "hidden",
              backgroundImage: "url('/bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "grid",
              gridTemplateColumns: "1.15fr 1.6fr",
            }}
          >
            {/* Left — persistent nav, never fades */}
            <div
              style={{
                position: "sticky",
                top: 0,
                height: "100vh",
                minHeight: 0,
                padding: "4rem 2.5rem 3rem 3rem",
                zIndex: 1,
                overflowY: "auto",
              }}
            >
              <Nav />
              <LeftSlotContent />
            </div>

            {/* Right — fades on navigation */}
            <PageTransition>{children}</PageTransition>

            <Link
              href="/"
              style={{
                position: "fixed",
                bottom: "1rem",
                left: "2rem",
                zIndex: 1000,
                fontFamily: "'Bit', monospace",
                fontSize: "4rem",
                color: "#111",
                textDecoration: "none",
                display: "inline-block",
                animation: "home-spin .9s linear infinite",
              }}
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
