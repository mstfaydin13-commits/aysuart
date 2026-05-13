import React from "react";

const NUMBER = "905550000000"; // change in production
const MSG = encodeURIComponent("Merhaba Aysu Art, kişiye özel tablo hakkında bilgi almak istiyorum.");

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${NUMBER}?text=${MSG}`}
      target="_blank"
      rel="noreferrer"
      data-testid="whatsapp-btn"
      aria-label="WhatsApp ile iletişim"
      className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
      style={{ background: "#25D366" }}
    >
      <svg viewBox="0 0 32 32" width="26" height="26" fill="white" aria-hidden="true">
        <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39-.039 0-.084-.024-.171-.067-.66-.275-1.553-.722-2.554-1.752-.78-.799-1.323-1.792-1.532-2.183a1.46 1.46 0 0 1-.124-.286c0-.348.892-.711 1.04-.853.117-.111.252-.359.252-.554 0-.117-.069-.232-.12-.348-.117-.232-.547-1.281-.747-1.745-.139-.346-.279-.46-.464-.46-.117 0-.232 0-.348.024-.139.024-.348.116-.523.317-.176.2-.696.66-.696 1.604 0 .956.66 1.876.795 2.05.116.149 1.43 2.247 3.554 3.069.974.382 2.16.464 2.85.348.46-.069 1.392-.547 1.605-1.069.232-.581.232-1.069.162-1.185-.07-.116-.232-.162-.464-.232z"/>
        <path fillRule="evenodd" d="M16.05 0C7.279 0 .104 7.155.104 15.926c0 2.798.738 5.521 2.135 7.92L0 32l8.395-2.187a15.81 15.81 0 0 0 7.655 1.973h.007c8.78 0 15.946-7.155 15.946-15.926S24.83 0 16.05 0zm0 29.084h-.005a13.13 13.13 0 0 1-6.705-1.834l-.481-.286-4.984 1.298 1.328-4.853-.314-.498a13.092 13.092 0 0 1-2.014-7.011c0-7.252 5.926-13.158 13.18-13.158 7.245 0 13.166 5.906 13.166 13.158 0 7.252-5.92 13.158-13.171 13.158z"/>
      </svg>
    </a>
  );
}
