import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";

/**
 * Circular star map. Fetches stars from backend (procedural) by date+lat+lon.
 */
export default function StarMap({ date, lat, lon, size = 360, dataTestId = "star-map" }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!date || lat == null || lon == null) return;
    api
      .post("/starmap", { date, lat, lon })
      .then((r) => {
        if (!cancelled) setData(r.data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [date, lat, lon]);

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 1;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      data-testid={dataTestId}
      className="block"
    >
      <defs>
        <radialGradient id="diskBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0E1838" />
          <stop offset="60%" stopColor="#0A1128" />
          <stop offset="100%" stopColor="#040814" />
        </radialGradient>
        <radialGradient id="haze" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(212,175,55,0.06)" />
          <stop offset="60%" stopColor="rgba(212,175,55,0.02)" />
          <stop offset="100%" stopColor="rgba(212,175,55,0)" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="0.7" />
        </filter>
      </defs>
      {/* outer thin gold ring */}
      <circle cx={cx} cy={cy} r={r} fill="url(#diskBg)" stroke="#D4AF37" strokeOpacity="0.55" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r - 6} fill="url(#haze)" stroke="rgba(212,175,55,0.18)" strokeWidth="0.5" />

      {/* clip the stars to the inner disk */}
      <clipPath id="diskClip">
        <circle cx={cx} cy={cy} r={r - 7} />
      </clipPath>

      <g clipPath="url(#diskClip)">
        {/* faint milky way streak */}
        <ellipse
          cx={cx}
          cy={cy}
          rx={r * 0.95}
          ry={r * 0.18}
          transform={`rotate(${(data?.sidereal_angle ?? 30) % 180} ${cx} ${cy})`}
          fill="rgba(200,185,166,0.05)"
        />
        {/* constellation lines */}
        {data?.constellations?.map((pair, i) => {
          const a = data.stars[pair[0]];
          const b = data.stars[pair[1]];
          if (!a || !b) return null;
          return (
            <line
              key={`c-${i}`}
              x1={a.x * size}
              y1={a.y * size}
              x2={b.x * size}
              y2={b.y * size}
              stroke="#D4AF37"
              strokeOpacity="0.35"
              strokeWidth="0.6"
            />
          );
        })}
        {/* stars */}
        {data?.stars?.map((s, i) => {
          const px = s.x * size;
          const py = s.y * size;
          const rad = 0.3 + s.mag * 1.6;
          const op = 0.4 + s.mag * 0.6;
          const isBright = s.mag > 0.75;
          return (
            <circle
              key={i}
              cx={px}
              cy={py}
              r={rad}
              fill={isBright ? "#FDFBF7" : "#E8E1D2"}
              opacity={op}
              filter={isBright ? "url(#glow)" : undefined}
            />
          );
        })}
      </g>

      {/* inner ring degree marks */}
      {Array.from({ length: 36 }).map((_, i) => {
        const ang = (i * 10 * Math.PI) / 180;
        const r1 = r - 2;
        const r2 = r - (i % 9 === 0 ? 8 : 4);
        const x1 = cx + Math.cos(ang) * r1;
        const y1 = cy + Math.sin(ang) * r1;
        const x2 = cx + Math.cos(ang) * r2;
        const y2 = cy + Math.sin(ang) * r2;
        return <line key={`t-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D4AF37" strokeOpacity="0.35" strokeWidth="0.5" />;
      })}
    </svg>
  );
}
