import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";

/**
 * Oval star map matching reference style.
 * Bright connected constellation lines + softly twinkling stars.
 */
export default function StarMap({ date, lat, lon, width = 320, height = 380, dataTestId = "star-map" }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!date || lat == null || lon == null) return;
    api.post("/starmap", { date, lat, lon })
      .then((r) => { if (!cancelled) setData(r.data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [date, lat, lon]);

  const cx = width / 2;
  const cy = height / 2;
  const rx = width / 2 - 1;
  const ry = height / 2 - 1;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} data-testid={dataTestId} className="block">
      <defs>
        <radialGradient id="ovalBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0E1838" />
          <stop offset="65%" stopColor="#0A1128" />
          <stop offset="100%" stopColor="#040814" />
        </radialGradient>
        <filter id="glow2">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </defs>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#ovalBg)" stroke="#D4AF37" strokeOpacity="0.55" strokeWidth="1" />
      <ellipse cx={cx} cy={cy} rx={rx - 6} ry={ry - 6} fill="none" stroke="rgba(212,175,55,0.18)" strokeWidth="0.5" />

      <clipPath id="ovalClip">
        <ellipse cx={cx} cy={cy} rx={rx - 7} ry={ry - 7} />
      </clipPath>

      <g clipPath="url(#ovalClip)">
        {/* faint milky way */}
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx * 0.95}
          ry={ry * 0.18}
          transform={`rotate(${(data?.sidereal_angle ?? 30) % 180} ${cx} ${cy})`}
          fill="rgba(200,185,166,0.05)"
        />
        {/* constellation lines - brighter to match reference */}
        {data?.constellations?.map((pair, i) => {
          const a = data.stars[pair[0]];
          const b = data.stars[pair[1]];
          if (!a || !b) return null;
          return (
            <line
              key={`c-${i}`}
              x1={a.x * width}
              y1={a.y * height}
              x2={b.x * width}
              y2={b.y * height}
              stroke="#D4AF37"
              strokeOpacity="0.65"
              strokeWidth="0.7"
            />
          );
        })}
        {data?.stars?.map((s, i) => {
          const px = s.x * width;
          const py = s.y * height;
          const rad = 0.3 + s.mag * 1.7;
          const op = 0.45 + s.mag * 0.55;
          const isBright = s.mag > 0.7;
          return (
            <circle
              key={i}
              cx={px}
              cy={py}
              r={rad}
              fill={isBright ? "#FDFBF7" : "#E8E1D2"}
              opacity={op}
              filter={isBright ? "url(#glow2)" : undefined}
            />
          );
        })}
      </g>
    </svg>
  );
}
