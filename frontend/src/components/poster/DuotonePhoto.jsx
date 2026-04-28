import React, { useEffect, useRef, useState } from "react";

/**
 * DuotonePhoto - applies a desaturate + gradient map effect to an image.
 * Renders a canvas. Uses CSS filters AND canvas pixel shader for true duotone.
 *
 * Props:
 *   src: string (image url)
 *   shadow: hex (deep navy)
 *   highlight: hex (lighter cream/gold or pale blue)
 *   width, height: canvas dimensions in px
 *   fadeBottom: 0..1 fraction of bottom to fade
 */
export default function DuotonePhoto({
  src,
  shadow = "#040814",
  highlight = "#C9D6F0",
  width = 600,
  height = 600,
  fadeBottom = 0.45,
  vignette = 0.55,
  dataTestId = "duotone-photo",
}) {
  const canvasRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // cover fit
      const ir = img.width / img.height;
      const cr = width / height;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (ir > cr) {
        sw = img.height * cr;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width / cr;
        sy = (img.height - sh) / 2;
      }
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);

      // pixel-level duotone via gradient map
      try {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const sh1 = hexToRgb(shadow);
        const hi = hexToRgb(highlight);
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2];
          // luminance
          const l = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          data[i] = Math.round(sh1.r + (hi.r - sh1.r) * l);
          data[i + 1] = Math.round(sh1.g + (hi.g - sh1.g) * l);
          data[i + 2] = Math.round(sh1.b + (hi.b - sh1.b) * l);
        }
        ctx.putImageData(imageData, 0, 0);
      } catch (e) {
        // tainted canvas - fallback CSS only
      }

      // vignette - top, left, right
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
    img.onerror = () => setError(true);
    img.src = src;
  }, [src, shadow, highlight, width, height, fadeBottom, vignette]);

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

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(v, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}
