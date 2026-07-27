"use client";

import { useEffect, useRef } from "react";

const TRAIL = 22;
const LERPS = [
  0.22, 0.2, 0.18, 0.17, 0.16, 0.15, 0.145, 0.14, 0.135, 0.13, 0.125,
  0.12, 0.118, 0.115, 0.112, 0.11, 0.108, 0.105, 0.102, 0.1, 0.098, 0.095,
];
const SRC_WEBM = "https://res.cloudinary.com/dqv4mu7u6/video/upload/v1774730002/output_d6ptsb.webm";
const SRC_MOV = "https://res.cloudinary.com/dqv4mu7u6/video/upload/v1775169141/output-safari_rmccqx.mov";

const HEIGHT_VH = 40; // video height as % of viewport height (matches the old "height: 40vh")
const BORDER_PX = 4; // matches the old "4px solid #111"
const OFFSET_X = 48; // px to push the video right of the cursor
const OFFSET_Y = 48; // px to push the video below the cursor
const INK: [number, number, number, number] = [0x11 / 255, 0x11 / 255, 0x11 / 255, 1];

const VERT = `#version 300 es
in vec2 aPos;                 // unit quad, 0..1
uniform vec2 uTranslate;      // top-left, CSS px
uniform vec2 uSize;           // w,h, CSS px
uniform vec2 uRes;            // viewport, CSS px
uniform float uFlip;          // 1 = mirror X (scaleX(-1))
out vec2 vUV;
void main() {
  vec2 px = uTranslate + aPos * uSize;
  vec2 clip = (px / uRes) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  vUV = vec2(mix(aPos.x, 1.0 - aPos.x, uFlip), aPos.y);
}`;

const FRAG = `#version 300 es
precision mediump float;
in vec2 vUV;
uniform sampler2D uTex;
uniform int uMode;            // 0 = video texture, 1 = solid color
uniform vec4 uColor;
out vec4 o;
void main() {
  o = (uMode == 1) ? uColor : texture(uTex, vUV);   // alpha preserved
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
  return s;
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true });
    if (!gl) return;
    // keep the context recoverable rather than letting a loss become permanent
    const onLost = (e: Event) => e.preventDefault();
    canvas.addEventListener("webglcontextlost", onLost);

    // one video element — decodes ONCE (off-DOM)
    const video = document.createElement("video");
    video.crossOrigin = "anonymous"; // required to read cross-origin (Cloudinary) video into a WebGL texture
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;
    const ua = navigator.userAgent;
    const isSafari = /^((?!chrome|chromium|android|crios|fxios|firefox).)*safari/i.test(ua);
    video.src = isSafari ? SRC_MOV : SRC_WEBM;
    video.play().catch(() => {});

    // program + unit quad
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uTranslate = U("uTranslate"), uSize = U("uSize"), uRes = U("uRes");
    const uFlip = U("uFlip"), uMode = U("uMode"), uColor = U("uColor");

    // video texture (re-uploaded once per frame)
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); // normal alpha-over → see-through stays

    let W = 0, H = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const cx = W * 0.75, cy = H * 0.5;
    mouse.current = { x: cx, y: cy };
    const pos = Array.from({ length: TRAIL }, () => ({ x: cx, y: cy }));

    const onMove = (x: number, y: number) => (mouse.current = { x, y });
    const mm = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const tm = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) onMove(t.clientX, t.clientY);
    };
    window.addEventListener("mousemove", mm);
    window.addEventListener("touchstart", tm, { passive: true });
    window.addEventListener("touchmove", tm, { passive: true });

    const rect = (x: number, y: number, w: number, h: number) => {
      gl.uniform2f(uTranslate, x, y);
      gl.uniform2f(uSize, w, h);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    let raf = 0;
    const frame = () => {
      // trail follow — identical lerp chain to the DOM version
      for (let i = 0; i < TRAIL; i++) {
        const t = i === 0 ? mouse.current : pos[i - 1];
        pos[i].x += (t.x - pos[i].x) * LERPS[i];
        pos[i].y += (t.y - pos[i].y) * LERPS[i];
      }

      gl.clearColor(0, 0, 0, 0); // transparent — the page shows through
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, W, H);

      const ready = video.readyState >= 2 && video.videoWidth > 0;
      if (ready) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);

      const h = (HEIGHT_VH / 100) * H;
      const w = ready ? h * (video.videoWidth / video.videoHeight) : h;

      // back (i = TRAIL-1) → front (i = 0), matching the old z-order
      for (let i = TRAIL - 1; i >= 0; i--) {
        const x = pos[i].x + OFFSET_X, y = pos[i].y + OFFSET_Y; // top-left offset right & down of the trail point

        // border frame — 4 solid #111 edges (keeps the cutout transparent inside)
        gl.uniform1i(uMode, 1);
        gl.uniform4fv(uColor, INK);
        gl.uniform1f(uFlip, 0);
        rect(x - BORDER_PX, y - BORDER_PX, w + 2 * BORDER_PX, BORDER_PX); // top
        rect(x - BORDER_PX, y + h, w + 2 * BORDER_PX, BORDER_PX); // bottom
        rect(x - BORDER_PX, y, BORDER_PX, h); // left
        rect(x + w, y, BORDER_PX, h); // right

        // the video copy (mirrored, alpha preserved)
        if (ready) {
          gl.uniform1i(uMode, 0);
          gl.uniform1f(uFlip, 1);
          rect(x, y, w, h);
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("touchstart", tm);
      window.removeEventListener("touchmove", tm);
      canvas.removeEventListener("webglcontextlost", onLost);
      video.pause();
      video.removeAttribute("src"); // stop the load without an "Invalid URI" error
      video.load();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 10 }}
    />
  );
}
