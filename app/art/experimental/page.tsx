import VideoFeed from "@/components/VideoFeed";
import { experimentalVideos } from "./data";

export default function ExperimentalPage() {
  const videos = experimentalVideos.map((v) => ({ type: "vimeo" as const, id: v.vimeoId, title: v.title, caption: v.caption }));
  return (
    <div className="work-page">
      <VideoFeed videos={videos} />
    </div>
  );
}
