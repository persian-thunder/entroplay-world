"use client";

import { useState } from "react";

export type ParamSpec = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  group: string;
  hint?: string;
};

export type Params = Record<string, number>;

/**
 * Live tuning panel for the home-page sketch.
 *
 * `params` is the SAME mutable object the render loop reads every frame, so a slider
 * takes effect on the next frame with no re-render of the canvas and no reload. React
 * state here only drives the panel's own labels.
 */
export default function SketchControls({
  params,
  defaults,
  schema,
  onChange,
}: {
  params: Params;
  defaults: Params;
  schema: ParamSpec[];
  onChange?: (key: string, value: number) => void;
}) {
  const [, bump] = useState(0);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const set = (key: string, value: number) => {
    params[key] = value;
    onChange?.(key, value);
    bump((n) => n + 1);
  };

  const reset = () => {
    for (const s of schema) {
      params[s.key] = defaults[s.key];
      onChange?.(s.key, defaults[s.key]);
    }
    bump((n) => n + 1);
  };

  // dump only what has drifted from the committed values, as pasteable declarations
  const copy = () => {
    const changed = schema.filter((s) => params[s.key] !== defaults[s.key]);
    const body = (changed.length ? changed : schema)
      .map((s) => `const ${s.key} = ${round(params[s.key])};`)
      .join("\n");
    navigator.clipboard?.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const groups = schema.reduce<Record<string, ParamSpec[]>>((acc, s) => {
    (acc[s.group] ||= []).push(s);
    return acc;
  }, {});

  const dirty = schema.filter((s) => params[s.key] !== defaults[s.key]).length;

  return (
    <div style={S.root}>
      <button onClick={() => setOpen((o) => !o)} style={S.toggle}>
        {open ? "close" : "tune"}
        {dirty > 0 && <span style={S.badge}>{dirty}</span>}
      </button>

      {open && (
        <div style={S.panel}>
          {Object.entries(groups).map(([group, specs]) => (
            <div key={group} style={S.group}>
              <div style={S.groupName}>{group}</div>
              {specs.map((s) => {
                const v = params[s.key];
                const moved = v !== defaults[s.key];
                return (
                  <label key={s.key} style={S.row} title={s.hint}>
                    <span style={{ ...S.name, color: moved ? "#111" : "#555" }}>{s.label}</span>
                    <input
                      type="range"
                      min={s.min}
                      max={s.max}
                      step={s.step}
                      value={v}
                      onChange={(e) => set(s.key, parseFloat(e.target.value))}
                      style={S.slider}
                    />
                    <span style={{ ...S.value, fontWeight: moved ? 700 : 400 }}>{round(v)}</span>
                  </label>
                );
              })}
            </div>
          ))}

          <div style={S.actions}>
            <button onClick={copy} style={S.action}>
              {copied ? "copied" : "copy consts"}
            </button>
            <button onClick={reset} style={{ ...S.action, opacity: dirty ? 1 : 0.4 }}>
              reset
            </button>
          </div>
          <p style={S.note}>
            MOSH_SEARCH and MOSH_STEP are compiled into the flow shader as a #define, so they
            are not adjustable here — edit and reload for those.
          </p>
        </div>
      )}
    </div>
  );
}

const round = (n: number) => (Number.isInteger(n) ? n : parseFloat(n.toFixed(3)));

const S: Record<string, React.CSSProperties> = {
  root: {
    position: "fixed",
    top: 16,
    right: 16,
    zIndex: 100,
    fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
    pointerEvents: "auto",
  },
  toggle: {
    background: "#111",
    color: "#E6E8E6",
    border: "none",
    padding: "6px 12px",
    fontSize: 11,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "inherit",
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
  },
  badge: {
    background: "#E6E8E6",
    color: "#111",
    borderRadius: 8,
    padding: "0 5px",
    fontSize: 10,
    lineHeight: "14px",
  },
  panel: {
    background: "rgba(230,232,230,0.97)",
    border: "1px solid #111",
    padding: 14,
    width: 310,
    maxHeight: "82vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    backdropFilter: "blur(6px)",
  },
  group: { display: "flex", flexDirection: "column", gap: 5 },
  groupName: {
    fontSize: 9.5,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "#111",
    borderBottom: "1px solid #111",
    paddingBottom: 3,
    marginBottom: 3,
  },
  row: { display: "grid", gridTemplateColumns: "104px 1fr 46px", alignItems: "center", gap: 7 },
  name: { fontSize: 10, letterSpacing: "0.02em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  slider: { width: "100%", accentColor: "#111", height: 14 },
  value: { fontSize: 10.5, textAlign: "right", fontVariantNumeric: "tabular-nums", color: "#111" },
  actions: { display: "flex", gap: 7 },
  action: {
    flex: 1,
    background: "none",
    border: "1px solid #111",
    color: "#111",
    padding: "6px 0",
    fontSize: 10,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  note: { fontSize: 9.5, lineHeight: 1.5, color: "#555", margin: 0 },
};
