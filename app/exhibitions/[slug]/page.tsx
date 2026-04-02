import { notFound } from "next/navigation";
import VideoFeed, { VideoItem } from "@/components/VideoFeed";
import { exhibitions } from "../data";

export function generateStaticParams() {
  return Object.keys(exhibitions).map((slug) => ({ slug }));
}

export default function ExhibitionPage({ params }: { params: { slug: string } }) {
  const ex = exhibitions[params.slug];
  if (!ex) notFound();

  const items: VideoItem[] = [
    ...(ex.videos?.map((v) => ({ type: "vimeo" as const, id: v.vimeoId, caption: v.caption })) ?? []),
    ...(ex.youtubeIds?.map((id) => ({ type: "youtube" as const, id })) ?? []),
    ...(ex.images?.map((src) => ({ type: "image" as const, src })) ?? []),
  ];

  return (
    <div style={{ padding: "2.8rem 3rem 4rem 0", overflowY: "auto", height: "100%" }}>
      <div style={{ fontSize: "1.9rem", lineHeight: "2rem", color: "#111", marginBottom: "3rem", letterSpacing: ".075px" }}>
        {ex.description.split("\n\n").map((para, i) => (
          <p key={i} style={{ marginBottom: "1rem" }}>{para}</p>
        ))}
        {ex.credits && (
          <p>
            {ex.credits.map((c, i) => (
              <span key={i}>
                {c.role}: {c.name}
                {i < ex.credits!.length - 1 && <br />}
              </span>
            ))}
          </p>
        )}
      </div>
      <VideoFeed videos={items} />
    </div>
  );
}
