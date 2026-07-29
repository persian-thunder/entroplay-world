"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavContext } from "@/components/NavContext";

// Deliberately asymmetric. Leaving is short and accelerating — the decision is already
// made, so dwelling on it feels sluggish. Arriving is longer and decelerating, with the
// page's own blocks staggered, so the eye is led down the new page rather than having the
// whole thing appear at once. Equal in/out durations are the tell of a default fade.
const EXIT = 190;
const STAGGER = 42; // ms between sibling reveals
const STAGGER_CAP = 9; // stop compounding past this, or long pages crawl in

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const shell = useRef<HTMLDivElement | null>(null);
  const target = useRef<string | null>(null);
  const timer = useRef<number | null>(null);
  const [leaving, setLeaving] = useState(false);
  const { setPendingHref } = useNavContext();

  const reduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- arrive -------------------------------------------------------------------
  useEffect(() => {
    setPendingHref(null);
    setLeaving(false);
    const el = shell.current;
    if (!el) return;
    el.scrollTop = 0;
    if (reduced()) return;

    // Stagger the page's own blocks. Most pages wrap everything in one scroll container,
    // so reach a level in when that is the case — otherwise the "stagger" is a single
    // element and collapses straight back into a flat fade.
    let blocks = Array.from(el.children) as HTMLElement[];
    if (blocks.length === 1 && blocks[0].children.length > 1) {
      blocks = Array.from(blocks[0].children) as HTMLElement[];
    }

    blocks.forEach((b, i) => {
      b.classList.remove("pt-block");
      b.style.setProperty("--pt-d", `${Math.min(i, STAGGER_CAP) * STAGGER}ms`);
    });
    void el.offsetWidth; // reflow, so re-adding the class restarts a finished animation
    blocks.forEach((b) => b.classList.add("pt-block"));
  }, [pathname, setPendingHref]);

  // ---- leave --------------------------------------------------------------------
  const navigate = useCallback(
    (href: string) => {
      if (href === pathname) return;
      target.current = href;
      setPendingHref(href);
      if (reduced()) {
        router.push(href);
        return;
      }
      setLeaving(true);
      // a second click mid-exit retargets instead of queueing another navigation
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        if (target.current) {
          router.push(target.current);
          target.current = null;
        }
      }, EXIT);
    },
    [router, pathname, setPendingHref]
  );

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  // ---- intercept ----------------------------------------------------------------
  useEffect(() => {
    const internalHref = (a: Element) => {
      const href = a.getAttribute("href");
      if (!href) return null;
      if (/^(https?:|mailto:|tel:|\/\/|#)/i.test(href)) return null;
      if (a.getAttribute("target") === "_blank" || a.hasAttribute("download")) return null;
      return href;
    };

    const onClick = (e: MouseEvent) => {
      // Leave modified and non-primary clicks alone. preventDefault on a cmd-click
      // silently breaks open-in-new-tab, which is worse than having no transition.
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.defaultPrevented) return;
      const a = (e.target as HTMLElement)?.closest?.("a");
      if (!a) return;
      const href = internalHref(a);
      if (!href) return;
      e.preventDefault();
      navigate(href);
    };

    // Warm the route on approach. Without this the exit animation is merely covering a
    // real fetch, and the arrival lands late and out of time with the motion.
    const warmed = new Set<string>();
    const onOver = (e: Event) => {
      const a = (e.target as HTMLElement)?.closest?.("a");
      if (!a) return;
      const href = internalHref(a);
      if (href && !warmed.has(href)) {
        warmed.add(href);
        router.prefetch(href);
      }
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("pointerover", onOver, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("pointerover", onOver, true);
    };
  }, [navigate, router]);

  return (
    <div ref={shell} className={`page-transition${leaving ? " pt-out" : ""}`}>
      {children}
    </div>
  );
}
