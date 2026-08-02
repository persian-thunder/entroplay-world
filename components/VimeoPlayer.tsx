"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type PlayerType from "@vimeo/player";

// Vimeo's own chrome is fully suppressed; every control below is ours.
const EMBED_PARAMS = [
  "controls=0",
  "title=0",
  "byline=0",
  "portrait=0",
  "badge=0",
  "autopause=0",
  "keyboard=0",
  "playsinline=1",
  "dnt=1",
].join("&");

const PAPER = "#ECEBE4";
const INK = "#111111";
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

function timecode(s: number) {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function VimeoPlayer({
  id,
  aspect = 56.25,
}: {
  id: string;
  aspect?: number;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<PlayerType | null>(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hover, setHover] = useState(false);
  const [fs, setFs] = useState(false);

  // While scrubbing, the drag position wins over timeupdate events.
  const [scrub, setScrub] = useState<number | null>(null);
  const scrubbing = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let player: PlayerType | null = null;

    // Dynamic import keeps the SDK out of the initial bundle.
    import("@vimeo/player").then(({ default: Player }) => {
      if (cancelled || !iframeRef.current) return;
      player = new Player(iframeRef.current);
      playerRef.current = player;

      player.getDuration().then((d) => !cancelled && setDuration(d));
      player.getMuted().then((m) => !cancelled && setMuted(m));
      player.ready().then(() => !cancelled && setReady(true));

      player.on("timeupdate", ({ seconds, duration: d }) => {
        if (cancelled || scrubbing.current) return;
        setCurrent(seconds);
        if (d) setDuration(d);
      });
      player.on("play", () => {
        if (cancelled) return;
        setPlaying(true);
        setStarted(true);
      });
      player.on("pause", () => !cancelled && setPlaying(false));
      player.on("ended", () => {
        if (cancelled) return;
        setPlaying(false);
        setStarted(false);
      });
      player.on("volumechange", ({ volume }) => !cancelled && setMuted(volume === 0));
    });

    return () => {
      cancelled = true;
      playerRef.current = null;
      // The iframe may already be gone by the time this runs; swallow that.
      player?.destroy().catch(() => {});
    };
  }, [id]);

  useEffect(() => {
    const onFsChange = () =>
      setFs(document.fullscreenElement === wrapRef.current);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const toggle = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    // Unmute on the first deliberate play so autoplay policy isn't fighting us.
    playing ? p.pause() : p.play().catch(() => {});
  }, [playing]);

  const toggleMute = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    p.setMuted(!muted).then(() => setMuted(!muted));
  }, [muted]);

  const toggleFs = useCallback(() => {
    // Fullscreen the wrapper, not the iframe, so our bar comes along.
    if (document.fullscreenElement === wrapRef.current) {
      document.exitFullscreen();
    } else {
      wrapRef.current?.requestFullscreen?.().catch(() => {});
    }
  }, []);

  const posFromEvent = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el || !duration) return 0;
    const r = el.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - r.left) / r.width)) * duration;
  }, [duration]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!duration) return;
    scrubbing.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setScrub(posFromEvent(e.clientX));
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!scrubbing.current) return;
    setScrub(posFromEvent(e.clientX));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!scrubbing.current) return;
    const t = posFromEvent(e.clientX);
    scrubbing.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setCurrent(t);
    setScrub(null);
    playerRef.current?.setCurrentTime(t).catch(() => {});
  };

  const shown = scrub ?? current;
  const pct = duration ? (shown / duration) * 100 : 0;
  // Bar stays up until playback starts, then follows the cursor.
  const barVisible = !started || !playing || hover || scrubbing.current;

  return (
    <div
      ref={wrapRef}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        paddingBottom: fs ? 0 : `${aspect}%`,
        height: fs ? "100%" : 0,
        width: "100%",
        background: INK,
        overflow: "hidden",
        border: `1px solid ${INK}`,
      }}
    >
      <iframe
        ref={iframeRef}
        src={`https://player.vimeo.com/video/${id}?${EMBED_PARAMS}`}
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: "none",
          // Clicks belong to our overlay, not Vimeo's.
          pointerEvents: "none",
        }}
      />

      {/* Click-anywhere play surface */}
      <button
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        style={{
          position: "absolute",
          inset: 0,
          background: "none",
          border: "none",
          padding: 0,
          cursor: ready ? "pointer" : "default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!started && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "3.25rem",
              height: "3.25rem",
              background: PAPER,
              border: `1px solid ${INK}`,
              transition: `transform 0.5s ${SPRING}, opacity 0.4s ease`,
              transform: hover ? "scale(1.12)" : "scale(1)",
              opacity: ready ? 1 : 0,
            }}
          >
            <Triangle />
          </span>
        )}
      </button>

      {/* Control bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          gap: "0.7rem",
          padding: "0.45rem 0.7rem",
          background: PAPER,
          borderTop: `1px solid ${INK}`,
          color: INK,
          opacity: barVisible ? 1 : 0,
          transform: barVisible ? "translateY(0)" : "translateY(100%)",
          transition: "opacity 0.35s ease, transform 0.45s ease",
          pointerEvents: barVisible ? "auto" : "none",
        }}
      >
        <IconButton onClick={toggle} label={playing ? "Pause" : "Play"}>
          {playing ? <Pause /> : <Triangle />}
        </IconButton>

        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            flex: 1,
            height: "1rem",
            display: "flex",
            alignItems: "center",
            cursor: duration ? "pointer" : "default",
            touchAction: "none",
          }}
        >
          <div style={{ position: "relative", width: "100%", height: 1, background: INK, opacity: 0.35 }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: 1, width: `${pct}%`, background: INK, opacity: 1 }} />
            <div
              style={{
                position: "absolute",
                left: `${pct}%`,
                top: "50%",
                width: 7,
                height: 7,
                marginLeft: -3.5,
                marginTop: -3.5,
                background: INK,
                borderRadius: "50%",
                transition: `transform 0.4s ${SPRING}`,
                transform: hover || scrubbing.current ? "scale(1.4)" : "scale(1)",
              }}
            />
          </div>
        </div>

        <span
          style={{
            fontFamily: "'Bit', monospace",
            fontSize: "0.95rem",
            lineHeight: 1,
            letterSpacing: "0.02em",
            whiteSpace: "nowrap",
          }}
        >
          {timecode(shown)} / {timecode(duration)}
        </span>

        <IconButton onClick={toggleMute} label={muted ? "Unmute" : "Mute"}>
          {muted ? <SpeakerOff /> : <SpeakerOn />}
        </IconButton>
        <IconButton onClick={toggleFs} label="Fullscreen">
          <Expand />
        </IconButton>
      </div>
    </div>
  );
}

function IconButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      aria-label={label}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "none",
        border: "none",
        padding: 0,
        color: INK,
        cursor: "pointer",
        transition: `transform 0.5s ${SPRING}, opacity 0.3s ease`,
        transform: h ? "scale(1.18)" : "scale(1)",
        opacity: h ? 1 : 0.75,
      }}
    >
      {children}
    </button>
  );
}

/* Hand-drawn marks — no icon font, no Vimeo glyphs. */
const S = { display: "block" } as const;

const Triangle = () => (
  <svg width="13" height="14" viewBox="0 0 13 14" style={S} aria-hidden>
    <path d="M1 1l11 6-11 6z" fill="currentColor" />
  </svg>
);

const Pause = () => (
  <svg width="13" height="14" viewBox="0 0 13 14" style={S} aria-hidden>
    <rect x="1.5" y="1" width="3.5" height="12" fill="currentColor" />
    <rect x="8" y="1" width="3.5" height="12" fill="currentColor" />
  </svg>
);

const SpeakerOn = () => (
  <svg width="15" height="14" viewBox="0 0 15 14" style={S} aria-hidden>
    <path d="M1 5h3l3.5-3v10L4 9H1z" fill="currentColor" />
    <path d="M10 4.5a4 4 0 010 5M12 2.5a7 7 0 010 9" stroke="currentColor" strokeWidth="1.2" fill="none" />
  </svg>
);

const SpeakerOff = () => (
  <svg width="15" height="14" viewBox="0 0 15 14" style={S} aria-hidden>
    <path d="M1 5h3l3.5-3v10L4 9H1z" fill="currentColor" />
    <path d="M10 4.5l4 5M14 4.5l-4 5" stroke="currentColor" strokeWidth="1.2" fill="none" />
  </svg>
);

const Expand = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" style={S} aria-hidden>
    <path
      d="M1 5V1h4M13 5V1H9M1 9v4h4M13 9v4H9"
      stroke="currentColor"
      strokeWidth="1.3"
      fill="none"
    />
  </svg>
);
