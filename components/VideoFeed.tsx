"use client";

import { useState } from "react";

export type VideoItem =
  | { type: "vimeo"; id: string; title?: string; caption?: string }
  | { type: "youtube"; id: string; title?: string; caption?: string }
  | { type: "image"; src: string };

export default function VideoFeed({ videos }: { videos: VideoItem[] }) {
  const [grid, setGrid] = useState(false);
  const [hoverList, setHoverList] = useState(false);
  const [hoverGrid, setHoverGrid] = useState(false);

  if (!videos.length) return null;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.25rem" }}>
        <button
          onClick={() => setGrid(false)}
          onMouseEnter={() => setHoverList(true)}
          onMouseLeave={() => setHoverList(false)}
          style={{ background: hoverList ? "#111" : "none", color: hoverList ? "#e8e4df" : "#111", border: grid ? "1px solid #111" : "2px solid #111", cursor: "pointer", fontSize: "2.25rem", fontFamily: "'Bit', monospace", opacity: grid ? 0.35 : 1, padding: "0.15rem 0.5rem", lineHeight: 1, marginRight: "0.5rem", transition: "background 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)", transform: hoverList ? "scale(1.08)" : "scale(1)" }}
        >
          𓂃
        </button>
        <button
          onClick={() => setGrid(true)}
          onMouseEnter={() => setHoverGrid(true)}
          onMouseLeave={() => setHoverGrid(false)}
          style={{ background: hoverGrid ? "#111" : "none", color: hoverGrid ? "#e8e4df" : "#111", border: grid ? "2px solid #111" : "1px solid #111", cursor: "pointer", fontSize: "1.65rem", fontFamily: "'Bit', monospace", opacity: grid ? 1 : 0.35, padding: "0.15rem 0.5rem", lineHeight: 1, transition: "background 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)", transform: hoverGrid ? "scale(1.08)" : "scale(1)" }}
        >
          ( • ̀ω•́ )✧
        </button>
      </div>

      <div style={grid ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" } : {}}>
        {videos.map((v, i) => {
          if (v.type === "image") {
            if (grid) {
              return (
                <div key={i} style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.src} alt="" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              );
            }
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={v.src} alt="" style={{ display: "block", width: "100%", marginBottom: "2.75rem" }} />
            );
          }

          return (
            <div key={i} style={grid ? {} : { marginBottom: "2.75rem" }}>
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, background: "#eee" }}>
                {v.type === "vimeo" ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${v.id}`}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}`}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
              {v.caption && (
                <p style={{ fontSize: "0.85rem", color: "#555", marginTop: "0.5rem" }}>{v.caption}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
