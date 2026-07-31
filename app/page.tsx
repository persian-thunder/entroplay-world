"use client";

import { useEffect, useRef } from "react";
import SketchControls, { type ParamSpec, type Params } from "@/components/SketchControls";

const TRAIL = 20;
const LERPS = [
  0.26, 0.24, 0.22, 0.21, 0.2, 0.19, 0.185, 0.18, 0.175, 0.17,
  0.165, 0.16, 0.156, 0.152, 0.148, 0.145, 0.142, 0.139, 0.136, 0.133,
  0.13, 0.128, 0.126, 0.124, 0.122, 0.12, 0.118, 0.116, 0.114, 0.112,
];
const SRC_WEBM = "https://res.cloudinary.com/dqv4mu7u6/video/upload/v1774730002/output_d6ptsb.webm";
const SRC_MOV = "https://res.cloudinary.com/dqv4mu7u6/video/upload/v1775169141/output-safari_rmccqx.mov";

// movie speed
const PLAYBACK_RATE = 1.95;
const HEIGHT_VH = 40;
const BORDER_PX = 4;

// cursor offset
const OFFSET_X = 48;
const OFFSET_Y = 48;

// gl color conversion
const INK: [number, number, number, number] = [0x11 / 255, 0x11 / 255, 0x11 / 255, 1];

// click ripple 
const MAX_RIPPLES = 6;
const RIPPLE_SPEED = 200;
const RIPPLE_WIDTH = 210;
const RIPPLE_AMP = 300;
const RIPPLE_DAMP = 1.25;
const RIPPLE_LIFE = 6.8;

// datamosh
//   motion vectors come from block matching
//   one vector per macroblock
//   vector walk compounded over several taps with no new pixels arriving making pic melt
const MOSH_BLOCK = 48;
const MOSH_SEARCH = 12;
const MOSH_STEP = 4; 
const MOSH_GAIN = 0.05;
const MOSH_TAPS = 7;
const MOSH_PERSIST = 0.21;
const MOSH_SHARPEN = 0.45;
const MOSH_STATIC = 0.86;
const MOSH_QUANT = 1;
const MOSH_BLOCKVIS = 0.64;
const MOSH_RGB_SPLIT = 0.38;
const MOSH_CHROMA = 1; 
const MOSH_CHROMA_SUB = 6; 
const MOSH_CHROMA_LEAD = 4; 
const MOSH_TINT = 0.28; 

const ERASE_RATE = 0.97;
const ERASE_GRAIN = 3;
const ERASE_GRAIN_VAR = 18;

const ERASE_SMEAR = 16;
const ERASE_DARK = 0.12;

const INK_REJECT = 0.95;
const MOSH_ATTACK = 0.16;
const MOSH_RELEASE = 0.12;
const TAP_SLOP = 34;

const SEARCH_R = Math.round(MOSH_SEARCH / MOSH_STEP); // candidates per axis = 2R+1

const DEFAULTS: Params = {
  TRAIL, TRAIL_SPEED: 0.85,
  PLAYBACK_RATE, HEIGHT_VH, BORDER_PX, OFFSET_X, OFFSET_Y,
  RIPPLE_SPEED, RIPPLE_WIDTH, RIPPLE_AMP, RIPPLE_DAMP, RIPPLE_LIFE,
  MOSH_BLOCK, MOSH_GAIN, MOSH_TAPS, MOSH_PERSIST, MOSH_STATIC, MOSH_SHARPEN,
  MOSH_QUANT, MOSH_BLOCKVIS, MOSH_RGB_SPLIT,
  MOSH_CHROMA, MOSH_CHROMA_SUB, MOSH_CHROMA_LEAD, MOSH_TINT,
  MOSH_ATTACK, MOSH_RELEASE,
  ERASE_RATE, ERASE_GRAIN, ERASE_GRAIN_VAR, ERASE_SMEAR, ERASE_DARK,
  INK_REJECT, TAP_SLOP,
};

const SHOW_CONTROLS = false;

