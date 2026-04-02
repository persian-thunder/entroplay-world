"use client";

import { useRef, useCallback } from "react";
import Nav from "@/components/Nav";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (v && v.duration - v.currentTime <= 2.5) {
      v.currentTime = 0;
    }
  }, []);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.6fr",
        height: "100%",
        position: "relative",
      }}
    >
      {/* Background video — anchored right */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        style={{
          position: "fixed",
          top: "42%",
          right: "5%",
          height: "50vh",
          width: "auto",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
          // backgroundColor: "#111",
          border: "4px solid #111",
          transform: "scaleX(-1)",
        }}
      >
        <source
          src="https://res.cloudinary.com/dqv4mu7u6/video/upload/v1774730002/output_d6ptsb.webm"
          type="video/webm"
        />
      </video>

      {/* Left — sticky nav */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          padding: "2.8rem 2.5rem 3rem 3rem",
          zIndex: 1,
        }}
      >
        <Nav />
      </div>

    </div>
  );
}
