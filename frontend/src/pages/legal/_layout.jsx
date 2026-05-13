import React from "react";

export const COMPANY_INFO = {
  name: "[FİRMA TİCARİ UNVANI]",
  taxOffice: "[VERGİ DAİRESİ]",
  taxNumber: "[VERGİ NUMARASI]",
  address: "[FİRMA ADRESİ]",
  email: "info@aysuart.com",
  phone: "+90 555 000 00 00",
  website: "aysuart.com",
};

export function LegalLayout({ title, badge = "YASAL", children }) {
  return (
    <section className="max-w-3xl mx-auto px-6 md:px-10 py-16 md:py-20">
      <div className="mb-10">
        <span className="font-cinzel text-[11px] tracking-[0.45em] text-gold">{badge}</span>
        <h1 className="mt-3 font-display text-3xl md:text-5xl text-cream-50">{title}</h1>
        <div className="gold-divider mt-8" />
      </div>
      <article className="font-mont text-sm md:text-base text-cream-200/85 leading-relaxed space-y-6 [&_h2]:font-display [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:text-cream-50 [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:font-cinzel [&_h3]:text-[11px] [&_h3]:tracking-[0.35em] [&_h3]:text-gold [&_h3]:mt-8 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-cream-200/85">
        {children}
      </article>
      <div className="mt-16 border-t border-cream-50/10 pt-6 font-mont text-[11px] text-cream-200/45">
        Son güncelleme: 28 Nisan 2026 · Aysu Art / {COMPANY_INFO.name} · {COMPANY_INFO.email}
      </div>
    </section>
  );
}
