"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";

const DUR = 300;

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [opacity, setOpacity] = useState(0);
  const pending = useRef<string | null>(null);

  // Fade in whenever the page changes
  useEffect(() => {
    setOpacity(0);
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setOpacity(1))
    );
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname) return;
      pending.current = href;
      setOpacity(0);
      setTimeout(() => {
        if (pending.current) {
          router.push(pending.current);
          pending.current = null;
        }
      }, DUR);
    },
    [router, pathname]
  );

  // Intercept all internal anchor clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto")) return;
      e.preventDefault();
      navigate(href);
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [navigate]);

  return (
    <div
      style={{
        opacity,
        transition: `opacity ${DUR}ms ease`,
        height: "100%",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}
