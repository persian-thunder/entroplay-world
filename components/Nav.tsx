"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {
    label: "Armon Naeini",
    href: "/about",
  },
  {
    label: "Research",
    href: "/research",
    sub: [
      { label: "Self Augmentation", href: "/research/augmentation" },
      { label: "Datamosh", href: "/research/datamosh" },
      { label: "Vector Synthesis", href: "/research/vector" },
    ],
  },
   {
    label: "Art",
    href: "/art",
    sub: [
      { label: "Real-time", href: "/art/generative" },
      { label: "Experimental Video", href: "/art/experimental" },
    ],
  },
  {
    label: "Exhibitions",
    href: "/exhibitions",
    sub: [
      { label: "ID Pt. III", href: "/exhibitions/id3" },
      { label: "ID Pt. II", href: "/exhibitions/id2" },
      { label: "DTHRR", href: "/exhibitions/dthrr" },
      { label: "Resonance, Self", href: "/exhibitions/resonance" },
      { label: "Meow Wolf", href: "/exhibitions/meow" },
    ],
  },
  {
    label: "Performances",
    href: "/performances",
    sub: [
      { label: "Algorithmic Bodies", href: "/performances/algo" },
      { label: "ID Pt. I", href: "/performances/id" },
    ],
  },
   {
    label: "Design",
    href: "/design",
    sub: [
      { label: "Baton", href: "/design/baton" },
      { label: "Rare Candy", href: "/design/rare-candy" },
    ],
  },
];


function HoverStar({ filled }: { filled?: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        animation: "nav-star-in 120ms ease-in forwards, nav-spin 800ms linear infinite",
        marginLeft: "0.15em",
        fontSize: "0.9em",
        color: "#111",
      }}
    >
      {filled ? "✦" : "✧"}
    </span>
  );
}

function NavLink({ href, active, children, style }: { href: string; active?: boolean; children: React.ReactNode; style: React.CSSProperties }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      style={{ ...style, transform: hovered ? "scale(1.1)" : "scale(1)", transformOrigin: "left center", transition: "transform 150ms ease" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}{(hovered || active) && <HoverStar key={active ? "active" : "hover"} filled={active} />}
    </Link>
  );
}

function NavButton({ onClick, active, children, style }: { onClick: () => void; active?: boolean; children: React.ReactNode; style: React.CSSProperties }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      style={{ ...style, transform: hovered ? "scale(1.1)" : "scale(1)", transformOrigin: "left center", transition: "transform 150ms ease" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}{(hovered || active) && <HoverStar key={active ? "active" : "hover"} filled={active} />}
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

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const toggle = (href: string) =>
    setOpen((prev) => (prev === href ? null : href));

  return (
    <nav style={{ fontFamily: "'Bit', monospace", fontSize: "4rem" }}>
{NAV.map(({ label, href, sub }) =>
        sub ? (
          <div key={href}>
            <NavButton onClick={() => toggle(href)} active={isActive(href)} style={styles.button}>
              {label}
            </NavButton>
            {open === href && (
              <div className="nav-dropdown" style={{ paddingLeft: "1.5rem", marginTop: "0.5rem", marginBottom: "1rem" }}>
                {sub.map((s) => (
                  <NavLink key={s.href} href={s.href} active={isActive(s.href)} style={styles.sublink}>
                    {s.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ) : (
          <NavLink key={href} href={href} active={isActive(href)} style={styles.link}>
            {label}
          </NavLink>
        )
      )}
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
    fontSize: "2.5rem",
    color: "#111",
    textDecoration: "none",
    lineHeight: 1.1,
  } as React.CSSProperties,
};
