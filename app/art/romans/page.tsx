import VideoFeed, { VideoItem } from "@/components/VideoFeed";
import { romansVideos, romansImages, romansDescription } from "./data";

export default function RomansPage() {
  const videos: VideoItem[] = [
    ...romansVideos.map((v) => ({ type: "vimeo" as const, id: v.vimeoId, title: v.title, caption: v.caption })),
    ...romansImages.map((src) => ({ type: "image" as const, src })),
  ];
  return (
    <div className="work-page">
      <div className="work-copy">
        {romansDescription.split("\n\n").map((para, i) => (
          <p key={i} style={{ marginBottom: "1rem" }}>{para}</p>
        ))}
      </div>
      <VideoFeed videos={videos} />
    </div>
  );
}