const SCHEMA: ParamSpec[] = [
  { group: "trail", key: "TRAIL", label: "copies", min: 1, max: 60, step: 1 },
  { group: "trail", key: "TRAIL_SPEED", label: "follow speed", min: 0.3, max: 2.5, step: 0.05, hint: "scales the whole lerp chain" },
  { group: "trail", key: "PLAYBACK_RATE", label: "video rate", min: 0.25, max: 4, step: 0.05 },
  { group: "trail", key: "HEIGHT_VH", label: "size (vh)", min: 8, max: 80, step: 1 },
  { group: "trail", key: "BORDER_PX", label: "border px", min: 0, max: 16, step: 1 },
  { group: "trail", key: "OFFSET_X", label: "offset x", min: -200, max: 200, step: 2 },
  { group: "trail", key: "OFFSET_Y", label: "offset y", min: -200, max: 200, step: 2 },

  { group: "datamosh", key: "MOSH_BLOCK", label: "macroblock", min: 4, max: 48, step: 4, hint: "flow cost scales as 1/BLOCK^2" },
  { group: "datamosh", key: "MOSH_GAIN", label: "vector gain", min: 0, max: 4, step: 0.05 },
  { group: "datamosh", key: "MOSH_TAPS", label: "taps (melt)", min: 1, max: 16, step: 1 },
  { group: "datamosh", key: "MOSH_PERSIST", label: "persistence", min: 0, max: 1, step: 0.01 },
  { group: "datamosh", key: "MOSH_STATIC", label: "static gate", min: 0.5, max: 1, step: 0.01 },
  { group: "datamosh", key: "MOSH_RGB_SPLIT", label: "rgb split", min: 0, max: 1.5, step: 0.02 },
  { group: "datamosh", key: "MOSH_CHROMA", label: "chroma lag", min: 0, max: 1, step: 0.02 },
  { group: "datamosh", key: "MOSH_CHROMA_SUB", label: "chroma sub", min: 1, max: 6, step: 0.5 },
  { group: "datamosh", key: "MOSH_CHROMA_LEAD", label: "chroma lead", min: 0, max: 4, step: 0.05 },
  { group: "datamosh", key: "MOSH_TINT", label: "direction tint", min: 0, max: 1, step: 0.02 },
  { group: "datamosh", key: "MOSH_QUANT", label: "quantisation", min: 0, max: 1, step: 0.02 },
  { group: "datamosh", key: "MOSH_BLOCKVIS", label: "dct seams", min: 0, max: 1, step: 0.02 },
  { group: "datamosh", key: "MOSH_SHARPEN", label: "sharpen", min: 0, max: 2, step: 0.05 },
  { group: "datamosh", key: "MOSH_ATTACK", label: "attack (s)", min: 0.01, max: 1, step: 0.01 },
  { group: "datamosh", key: "MOSH_RELEASE", label: "release (s)", min: 0.01, max: 1.5, step: 0.01 },
  { group: "datamosh", key: "INK_REJECT", label: "ink reject", min: 0, max: 1, step: 0.05 },

  { group: "eraser", key: "ERASE_RATE", label: "bite rate", min: 0, max: 1, step: 0.01 },
  { group: "eraser", key: "ERASE_GRAIN", label: "min cell px", min: 1, max: 40, step: 1 },
  { group: "eraser", key: "ERASE_GRAIN_VAR", label: "size spread", min: 1, max: 20, step: 0.5 },
  { group: "eraser", key: "ERASE_SMEAR", label: "drag px", min: 0, max: 40, step: 1 },
  { group: "eraser", key: "ERASE_DARK", label: "dark spare", min: 0, max: 1, step: 0.02 },

  { group: "ripple", key: "RIPPLE_SPEED", label: "speed px/s", min: 100, max: 3000, step: 50 },
  { group: "ripple", key: "RIPPLE_WIDTH", label: "crest width", min: 10, max: 300, step: 5 },
  { group: "ripple", key: "RIPPLE_AMP", label: "amplitude", min: 0, max: 300, step: 5 },
  { group: "ripple", key: "RIPPLE_DAMP", label: "damping", min: 0.2, max: 6, step: 0.05 },
  { group: "ripple", key: "RIPPLE_LIFE", label: "life (s)", min: 0.3, max: 8, step: 0.1 },
  { group: "ripple", key: "TAP_SLOP", label: "tap slop px", min: 0, max: 40, step: 1 },
];

// Resample the hand-tuned curve to any copy count, then scale it. Generating the chain
// rather than indexing a fixed array is what lets TRAIL move at runtime — a short LERPS
// would hand the loop `undefined` and put NaN into every position past its end.
function lerpChain(n: number, speed: number) {
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0 : (i / (n - 1)) * (LERPS.length - 1);
    const a = Math.floor(t), b = Math.min(LERPS.length - 1, a + 1);
    out[i] = Math.min(0.98, (LERPS[a] + (LERPS[b] - LERPS[a]) * (t - a)) * speed);
  }
  return out;
}

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

// shared by every fullscreen pass below
const QUAD_VERT = `#version 300 es
in vec2 aPos;                 // same unit quad, reused as a fullscreen tri-pair
out vec2 vUV;
void main() {
  vUV = aPos;
  gl_Position = vec4(aPos * 2.0 - 1.0, 0.0, 1.0);
}`;

// motion estimation — renders at BLOCK resolution, so one fragment == one macroblock.
// Coarse SAD search, then a ±2px refine around the winner. Everything is done in
// uv-scaled pixels; both textures share an orientation so the vector is self-consistent
// and never needs a y-flip.
const FLOW_FRAG = `#version 300 es
precision highp float;
#define R ${SEARCH_R}
in vec2 vUV;
uniform sampler2D uCur;
uniform sampler2D uPrev;
uniform vec2 uRes;            // full-res, uv-scaled px
uniform float uBlock, uStep, uRange, uStatic;
out vec4 o;

float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
float tap(sampler2D t, vec2 px) { return luma(texture(t, px / uRes).rgb); }

// 3x3 probe inside the block — full 16x16 SAD would be 256 fetches per candidate
float sad(vec2 centre, vec2 d) {
  float s = 0.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 off = vec2(float(i), float(j)) * (uBlock * 0.33);
      s += abs(tap(uCur, centre + off) - tap(uPrev, centre + off + d));
    }
  }
  return s;
}

void main() {
  vec2 centre = (floor(vUV * uRes / uBlock) + 0.5) * uBlock;

  float zero = sad(centre, vec2(0.0));   // reference cost for "nothing moved here"
  float best = zero;
  vec2 bestV = vec2(0.0);

  for (int j = -R; j <= R; j++) {
    for (int i = -R; i <= R; i++) {
      vec2 d = vec2(float(i), float(j)) * uStep;
      float s = sad(centre, d) + length(d) * 0.002;  // slight bias toward staying still
      if (s < best) { best = s; bestV = d; }
    }
  }
  // refine to whole pixels around the coarse winner
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 d = bestV + vec2(float(i), float(j));
      float s = sad(centre, d) + length(d) * 0.002;
      if (s < best) { best = s; bestV = d; }
    }
  }

  // a block only counts as moving if the match genuinely beat standing still; without
  // this, noise in flat areas invents vectors and the whole frame crawls
  if (best > zero * uStatic) bestV = vec2(0.0);

  o = vec4(clamp(bestV / uRange, -1.0, 1.0) * 0.5 + 0.5, 0.0, 1.0);
}`;

