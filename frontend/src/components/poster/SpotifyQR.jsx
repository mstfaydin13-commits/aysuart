import React from "react";
import { QRCodeSVG } from "qrcode.react";

/**
 * Spotify QR styled to dissolve into the star-map / midnight palette.
 * No frame; foreground is a soft star-blue that stays scannable on the deep navy.
 */
export default function SpotifyQR({ url = "", size = 70 }) {
  const target = url && url.trim() ? url : "https://open.spotify.com";
  return (
    <div
      data-testid="spotify-qr"
      style={{
        background: "#0A1128",
        padding: 4,
        borderRadius: 2,
        boxShadow: "0 0 22px 6px rgba(10,17,40,0.85)",
      }}
    >
      <QRCodeSVG
        value={target}
        size={size}
        bgColor="#0A1128"
        fgColor="#6E7FA6"
        level="M"
        marginSize={0}
      />
    </div>
  );
}
