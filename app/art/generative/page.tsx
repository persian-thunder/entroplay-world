import VideoFeed from "@/components/VideoFeed";
import { generativeVideos } from "./data";

export default function GenerativePage() {
  const videos = generativeVideos.map((v) => ({ type: "vimeo" as const, id: v.vimeoId, title: v.title, caption: v.caption }));
  return (
    <div style={{ padding: "4rem 3rem 4rem 0", overflowY: "auto", height: "100%" }}>
      <VideoFeed videos={videos} />
    </div>
  );
}
