import Link from "next/link";

export type SectionItem = {
  title: string;
  href: string;
  year?: string;
  teaser?: string;
};

// Shared list rendered by every section index page (research/design/exhibitions/
// performances/art). Each page just supplies the items; the layout lives here.
export default function SectionIndex({ items }: { items: SectionItem[] }) {
  return (
    <div className="work-page">
      {items.map((it) => (
        <Link key={it.href} href={it.href} className="section-item">
          <div className="section-title">
            {it.title}
            {it.year ? <span className="section-year">{it.year}</span> : null}
          </div>
          {it.teaser ? <p className="section-teaser">{it.teaser}</p> : null}
        </Link>
      ))}
    </div>
  );
}
