import VideoFeed from "@/components/VideoFeed";
import { generativeVideos } from "./data";

export default function GenerativePage() {
  const videos = generativeVideos.map((v) => ({ type: "vimeo" as const, id: v.vimeoId, title: v.title, caption: v.caption }));
  return (
    <div className="work-page">
      <VideoFeed videos={videos} />
    </div>
  );
}
