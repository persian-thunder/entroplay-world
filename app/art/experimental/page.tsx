import VideoFeed from "@/components/VideoFeed";
import { experimentalVideos } from "./data";

export default function ExperimentalPage() {
  const videos = experimentalVideos.map((v) => ({ type: "vimeo" as const, id: v.vimeoId, title: v.title, caption: v.caption }));
  return (
    <div style={{ padding: "2.8rem 3rem 4rem 0", overflowY: "auto", height: "100%" }}>
      <VideoFeed videos={videos} />
    </div>
  );
}
