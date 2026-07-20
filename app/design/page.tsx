import SectionIndex from "@/components/SectionIndex";
import { design } from "./data";

export default function Page() {
  return (
    <SectionIndex
      items={Object.entries(design).map(([slug, w]) => ({
        title: w.title,
        href: `/design/${slug}`,
        year: w.year,
        teaser: w.description.split("\n\n")[0],
      }))}
    />
  );
}
