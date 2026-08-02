"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavContext } from "@/components/NavContext";

// `deco` is the kaomoji that pops in beside each label on hover — one per section, so the
// nav has personalities rather than a uniform hover state.
const NAV = [
  {
    label: "Armon Naeini",
    href: "/about",
    deco: "(・ᴗ・)",
  },
  {
    label: "Art",
    href: "/art",
    deco: "(๑˘ᴗ˘๑)",
    sub: [
      { label: "Experimental Video", href: "/art/experimental" },
      { label: "RØMANS", href: "/art/romans" },
      { label: "Real-time", href: "/art/generative" },
    ],
  },
  {
    label: "Product",
    href: "/product",
    deco: "(•̀ᴗ•́)ﻭ",
    sub: [
      { label: "Baton", href: "/product/baton" },
      { label: "FuegoUX", href: "/product/fuegoux" },
      { label: "Rare Candy", href: "/product/rare-candy" },
    ],
  },
  {
    label: "Exhibitions",
    href: "/exhibitions",
    deco: "(◕‿◕✿)",
    sub: [
      { label: "DTHRR", href: "/exhibitions/dthrr" },
      { label: "ID Pt. II", href: "/exhibitions/id2" },
      { label: "ID Pt. III", href: "/exhibitions/id3" },
      { label: "Meow Wolf", href: "/exhibitions/meow" },
      { label: "Resonance, Self", href: "/exhibitions/resonance" },
    ],
  },
  {
    label: "Performances",
    href: "/performances",
    deco: "♪(˘ᴗ˘)♪",
    sub: [
      { label: "Algorithmic Bodies", href: "/performances/algorithmic-bodies" },
      { label: "ID Pt. I", href: "/performances/id" },
    ],
  },
  {
    label: "Research",
    href: "/research",
    deco: "(ᴗ˳ᴗ)",
    sub: [
      { label: "chartty", href: "/research/charttty" },
      { label: "Datamosh", href: "/research/datamosh" },
      { label: "Self Augmentation", href: "/research/augmentation" },
      { label: "Vector Synthesis", href: "/research/vector" },
    ],
  },
];


function HoverStar({ filled, gap = "0.25em", top = "1px" }: { filled?: boolean; gap?: string; top?: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "1em",
        height: "1em",
        lineHeight: 1,
        transformOrigin: "50% 44%",
        fontFamily: "'Bit', monospace",
        animation: "nav-star-in 120ms ease-in forwards, nav-spin 1100ms linear infinite",
        marginLeft: gap,
        fontSize: "0.9em",
        color: "#111",
        position: "relative",
        top,
      }}
    >
      {filled ? "✦" : "✧"}
    </span>
  );
}

// The shift lives in CSS (.nav-item) so hover runs on the compositor. Scale is gone
// deliberately — scaling type changes its optical weight and softens the stems mid-flight.
function NavLink({ href, active, children, style, gap, starTop, deco }: { href: string; active?: boolean; children: React.ReactNode; style: React.CSSProperties; gap?: string; starTop?: string; deco?: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      className="nav-item"
      data-active={active ? "true" : undefined}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="nav-label">{children}</span>
      {(hovered || active) && <HoverStar key={active ? "active" : "hover"} filled={active} gap={gap} top={starTop} />}
      {deco && hovered && <span className="nav-deco" aria-hidden="true">{deco}</span>}
    </Link>
  );
}

function NavButton({ onClick, active, children, style, gap, deco }: { onClick: () => void; active?: boolean; children: React.ReactNode; style: React.CSSProperties; gap?: string; deco?: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      className="nav-item"
      data-active={active ? "true" : undefined}
      onClick={onClick}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="nav-label">{children}</span>
      {(hovered || active) && <HoverStar key={active ? "active" : "hover"} filled={active} gap={gap} />}
      {deco && hovered && <span className="nav-deco" aria-hidden="true">{deco}</span>}
    </button>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => {
    const activeParent = NAV.find(({ sub }) => sub?.some((s) => pathname === s.href || pathname.startsWith(s.href + "/")))?.href ?? null;
    setOpen(activeParent);
  }, [pathname]);

  const { pendingHref } = useNavContext();

  const isActive = (href: string) => {
    const current = pendingHref ?? pathname;
    return current === href || current.startsWith(href + "/");
  };

  const toggle = (href: string) =>
    setOpen((prev) => (prev === href ? null : href));

  const navItems = (
    NAV.map(({ label, href, sub, deco }) =>
      sub ? (
        <div key={href}>
          <NavButton onClick={() => toggle(href)} active={isActive(href)} style={styles.button} gap="0.1em" deco={deco}>
            {label}
          </NavButton>
          {open === href && (
            <div className="nav-dropdown nav-sublist">
              {sub.map((s, i) => (
                <NavLink key={s.href} href={s.href} active={isActive(s.href)} starTop="-4px" style={{ ...styles.sublink, animationDelay: `${i * 40}ms`, animation: "nav-dropdown 350ms cubic-bezier(0.16, 1, 0.3, 1) both", opacity: 0 }}>
                  {s.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      ) : (
        <NavLink key={href} href={href} active={isActive(href)} style={styles.link} gap="0.1em" deco={deco}>
          {label}
        </NavLink>
      )
    )
  );

  return (
    <nav className="site-nav" style={{ fontFamily: "'Bit', monospace", fontSize: "var(--nav-size)" }}>
      {navItems}
    </nav>
  );
}

const styles = {
  link: {
    display: "block",
    color: "#111",
    textDecoration: "none",
    lineHeight: .825,
  } as React.CSSProperties,
  button: {
    display: "block",
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    color: "#111",
    lineHeight: .825,
    textAlign: "left" as const,
  },
  sublink: {
    display: "block",
    fontFamily: "'Mondwest', serif",
    fontSize: "var(--nav-sub-size)",
    color: "#111",
    textDecoration: "none",
    lineHeight: 1.1,
  } as React.CSSProperties,
};
