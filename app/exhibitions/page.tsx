import SectionIndex from "@/components/SectionIndex";
import { exhibitions } from "./data";

export default function Page() {
  return (
    <SectionIndex
      items={Object.entries(exhibitions).map(([slug, w]) => ({
        title: w.title,
        href: `/exhibitions/${slug}`,
        year: w.year,
        teaser: w.description.split("\n\n")[0],
      }))}
    />
  );
}
