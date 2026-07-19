import VideoFeed, { VideoItem } from "@/components/VideoFeed";
import { design } from "../data";
import { notFound } from "next/navigation";

export default function BatonPage() {
  const ex = design["baton"];
  if (!ex) notFound();

  const items: VideoItem[] = [
    ...(ex.youtubeIds?.map((id) => ({ type: "youtube" as const, id })) ?? []),
    ...(ex.videos?.map((v) => ({ type: "vimeo" as const, id: v.vimeoId, caption: v.caption })) ?? []),
    ...(ex.images?.map((src) => ({ type: "image" as const, src })) ?? []),
  ];

  return (
    <div className="work-page">
      <div className="work-copy">
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