// datamosh — advect the feedback buffer along the block flow, compounding the walk
// shared by the mosh and present passes. the host shader supplies uRes and uBlock.
const FLOW_LIB = `
uniform sampler2D uFlow;      // one vector per macroblock, NEAREST
uniform vec2 uBlocks, uDevice;
uniform float uRange;

// NEAREST + sampling the block's own texel means no blending between neighbours, so the
// displacement stays piecewise-constant and the edges stay hard. mult > 1 reads the field
// at a coarser granularity — that is chroma subsampling.
vec2 blockFlow(vec2 uv, float mult) {
  vec2 blk = floor(uv * uRes / (uBlock * mult)) * mult;
  vec2 v = texture(uFlow, (blk + mult * 0.5) / uBlocks).rg;
  return (v * 2.0 - 1.0) * uRange;
}

// walk the vector field, snapping every hop to a whole DEVICE pixel. with NEAREST
// sampling that makes each tap an exact texel copy, so compounding the walk can never
// average neighbours — averaging is what was quietly dissolving the picture into mush.
vec2 walk(vec2 p, int taps, float mult, float gain) {
  vec2 toDev = uDevice / uRes;
  for (int i = 0; i < 16; i++) {
    if (i >= taps) break;
    vec2 mvPx = round(blockFlow(p, mult) * gain * toDev);
    p = clamp(p + mvPx / uDevice, vec2(0.0), vec2(1.0));
  }
  return p;
}
`;

// datamosh — advect the feedback along the block flow, compounding the walk.
//
// This buffer feeds itself, so it does EXACT TEXEL COPIES AND NOTHING ELSE. Any multiply,
// colour mix or filter applied here re-applies every frame and compounds: a seam darkening
// marches the picture to black, a chroma swap greys it out, bilinear sampling mushes it.
// Every treatment belongs in the present pass, where it runs once.
const MOSH_FRAG = `#version 300 es
precision highp float;
in vec2 vUV;
uniform sampler2D uSource;    // this frame's clean trail render
uniform sampler2D uFeedback;  // last frame's output — the stale "reference picture"
uniform vec2 uRes;
uniform float uBlock, uGain, uTaps, uHold, uPersist;
uniform float uPaint, uErase, uEraseRate, uEraseGrain, uEraseVar, uEraseSmear, uEraseDark, uSeed, uInk;
${FLOW_LIB}
out vec4 o;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  // A P-frame copies from the reference at uv + mv. Compounding that walk with no new
  // pixels arriving IS the bloom — the picture melts along its own motion field.
  vec2 p = walk(vUV, int(uTaps + 0.5), 1.0, uGain);
  vec4 adv = texture(uFeedback, p);      // what the motion vector drags in
  vec4 stay = texture(uFeedback, vUV);   // what is already here

  // A decoded video frame is opaque everywhere, so advecting it always pulls in more
  // picture. This canvas is mostly transparent, so the trailing edge backfills with
  // nothing and the ribbon walks off itself — which reads as an unexplained fade.
  // Keeping whichever sample carries more coverage pins the trail in place: the leading
  // edge advances, the tail stays. step() gives a hard select, so this never averages
  // the two and never softens the result.
  float keep = step(adv.a, stay.a * uPersist);
  // hard switch, not a blend — a fractional mix of two texels is an average, and an
  // average inside this loop is exactly the softening we spent so long removing
  float moshing = step(0.5, uHold);
  vec4 base = mix(stay, mix(adv, stay, keep), moshing);

  // Eraser: THE VIDEO IS THE BRUSH. No radius, no disc — the live ribbon's own coverage is
  // the mask, so dragging the trail across the canvas is what wears it away, and the
  // erosion carries the shape and texture of the footage instead of a cursor stamp.
  // Both operations are exact texel work, so this degrades without turning to mush:
  //   1. survivors are DRAGGED along the motion field, streaking as they go
  //   2. cells are knocked out on a per-frame dither, so coverage granulates away
  // The dither reseeds every frame, so passing over the same spot keeps eating it.
  vec4 live = texture(uSource, vUV);
  if (uErase > 0.5 && live.a > 0.001) {
    // the footage's own brightness modulates the bite — dark frames gnaw slowly,
    // bright ones strip it, so the wear pattern is the video, not a brush
    float lum = dot(live.rgb / max(live.a, 1e-4), vec3(0.299, 0.587, 0.114));
    float bite = live.a * mix(uEraseDark, 1.0, lum) * uEraseRate;

    // whole device pixels only — a fractional drag would average and soften
    vec2 off = round(blockFlow(vUV, 1.0) * uEraseSmear * (uDevice / uRes));
    base = texture(uFeedback, clamp(vUV + off / uDevice, vec2(0.0), vec2(1.0)));

    // Vary the cell size by region. A single grain size dissolves as uniform per-pixel
    // static; picking the size from a region hash makes some patches crumble in chunks
    // while others go to sand. The region hash carries no seed, so the SIZES hold still
    // and only which cells die changes — otherwise the chunking itself would crawl.
    vec2 q2 = vUV * uRes;
    float region = hash(floor(q2 / (uEraseGrain * uEraseVar * 2.0)) + 3.7);
    // sqrt pushes the distribution UP, so most regions land on the coarse end and only a
    // few stay fine. region*region did the opposite and kept it sandy.
    float grain = uEraseGrain * mix(1.0, uEraseVar, sqrt(region));

    float h = hash(floor(q2 / grain) + vec2(uSeed, uSeed * 1.7));
    base *= step(bite, h);
  }

  // The trail is committed to the canvas ONLY while the button is held. Hovering leaves
  // the buffer untouched — the live ribbon is composited on top at display time instead,
  // so it can be seen without being painted in.
  //
  // Destination-over, NOT source-over: new material fills where the canvas is still
  // empty and never paints over what is already there. Source-over re-stamped the crisp
  // ribbon on top of its own smear every frame, which scrubbed the mosh back off as fast
  // as it formed — no new pixels arriving is the whole premise of dropping I-frames.
  // Only the PICTURE is committed, never the chrome. The trail draws 4 opaque #111 border
  // rects per copy — 88 a frame — and with paint always on those accumulate permanently and
  // then get advected into solid black sludge. Reject them by saturation rather than
  // brightness: the frames are pure grey (sat 0) while even the darkest video is strongly
  // blue, so this drops the ink without eating shadow detail.
  vec3 un = live.rgb / max(live.a, 1e-4);
  float mx = max(max(un.r, un.g), un.b), mn = min(min(un.r, un.g), un.b);
  float sat = (mx - mn) / max(mx, 1e-4);
  float keepInk = 1.0 - uInk;
  float paintable = max(keepInk, max(smoothstep(0.10, 0.25, sat), smoothstep(0.25, 0.45, mx)));
  o = mix(base, base + live * paintable * (1.0 - base.a), uPaint);
}`;

