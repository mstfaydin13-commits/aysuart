import React from "react";
import DuotonePhoto from "./DuotonePhoto";
import StarMap from "./StarMap";
import SpotifyQR from "./SpotifyQR";

/**
 * 15x20 cm masaüstü pleksi (vertical 3:4).
 * - Photo at top (style switchable)
 * - Quote + date in middle
 * - Oval star map at bottom
 * - City + coords bottom-left, QR bottom-right
 */
export default function PosterPreview({
  photoUrl,
  photoStyle = "duotone",
  quote,
  date,
  city,
  spotifyUrl,
  watermark = false,
  protect = false,
  id,
}) {
  const formattedDate = formatPosterDate(date);
  const coords = city ? formatCoords(city.lat, city.lon) : "";

  const protectProps = protect
    ? {
        onContextMenu: (e) => e.preventDefault(),
        onDragStart: (e) => e.preventDefault(),
        style: { userSelect: "none", WebkitUserSelect: "none" },
      }
    : {};

  return (
    <div
      data-testid="poster-preview"
      id={id}
      className="relative mx-auto"
      style={{
        aspectRatio: "3 / 4",
        width: "100%",
        maxWidth: 420,
        background: "linear-gradient(180deg, #0A1128 0%, #050B1F 60%, #040814 100%)",
        border: "1px solid rgba(212,175,55,0.25)",
        boxShadow: "0 30px 80px -20px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.04)",
        overflow: "hidden",
        ...(protectProps.style || {}),
      }}
      onContextMenu={protectProps.onContextMenu}
      onDragStart={protectProps.onDragStart}
    >
      <div className="absolute inset-0 grain pointer-events-none" />

      <div className="relative" style={{ width: "100%", aspectRatio: "1 / 0.85" }}>
        <DuotonePhoto
          src={photoUrl}
          style={photoStyle}
          width={840}
          height={714}
          fadeBottom={0.45}
          vignette={0.5}
        />
      </div>

      <div className="relative px-6 -mt-12 text-center">
        <p
          data-testid="poster-quote"
          className="font-display italic text-cream-50 leading-snug"
          style={{
            fontSize: "clamp(13px, 2.4vw, 20px)",
            textShadow: "0 1px 6px rgba(0,0,0,0.6)",
          }}
        >
          “{quote || "Yıldızlar bizi ilk burada gördü."}”
        </p>
        <div className="my-3 flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-gold/60" />
          <span className="font-cinzel text-[10px] md:text-[11px] tracking-[0.4em] text-gold">
            {formattedDate || "GG · AY · YYYY"}
          </span>
          <span className="h-px w-8 bg-gold/60" />
        </div>
      </div>

      <div className="relative px-4 mt-2 flex justify-center">
        <div style={{ width: "78%", maxWidth: 300 }}>
          <StarMap
            date={date || "2024-01-01"}
            lat={city?.lat ?? 41.0082}
            lon={city?.lon ?? 28.9784}
            width={300}
            height={350}
          />
        </div>
      </div>

      <div className="absolute bottom-3 left-4 max-w-[55%]">
        <div
          data-testid="poster-city"
          className="font-cinzel text-[9px] md:text-[10px] tracking-[0.34em] text-cream-50/90 leading-tight"
        >
          {(city?.name || "İSTANBUL").toUpperCase()}
        </div>
        <div className="font-mont text-[7px] md:text-[8px] tracking-[0.22em] text-cream-200/55 mt-0.5">
          {coords}
        </div>
      </div>

      <div className="absolute bottom-3 right-3">
        <SpotifyQR url={spotifyUrl} size={50} />
      </div>

      {watermark ? <Watermark /> : null}
    </div>
  );
}

function Watermark() {
  const lines = Array.from({ length: 14 });
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
      data-testid="poster-watermark"
    >
      <div className="origin-center" style={{ transform: "rotate(-30deg)", width: "200%", height: "200%" }}>
        {lines.map((_, i) => (
          <div
            key={i}
            className="font-cinzel whitespace-nowrap"
            style={{
              fontSize: 18,
              letterSpacing: "0.55em",
              color: "rgba(212,175,55,0.16)",
              padding: "16px 0",
              textAlign: "center",
            }}
          >
            ÖRNEK · AYSU ART · ÖRNEK · AYSU ART · ÖRNEK · AYSU ART
          </div>
        ))}
      </div>
      <div
        className="absolute top-3 right-3 font-cinzel text-[9px] tracking-[0.45em]"
        style={{ color: "rgba(212,175,55,0.55)" }}
      >
        PROOF
      </div>
    </div>
  );
}

function formatPosterDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "";
  const months = ["OCAK", "ŞUBAT", "MART", "NİSAN", "MAYIS", "HAZİRAN", "TEMMUZ", "AĞUSTOS", "EYLÜL", "EKİM", "KASIM", "ARALIK"];
  return `${pad2(dt.getDate())} · ${months[dt.getMonth()]} · ${dt.getFullYear()}`;
}
function pad2(n) { return n < 10 ? `0${n}` : `${n}`; }
function formatCoords(lat, lon) {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${ns}   ${Math.abs(lon).toFixed(4)}° ${ew}`;
}
