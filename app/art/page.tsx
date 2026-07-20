import SectionIndex from "@/components/SectionIndex";

export default function Page() {
  return (
    <SectionIndex
      items={[
        { title: "Experimental Video", href: "/art/experimental" },
        { title: "Real-time", href: "/art/generative" },
      ]}
    />
  );
}
