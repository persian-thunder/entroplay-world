import SectionIndex from "@/components/SectionIndex";
import { performances } from "./data";

export default function Page() {
  return (
    <SectionIndex
      items={Object.entries(performances).map(([slug, w]) => ({
        title: w.title,
        href: `/performances/${slug}`,
        year: w.year,
        teaser: w.description.split("\n\n")[0],
      }))}
    />
  );
}
