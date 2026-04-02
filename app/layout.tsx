import type { Metadata } from "next";
import "./globals.css";
import PageTransition from "@/components/PageTransition";
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
      <body>
        <main
          style={{
            position: "relative",
            width: "100vw",
            maxWidth: "1800px",
            margin: "0 auto",
            height: "100vh",
            overflow: "hidden",
            backgroundImage: "url('/bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <PageTransition>{children}</PageTransition>
          <Link
            href="/"
            style={{
              position: "fixed",
              bottom: "1.5rem",
              left: "1.5rem",
              zIndex: 1000,
              fontSize: "2rem",
              color: "#111",
              textDecoration: "none",
              display: "inline-block",
              animation: "home-spin 3s linear infinite",
            }}
          >
            ✦
          </Link>
        </main>
      </body>
    </html>
  );
}
