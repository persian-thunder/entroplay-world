"use client";

import { useRef, useCallback, useEffect } from "react";

const TRAIL = 10;
const LERPS = [0.16, 0.14, 0.12, 0.11, 0.10, 0.09, 0.09, 0.08, 0.08, 0.07];
const SRC_WEBM = "https://res.cloudinary.com/dqv4mu7u6/video/upload/v1774730002/output_d6ptsb.webm";
const SRC_MOV = "https://res.cloudinary.com/dqv4mu7u6/video/upload/v1775169141/output-safari_rmccqx.mov";

export default function Home() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const positionsRef = useRef<{ x: number; y: number }[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  const handleTimeUpdate = useCallback((v: HTMLVideoElement) => {
    if (v.duration - v.currentTime <= 2.5) v.currentTime = 0;
  }, []);

  useEffect(() => {
    const cx = window.innerWidth * 0.75;
    const cy = window.innerHeight * 0.5;
    mouseRef.current = { x: cx, y: cy };
    positionsRef.current = Array.from({ length: TRAIL }, () => ({ x: cx, y: cy }));

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouseMove);

    let rafId: number;
    const animate = () => {
      const mouse = mouseRef.current;
      const positions = positionsRef.current;

      // Sync all trail videos to primary
      const primary = videoRefs.current[0];
      if (primary) {
        for (let i = 1; i < TRAIL; i++) {
          const v = videoRefs.current[i];
          if (v && Math.abs(v.currentTime - primary.currentTime) > 0.05) {
            v.currentTime = primary.currentTime;
          }
        }
      }

      for (let i = 0; i < TRAIL; i++) {
        const target = i === 0 ? mouse : positions[i - 1];
        positions[i] = {
          x: positions[i].x + (target.x - positions[i].x) * LERPS[i],
          y: positions[i].y + (target.y - positions[i].y) * LERPS[i],
        };
        const el = wrapperRefs.current[i];
        if (el) {
          el.style.left = `${positions[i].x}px`;
          el.style.top = `${positions[i].y}px`;
        }
      }

      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {Array.from({ length: TRAIL }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { wrapperRefs.current[i] = el; }}
          style={{
            position: "fixed",
            transform: "translate(0%, 0%)",
            zIndex: TRAIL - i,
            opacity: 1,
            pointerEvents: "none",
          }}
        >
          <video
            ref={(el) => { videoRefs.current[i] = el; }}
            autoPlay
            muted
            playsInline
            onTimeUpdate={(e) => handleTimeUpdate(e.currentTarget)}
            style={{
              height: "40vh",
              width: "auto",
              objectFit: "cover",
              border: "4px solid #111",
              transform: "scaleX(-1)",
              // background: "transparent",         // ← explicit

              display: "block",
            }}
          >
            <source src={SRC_MOV} type="video/mp4" />
            <source src={SRC_WEBM} type="video/webm" />
          </video>
        </div>
      ))}
    </>
  );
}