// present pass — draws the buffer to the canvas, displaced by live ripples
const POST_FRAG = `#version 300 es
precision mediump float;
#define MAX_RIPPLES ${MAX_RIPPLES}
in vec2 vUV;
uniform sampler2D uScene;             // the persistent painted canvas
uniform sampler2D uLive;              // this frame's clean trail, drawn on top
uniform vec2 uRes;                    // viewport, CSS px
uniform int uCount;                   // live ripples, 0..MAX_RIPPLES
uniform vec2 uCenter[MAX_RIPPLES];    // click point, CSS px (y-down)
uniform float uAge[MAX_RIPPLES];      // seconds since the click
uniform float uSpeed, uWidth, uAmp, uDamp;
uniform float uBlock, uQuant, uBlockVis;
uniform float uTaps, uGain, uChroma, uChromaSub, uChromaLead, uTint, uSharpen, uRgbSplit, uLiveAmt;
${FLOW_LIB}
out vec4 o;

vec3 toYCbCr(vec3 c) {
  float y = dot(c, vec3(0.299, 0.587, 0.114));
  return vec3(y, (c.b - y) * 0.564, (c.r - y) * 0.713);
}
vec3 toRGB(vec3 v) {
  return vec3(v.x + 1.403 * v.z, v.x - 0.344 * v.y - 0.714 * v.z, v.x + 1.773 * v.y);
}

// applied once on the way to the screen, never written back into the feedback buffer
vec4 codecArtifacts(vec4 c, vec2 uv) {
  if (uQuant > 0.001) {
    // coarse quantisation, the way a starved encoder throws away high-frequency
    // coefficients and leaves flat plateaus. done unpremultiplied or the colour drifts.
    float a = max(c.a, 1e-4);
    float steps = mix(64.0, 5.0, uQuant);
    c.rgb = (floor((c.rgb / a) * steps + 0.5) / steps) * a;
  }
  if (uBlockVis > 0.001) {
    vec2 g = fract(uv * uRes / uBlock);
    float edge = min(min(g.x, g.y), min(1.0 - g.x, 1.0 - g.y));
    float seam = 1.0 - smoothstep(0.0, 1.5 / uBlock, edge);
    c.rgb *= 1.0 - seam * uBlockVis * 0.55;   // the DCT grid poking through
  }
  return c;
}

void main() {
  vec2 frag = vec2(vUV.x * uRes.x, (1.0 - vUV.y) * uRes.y);   // to CSS px, y-down
  vec2 push = vec2(0.0);

  for (int i = 0; i < MAX_RIPPLES; i++) {
    if (i >= uCount) break;
    vec2 d = frag - uCenter[i];
    float dist = length(d) + 1e-4;
    float k = (dist - uAge[i] * uSpeed) / uWidth;   // signed distance from the crest
    float band = exp(-k * k);                      // gaussian falloff either side of it
    float decay = exp(-uAge[i] * uDamp);
    push += (d / dist) * (uAmp * band * decay);    // shove outward along the radius
  }

  vec2 warped = frag + push;
  vec2 uv = clamp(vec2(warped.x / uRes.x, 1.0 - warped.y / uRes.y), 0.0, 1.0);
  vec4 col = texture(uScene, uv);   // ripple is displacement only

  if (uSharpen > 0.001) {
    // unsharp mask against the 4-neighbourhood, in DEVICE texels. safe here because the
    // present pass runs once on the way to screen — the same kernel in the feedback loop
    // would compound into ringing within a second.
    vec2 t = 1.0 / uDevice;
    vec4 lo = 0.25 * (texture(uScene, uv + vec2(t.x, 0.0)) + texture(uScene, uv - vec2(t.x, 0.0))
                    + texture(uScene, uv + vec2(0.0, t.y)) + texture(uScene, uv - vec2(0.0, t.y)));
    col = clamp(col + (col - lo) * uSharpen, 0.0, 1.0);
  }

  if (uRgbSplit > 0.001) {
    // Per-channel motion vectors: R, G and B each walk the SAME field at a different
    // gain, so the channels come to rest on different blocks and separate along the
    // direction of motion. Static blocks hold a zero vector, so all three land on the
    // same texel and stay perfectly registered — the split is motion-gated for free.
    int tp = int(uTaps + 0.5);
    // ONE walk, then scale its accumulated displacement per channel. Walking three times
    // meant 3 x 8 taps of flow lookups on every fragment at full device resolution, which
    // is what was pinning the GPU process. Channels still separate along the same path.
    vec2 pg = walk(uv, tp, 1.0, uGain);
    vec2 d = pg - uv;
    vec4 sg = texture(uScene, pg);
    vec4 sr = texture(uScene, clamp(uv + d * (1.0 - uRgbSplit), vec2(0.0), vec2(1.0)));
    vec4 sb = texture(uScene, clamp(uv + d * (1.0 + uRgbSplit), vec2(0.0), vec2(1.0)));
    // widest coverage wins, so a channel landing on empty parchment cannot punch a hole
    float a = max(max(sr.a, sg.a), sb.a);
    vec3 un = vec3(sr.r / max(sr.a, 1e-4), sg.g / max(sg.a, 1e-4), sb.b / max(sb.a, 1e-4));
    col = vec4(clamp(un, 0.0, 1.0) * a, a);
  }

  if (uChroma > 0.001) {
    // 4:2:0 — chroma lives at half resolution and gets dragged by coarser vectors than
    // luma, so colour separates from brightness and smears past the shape. luma keeps
    // the form, chroma runs ahead of it.
    vec4 sC = texture(uScene, walk(uv, int(uTaps + 0.5), uChromaSub, uGain * uChromaLead));
    vec3 yL = toYCbCr(col.rgb / max(col.a, 1e-4));
    vec3 yC = toYCbCr(sC.rgb / max(sC.a, 1e-4));
    // only borrow chroma from somewhere that actually HAS content — sampling the empty
    // parchment returns neutral chroma, which just desaturates the ribbon to grey
    float w = uChroma * smoothstep(0.02, 0.25, sC.a);
    col.rgb = clamp(toRGB(vec3(yL.x, mix(yL.yz, yC.yz, w))), 0.0, 1.0) * col.a;
  }

  if (uTint > 0.001) {
    // tint each block by the DIRECTION of its motion vector — the flow-field hue wheel
    vec2 mv = blockFlow(uv, 1.0);
    float mag = clamp(length(mv) / uRange, 0.0, 1.0);
    vec3 hue = 0.5 + 0.5 * cos(atan(mv.y, mv.x) + vec3(0.0, 2.094, 4.188));
    col.rgb = mix(col.rgb, col.rgb * hue * 1.7, uTint * mag);
  }

  col = codecArtifacts(col, vUV);
  col.rgb = min(col.rgb, vec3(col.a));   // hold the premultiplied invariant rgb <= a

  // The live ribbon rides on top while hovering, and fades out as the press takes hold so
  // the ribbon dissolves INTO the mosh instead of sitting on top of it. Drawing it at full
  // strength during a hold just buried the effect under a clean copy of itself.
  // Scaling premultiplied rgba by a scalar is a valid fade to transparent.
  vec4 live = texture(uLive, uv) * uLiveAmt;
  o = live + col * (1.0 - live.a);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
  return s;
}

function makeProgram(gl: WebGL2RenderingContext, vs: string, fs: string) {
  const p = gl.createProgram()!;
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
  gl.bindAttribLocation(p, 0, "aPos"); // pin every program to the same attrib slot
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) console.error(gl.getProgramInfoLog(p));
  return p;
}

// colour target used as both a render target and a sampler source
function makeTarget(gl: WebGL2RenderingContext, unit: number, nearest = false) {
  const tex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  const f = nearest ? gl.NEAREST : gl.LINEAR;
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, f);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, f);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { tex, fbo, unit };
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouse = useRef({ x: 0, y: 0 });
  // the render loop reads this object every frame; the panel writes straight into it
  const paramsRef = useRef<Params>({ ...DEFAULTS });

  useEffect(() => {
    const PAR = paramsRef.current;
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
    video.playbackRate = PAR.PLAYBACK_RATE;
    // some browsers reset playbackRate when new media loads
    const onLoaded = () => (video.playbackRate = PAR.PLAYBACK_RATE);
    video.addEventListener("loadedmetadata", onLoaded);
    video.play().catch(() => {});

    const prog = makeProgram(gl, VERT, FRAG);
    const flowP = makeProgram(gl, QUAD_VERT, FLOW_FRAG);
    const moshP = makeProgram(gl, QUAD_VERT, MOSH_FRAG);
    const post = makeProgram(gl, QUAD_VERT, POST_FRAG);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uTranslate = U("uTranslate"), uSize = U("uSize"), uRes = U("uRes");
    const uFlip = U("uFlip"), uMode = U("uMode"), uColor = U("uColor"), uTex = U("uTex");

    const F = (n: string) => gl.getUniformLocation(flowP, n);
    const fCur = F("uCur"), fPrev = F("uPrev"), fRes = F("uRes"), fBlock = F("uBlock");
    const fStep = F("uStep"), fRange = F("uRange"), fStatic = F("uStatic");

    const M = (n: string) => gl.getUniformLocation(moshP, n);
    const mSource = M("uSource"), mFeedback = M("uFeedback"), mFlow = M("uFlow");
    const mRes = M("uRes"), mBlocks = M("uBlocks"), mBlock = M("uBlock"), mGain = M("uGain");
    const mTaps = M("uTaps"), mHold = M("uHold"), mRange = M("uRange"), mDevice = M("uDevice");
    const mPersist = M("uPersist"), mPaint = M("uPaint"), mErase = M("uErase");
    const mEraseRate = M("uEraseRate"), mEraseGrain = M("uEraseGrain"), mEraseVar = M("uEraseVar");
    const mEraseSmear = M("uEraseSmear"), mEraseDark = M("uEraseDark");
    const mSeed = M("uSeed"), mInk = M("uInk");

    const P = (n: string) => gl.getUniformLocation(post, n);
    const pScene = P("uScene"), pRes = P("uRes"), pCount = P("uCount");
    const pCenter = P("uCenter"), pAge = P("uAge");
    const pSpeed = P("uSpeed"), pWidth = P("uWidth"), pAmp = P("uAmp"), pDamp = P("uDamp");
    const pBlock = P("uBlock"), pQuant = P("uQuant"), pBlockVis = P("uBlockVis");
    const pFlow = P("uFlow"), pBlocks = P("uBlocks"), pDevice = P("uDevice"), pRange = P("uRange");
    const pTaps = P("uTaps"), pGain = P("uGain"), pChroma = P("uChroma");
    const pChromaSub = P("uChromaSub"), pChromaLead = P("uChromaLead"), pTint = P("uTint");
    const pSharpen = P("uSharpen"), pRgbSplit = P("uRgbSplit");
    const pLive = P("uLive"), pLiveAmt = P("uLiveAmt");

    // video texture on unit 0 (re-uploaded once per frame)
    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

    // every intermediate target is NEAREST. these are resampled once per frame by the
    // feedback loop, and LINEAR here means each pass averages 4 texels — 60x a second
    // that is a low-pass filter running continuously, which reads as an unexplained fade.
    const sceneA = makeTarget(gl, 1, true);
    const sceneB = makeTarget(gl, 2, true);
    const moshA = makeTarget(gl, 3, true);
    const moshB = makeTarget(gl, 4, true);
    const flowT = makeTarget(gl, 5, true); // no interpolation between block vectors
    let curS = sceneA, prevS = sceneB;
    let readM = moshA, writeM = moshB;

    let W = 0, H = 0, BX = 1, BY = 1;
    const resize = () => {
      // 1.5 rather than 2: the mosh and present passes are per-fragment heavy, and dropping
      // from 2.0 to 1.5 cuts both their cost and the four full-screen RGBA8 targets by ~44%
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      BX = Math.max(1, Math.ceil(W / PAR.MOSH_BLOCK));
      BY = Math.max(1, Math.ceil(H / PAR.MOSH_BLOCK));

      for (const t of [sceneA, sceneB, moshA, moshB]) {
        gl.activeTexture(gl.TEXTURE0 + t.unit);
        gl.bindTexture(gl.TEXTURE_2D, t.tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      }
      gl.activeTexture(gl.TEXTURE0 + flowT.unit);
      gl.bindTexture(gl.TEXTURE_2D, flowT.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, BX, BY, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

      // freshly allocated storage is undefined — clear or frame 1 samples garbage
      gl.clearColor(0, 0, 0, 0);
      for (const t of [sceneA, sceneB, moshA, moshB, flowT]) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };
    resize();
    window.addEventListener("resize", resize);

    const cx = W * 0.75, cy = H * 0.5;
    mouse.current = { x: cx, y: cy };
    const pos = Array.from({ length: PAR.TRAIL }, () => ({ x: cx, y: cy }));
    let chain = lerpChain(PAR.TRAIL, PAR.TRAIL_SPEED);
    let chainN = PAR.TRAIL, chainS = PAR.TRAIL_SPEED;

    // press state — a short press fires a ripple, a held press drops I-frames
    let held = false, travelled = 0, holdAmt = 0;

    const ripples: { x: number; y: number; t: number }[] = [];
    const centers = new Float32Array(MAX_RIPPLES * 2);
    const ages = new Float32Array(MAX_RIPPLES);
    const spawn = (x: number, y: number) => {
      ripples.push({ x, y, t: performance.now() / 1000 });
      if (ripples.length > MAX_RIPPLES) ripples.shift(); // oldest drops off
    };

    const onMove = (x: number, y: number) => {
      if (held) travelled += Math.hypot(x - mouse.current.x, y - mouse.current.y);
      mouse.current = { x, y };
    };
    const mm = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const tm = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) onMove(t.clientX, t.clientY);
    };
    const press = (x: number, y: number) => {
      held = true;
      travelled = 0;
      onMove(x, y);
    };
    const release = (x: number, y: number) => {
      if (held && travelled < PAR.TAP_SLOP) spawn(x, y); // it was a click, not a drag
      held = false;
    };
    // press paints, hover erases — the two gestures no longer collide, so the eraser does
    // not need a button of its own any more
    const md = (e: MouseEvent) => { if (e.button === 0) press(e.clientX, e.clientY); };
    const mu = (e: MouseEvent) => { if (e.button === 0) release(e.clientX, e.clientY); };
    let wipe = false; // the canvas persists forever, so it needs an explicit reset
    const dc = () => (wipe = true);
    const td = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) press(t.clientX, t.clientY);
    };
    const tu = () => release(mouse.current.x, mouse.current.y);

    // the canvas is pointer-events:none, so listening on window doesn't steal clicks from the nav
    window.addEventListener("mousemove", mm);
    window.addEventListener("mousedown", md);
    window.addEventListener("mouseup", mu);
    window.addEventListener("dblclick", dc);
    window.addEventListener("touchstart", tm, { passive: true });
    window.addEventListener("touchmove", tm, { passive: true });
    window.addEventListener("touchstart", td, { passive: true });
    window.addEventListener("touchend", tu, { passive: true });

    const rect = (x: number, y: number, w: number, h: number) => {
      gl.uniform2f(uTranslate, x, y);
      gl.uniform2f(uSize, w, h);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    const bind = (unit: number, t: WebGLTexture) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
    };

    let raf = 0;
    let seed = 0;
    let texW = 0, texH = 0; // current video texture allocation, so uploads can reuse it
    let lastT = performance.now() / 1000;
    const frame = () => {
      const now = performance.now() / 1000;
      const dt = Math.min(0.05, now - lastT); // clamp so a backgrounded tab doesn't jump
      lastT = now;

      while (ripples.length && now - ripples[0].t > PAR.RIPPLE_LIFE) ripples.shift();

      const rate = Math.min(1, dt / (held ? PAR.MOSH_ATTACK : PAR.MOSH_RELEASE));
      holdAmt += ((held ? 1 : 0) - holdAmt) * rate;
      // an exponential ramp never quite arrives, and a holdAmt of 0.997 still bleeds a
      // little clean frame in every tick — enough to keep softening the freeze. snap it.
      if (holdAmt > 0.995) holdAmt = 1;
      else if (holdAmt < 0.005) holdAmt = 0;

      // trail follow — identical lerp chain to the DOM version
      // copy count and follow speed are both live, so the chain is rebuilt on change.
      // new copies spawn on top of the current tail rather than at the origin, otherwise
      // they whip across the screen the moment the slider moves.
      const nTrail = Math.max(1, Math.round(PAR.TRAIL));
      if (nTrail !== pos.length) {
        const tail = pos[pos.length - 1] ?? { x: mouse.current.x, y: mouse.current.y };
        while (pos.length < nTrail) pos.push({ x: tail.x, y: tail.y });
        pos.length = nTrail;
      }
      if (nTrail !== chainN || PAR.TRAIL_SPEED !== chainS) {
        chain = lerpChain(nTrail, PAR.TRAIL_SPEED);
        chainN = nTrail;
        chainS = PAR.TRAIL_SPEED;
      }

      for (let i = 0; i < nTrail; i++) {
        const t = i === 0 ? mouse.current : pos[i - 1];
        pos[i].x += (t.x - pos[i].x) * chain[i];
        pos[i].y += (t.y - pos[i].y) * chain[i];
      }

      // pass 1: trail into current scene target
      gl.bindFramebuffer(gl.FRAMEBUFFER, curS.fbo);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(prog);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); // normal alpha-over → see-through stays
      gl.clearColor(0, 0, 0, 0); // transparent bg
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, W, H);
      gl.uniform1i(uTex, 0);

      const ready = video.readyState >= 2 && video.videoWidth > 0;
      if (ready) {
        bind(0, tex!);
        // texImage2D RE-SPECIFIES the texture: at 1280x1280 RGBA that is a fresh 6.5 MB
        // allocation every frame, ~400 MB/s of driver-side churn. Allocate once, then
        // texSubImage2D into the existing storage.
        if (video.videoWidth !== texW || video.videoHeight !== texH) {
          texW = video.videoWidth;
          texH = video.videoHeight;
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
        } else {
          gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, video);
        }
      }

      const h = (PAR.HEIGHT_VH / 100) * H;
      const w = ready ? h * (video.videoWidth / video.videoHeight) : h;

      // back (i = TRAIL-1) → front (i = 0), matching the old z-order
      for (let i = nTrail - 1; i >= 0; i--) {
        const x = pos[i].x + PAR.OFFSET_X, y = pos[i].y + PAR.OFFSET_Y; // top-left offset right & down of the trail point

        // border frame — 4 solid #111 edges (keeps the cutout transparent inside)
        gl.uniform1i(uMode, 1);
        gl.uniform4fv(uColor, INK);
        gl.uniform1f(uFlip, 0);
        rect(x - PAR.BORDER_PX, y - PAR.BORDER_PX, w + 2 * PAR.BORDER_PX, PAR.BORDER_PX); // top
        rect(x - PAR.BORDER_PX, y + h, w + 2 * PAR.BORDER_PX, PAR.BORDER_PX); // bottom
        rect(x - PAR.BORDER_PX, y, PAR.BORDER_PX, h); // left
        rect(x + w, y, PAR.BORDER_PX, h); // right

        // the video copy (mirrored, alpha preserved)
        if (ready) {
          gl.uniform1i(uMode, 0);
          gl.uniform1f(uFlip, 1);
          rect(x, y, w, h);
        }
      }

      gl.disable(gl.BLEND); // the remaining passes write final values themselves

      // macroblock size is live, and the flow target is one texel per block — so a change
      // has to resize that texture or the shader reads a grid that no longer exists
      const bx = Math.max(1, Math.ceil(W / PAR.MOSH_BLOCK));
      const by = Math.max(1, Math.ceil(H / PAR.MOSH_BLOCK));
      if (bx !== BX || by !== BY) {
        BX = bx; BY = by;
        gl.activeTexture(gl.TEXTURE0 + flowT.unit);
        gl.bindTexture(gl.TEXTURE_2D, flowT.tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, BX, BY, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      }

      // ---- pass 2: motion estimation, at block resolution ----
      gl.bindFramebuffer(gl.FRAMEBUFFER, flowT.fbo);
      gl.viewport(0, 0, BX, BY);
      gl.useProgram(flowP);
      bind(1, curS.tex!);
      bind(2, prevS.tex!);
      gl.uniform1i(fCur, 1);
      gl.uniform1i(fPrev, 2);
      gl.uniform2f(fRes, W, H);
      gl.uniform1f(fBlock, PAR.MOSH_BLOCK);
      gl.uniform1f(fStep, MOSH_STEP);
      gl.uniform1f(fRange, MOSH_SEARCH + 2); // refine can push slightly past the coarse radius
      gl.uniform1f(fStatic, PAR.MOSH_STATIC);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (wipe) {
        gl.clearColor(0, 0, 0, 0);
        for (const t of [moshA, moshB]) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
          gl.clear(gl.COLOR_BUFFER_BIT);
        }
        wipe = false;
      }

      // ---- pass 3: datamosh, advect the feedback along the flow ----
      gl.bindFramebuffer(gl.FRAMEBUFFER, writeM.fbo);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(moshP);
      bind(1, curS.tex!);
      bind(3, readM.tex!);
      bind(5, flowT.tex!);
      gl.uniform1i(mSource, 1);
      gl.uniform1i(mFeedback, 3);
      gl.uniform1i(mFlow, 5);
      gl.uniform2f(mRes, W, H);
      gl.uniform2f(mBlocks, BX, BY);
      gl.uniform1f(mBlock, PAR.MOSH_BLOCK);
      gl.uniform1f(mGain, PAR.MOSH_GAIN);
      gl.uniform1f(mTaps, 1 + (PAR.MOSH_TAPS - 1) * holdAmt); // ramp the compounding with the press
      gl.uniform1f(mHold, holdAmt);
      gl.uniform1f(mRange, MOSH_SEARCH + 2);
      gl.uniform2f(mDevice, canvas.width, canvas.height);
      gl.uniform1f(mPersist, PAR.MOSH_PERSIST * holdAmt); // no stickiness when not moshing
      gl.uniform1f(mPaint, held ? 1 : 0); // the trail is committed only while held
      gl.uniform1f(mErase, held ? 0 : 1); // released → the ribbon wears the canvas away
      gl.uniform1f(mEraseRate, PAR.ERASE_RATE);
      gl.uniform1f(mEraseGrain, PAR.ERASE_GRAIN);
      gl.uniform1f(mEraseVar, PAR.ERASE_GRAIN_VAR);
      gl.uniform1f(mEraseSmear, PAR.ERASE_SMEAR);
      gl.uniform1f(mEraseDark, PAR.ERASE_DARK);
      gl.uniform1f(mSeed, (seed = (seed + 0.7139) % 997));
      gl.uniform1f(mInk, PAR.INK_REJECT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // ---- pass 4: present to the canvas, warped by any live ripples ----
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(post);
      // the buffer is already premultiplied, so write it straight through and let the
      // browser compositor use its alpha against the page
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      bind(4, writeM.tex!);
      bind(5, flowT.tex!); // the present pass reads the same field for chroma + tint
      bind(1, curS.tex!); // and the live trail, to ride on top of the painted canvas

      const n = Math.min(ripples.length, MAX_RIPPLES);
      for (let i = 0; i < n; i++) {
        centers[i * 2] = ripples[i].x;
        centers[i * 2 + 1] = ripples[i].y;
        ages[i] = now - ripples[i].t;
      }
      gl.uniform1i(pScene, 4);
      gl.uniform2f(pRes, W, H);
      gl.uniform1i(pCount, n);
      gl.uniform2fv(pCenter, centers); // slots past uCount are ignored by the shader
      gl.uniform1fv(pAge, ages);
      gl.uniform1f(pSpeed, PAR.RIPPLE_SPEED);
      gl.uniform1f(pWidth, PAR.RIPPLE_WIDTH);
      gl.uniform1f(pAmp, PAR.RIPPLE_AMP);
      gl.uniform1f(pDamp, PAR.RIPPLE_DAMP);
      gl.uniform1f(pBlock, PAR.MOSH_BLOCK);
      gl.uniform1f(pQuant, PAR.MOSH_QUANT * holdAmt); // treatments only while moshing
      gl.uniform1f(pBlockVis, PAR.MOSH_BLOCKVIS * holdAmt);
      gl.uniform1i(pFlow, 5);
      gl.uniform2f(pBlocks, BX, BY);
      gl.uniform2f(pDevice, canvas.width, canvas.height);
      gl.uniform1f(pRange, MOSH_SEARCH + 2);
      gl.uniform1f(pTaps, 1 + (PAR.MOSH_TAPS - 1) * holdAmt);
      gl.uniform1f(pGain, PAR.MOSH_GAIN);
      gl.uniform1f(pChroma, PAR.MOSH_CHROMA * holdAmt);
      gl.uniform1f(pChromaSub, PAR.MOSH_CHROMA_SUB);
      gl.uniform1f(pChromaLead, PAR.MOSH_CHROMA_LEAD);
      gl.uniform1f(pTint, PAR.MOSH_TINT * holdAmt);
      gl.uniform1f(pSharpen, PAR.MOSH_SHARPEN);
      gl.uniform1f(pRgbSplit, PAR.MOSH_RGB_SPLIT * holdAmt);
      gl.uniform1i(pLive, 1);
      gl.uniform1f(pLiveAmt, 1 - holdAmt); // hand the frame over to the mosh as the press lands
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      const s = curS; curS = prevS; prevS = s;
      const m = readM; readM = writeM; writeM = m;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mousedown", md);
      window.removeEventListener("mouseup", mu);
      window.removeEventListener("dblclick", dc);
      window.removeEventListener("touchstart", tm);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("touchstart", td);
      window.removeEventListener("touchend", tu);
      canvas.removeEventListener("webglcontextlost", onLost);
      video.removeEventListener("loadedmetadata", onLoaded);
      video.pause();
      video.removeAttribute("src"); // stop the load without an "Invalid URI" error
      video.load();
      for (const t of [sceneA, sceneB, moshA, moshB, flowT]) {
        gl.deleteFramebuffer(t.fbo);
        gl.deleteTexture(t.tex);
      }
      gl.deleteTexture(tex);
      gl.deleteBuffer(quad);
      for (const p of [prog, flowP, moshP, post]) gl.deleteProgram(p);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 10 }}
      />
      {SHOW_CONTROLS && process.env.NODE_ENV === "development" && (
        <SketchControls params={paramsRef.current} defaults={DEFAULTS} schema={SCHEMA} />
      )}
    </>
  );
}
