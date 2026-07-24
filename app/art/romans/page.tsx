import VideoFeed from "@/components/VideoFeed";
import { romansVideos } from "./data";

export default function RomansPage() {
  const videos = romansVideos.map((v) => ({ type: "vimeo" as const, id: v.vimeoId, title: v.title, caption: v.caption }));
  return (
    <div className="work-page">
      <VideoFeed videos={videos} />
    </div>
  );
}
