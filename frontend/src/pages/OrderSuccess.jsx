import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import { api } from "../lib/api";
import PosterPreview from "../components/poster/PosterPreview";

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then((r) => setOrder(r.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="py-32 text-center" data-testid="order-loading">
        <Loader2 className="w-6 h-6 mx-auto animate-spin text-gold" />
      </div>
    );
  }
  if (!order) {
    return (
      <div className="py-32 text-center font-mont text-cream-200/80">Sipariş bulunamadı.</div>
    );
  }

  const photoUrl = `${process.env.REACT_APP_BACKEND_URL}${order.photo_url}`;

  return (
    <section className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-24">
      <div className="text-center" data-testid="order-success-banner">
        <CheckCircle2 className="w-10 h-10 mx-auto text-gold" strokeWidth={1.3} />
        <span className="mt-5 block font-cinzel text-[11px] tracking-[0.45em] text-gold">SİPARİŞİNİZ ALINDI</span>
        <h1 className="mt-3 font-display text-3xl md:text-5xl text-cream-50">Yıldızlarınız hazırlanıyor</h1>
        <p className="mt-4 font-mont text-cream-200/75 max-w-xl mx-auto">
          Sipariş numaranız: <span className="text-gold">#{order.id.slice(0, 8).toUpperCase()}</span>. Tasarım ekibimiz
          en kısa sürede sizinle iletişime geçecek.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div>
          <PosterPreview
            photoUrl={photoUrl}
            quote={order.quote_text}
            date={order.memory_date}
            city={{ name: order.city_name, lat: order.city_lat, lon: order.city_lon }}
            zodiac={order.zodiac}
            spotifyUrl={order.spotify_url}
          />
        </div>
        <div className="space-y-5 font-mont text-sm text-cream-200/85">
          <Detail label="MÜŞTERİ" value={order.customer_name} />
          <Detail label="E-POSTA" value={order.customer_email} />
          <Detail label="TELEFON" value={order.customer_phone} />
          <Detail label="ŞEHİR" value={order.city_name} />
          <Detail label="TARİH" value={order.memory_date} />
          {order.zodiac ? <Detail label="BURÇ" value={order.zodiac} /> : null}
          <Detail label="ADRES" value={order.delivery_address} multiline />
          {order.notes ? <Detail label="NOT" value={order.notes} multiline /> : null}
          <div className="pt-6">
            <Link to="/" className="btn-ghost" data-testid="back-home-btn">Anasayfaya Dön</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Detail({ label, value, multiline }) {
  return (
    <div className="border-b border-cream-50/10 pb-3">
      <div className="font-cinzel text-[10px] tracking-[0.4em] text-gold mb-1">{label}</div>
      <div className={multiline ? "whitespace-pre-line" : ""}>{value || "—"}</div>
    </div>
  );
}
