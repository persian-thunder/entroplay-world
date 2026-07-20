import SectionIndex from "@/components/SectionIndex";
import { research } from "./data";

export default function Page() {
  return (
    <SectionIndex
      items={Object.entries(research).map(([slug, w]) => ({
        title: w.title,
        href: `/research/${slug}`,
        year: w.year,
        teaser: w.description.split("\n\n")[0],
      }))}
    />
  );
}
