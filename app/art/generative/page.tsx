import Nav from "@/components/Nav";
import VideoFeed from "@/components/VideoFeed";
import { generativeVideos } from "./data";

export default function GenerativePage() {
  const videos = generativeVideos.map((v) => ({ type: "vimeo" as const, id: v.vimeoId, title: v.title, caption: v.caption }));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", height: "100%" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", padding: "2.8rem 2.5rem 3rem 3rem" }}>
        <Nav />
      </div>
      <div style={{ padding: "2.8rem 3rem 4rem 0", overflowY: "auto" }}>
        <VideoFeed videos={videos} />
      </div>
    </div>
  );
}
