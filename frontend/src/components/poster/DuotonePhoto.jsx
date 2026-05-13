import React, { useEffect, useRef, useState } from "react";

/**
 * Photo treatment for poster.
 * Props:
 *   style: 'duotone' | 'sepia' | 'bw' | 'sketch' | 'original'
 */
export default function DuotonePhoto({
  src,
  style = "duotone",
  width = 600,
  height = 600,
  fadeBottom = 0.5,
  vignette = 0.55,
  dataTestId = "duotone-photo",
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!src) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    canvas.width = width;
    canvas.height = height;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // cover fit
      const ir = img.width / img.height;
      const cr = width / height;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (ir > cr) { sw = img.height * cr; sx = (img.width - sw) / 2; }
      else { sh = img.width / cr; sy = (img.height - sh) / 2; }
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);

      try {
        applyStyle(ctx, width, height, style);
      } catch (e) { /* tainted canvas - skip */ }

      // vignette
      const vg = ctx.createRadialGradient(
        width / 2, height * 0.45, Math.min(width, height) * 0.25,
        width / 2, height * 0.45, Math.max(width, height) * 0.75
      );
      vg.addColorStop(0, "rgba(4,8,20,0)");
      vg.addColorStop(1, `rgba(4,8,20,${vignette})`);
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, width, height);

      // bottom fade into navy
      const fg = ctx.createLinearGradient(0, height * (1 - fadeBottom), 0, height);
      fg.addColorStop(0, "rgba(4,8,20,0)");
      fg.addColorStop(1, "rgba(4,8,20,1)");
      ctx.fillStyle = fg;
      ctx.fillRect(0, height * (1 - fadeBottom), width, height * fadeBottom);
    };
    img.src = src;
  }, [src, style, width, height, fadeBottom, vignette]);

  if (!src) {
    return (
      <div
        data-testid={`${dataTestId}-placeholder`}
        className="w-full aspect-square flex items-center justify-center font-cinzel text-[10px] tracking-[0.3em] text-cream-200/50 border border-dashed border-cream-50/15"
        style={{ height }}
      >
        FOTOĞRAF YÜKLEYİN
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      data-testid={dataTestId}
      style={{ width: "100%", height: "auto", display: "block" }}
    />
  );
}

function applyStyle(ctx, w, h, style) {
  if (style === "original") return; // no filter
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  if (style === "duotone") {
    const shadow = { r: 4, g: 8, b: 20 };
    const hi = { r: 183, g: 196, b: 222 }; // #B7C4DE
    for (let i = 0; i < data.length; i += 4) {
      const l = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
      data[i]     = Math.round(shadow.r + (hi.r - shadow.r) * l);
      data[i + 1] = Math.round(shadow.g + (hi.g - shadow.g) * l);
      data[i + 2] = Math.round(shadow.b + (hi.b - shadow.b) * l);
    }
  } else if (style === "sepia") {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      data[i]     = Math.min(255, 0.393 * r + 0.769 * g + 0.189 * b);
      data[i + 1] = Math.min(255, 0.349 * r + 0.686 * g + 0.168 * b);
      data[i + 2] = Math.min(255, 0.272 * r + 0.534 * g + 0.131 * b);
    }
  } else if (style === "bw") {
    for (let i = 0; i < data.length; i += 4) {
      const l = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      // slight S-curve contrast
      const v = clamp(((l / 255 - 0.5) * 1.25 + 0.5) * 255);
      data[i] = data[i + 1] = data[i + 2] = v;
    }
  } else if (style === "sketch") {
    // pencil sketch: invert + blur-ish + dodge
    // Simple edge-emphasis: convert to grayscale then mix with inverted-blurred copy
    // We'll do a fast approximation: high contrast B&W + paper warmth
    for (let i = 0; i < data.length; i += 4) {
      const l = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const lifted = clamp(255 - (255 - l) * 0.55);
      const v = clamp(((lifted / 255 - 0.45) * 1.6 + 0.65) * 255);
      data[i]     = v * 0.96;
      data[i + 1] = v * 0.93;
      data[i + 2] = v * 0.85;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function clamp(v) { return Math.max(0, Math.min(255, v)); }
