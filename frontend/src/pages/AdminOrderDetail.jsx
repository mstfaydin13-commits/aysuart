import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import { api } from "../lib/api";
import PosterPreview from "../components/poster/PosterPreview";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  { value: "pending", label: "Bekliyor" },
  { value: "approved", label: "Onaylandı" },
  { value: "in_production", label: "Üretimde" },
  { value: "shipped", label: "Kargoda" },
  { value: "completed", label: "Tamamlandı" },
  { value: "cancelled", label: "İptal" },
];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const posterRef = useRef(null);

  useEffect(() => {
    api.get(`/admin/orders/${id}`)
      .then((r) => setOrder(r.data))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status) => {
    try {
      const res = await api.patch(`/admin/orders/${id}`, { status });
      setOrder(res.data);
      toast.success("Durum güncellendi");
    } catch {
      toast.error("Güncelleme başarısız");
    }
  };

  const downloadPNG = async () => {
    if (!posterRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(posterRef.current, {
        backgroundColor: "#040814",
        scale: 4, // ~1680x2800 px
        useCORS: true,
        allowTaint: false,
        logging: false,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `aysu-art-${order.id.slice(0, 8)}.png`;
      link.click();
      toast.success("PNG indirildi");
    } catch (e) {
      toast.error("İndirme başarısız: " + (e.message || ""));
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <div className="py-32 text-center"><Loader2 className="w-6 h-6 mx-auto animate-spin text-gold" /></div>;
  }
  if (!order) return <div className="py-32 text-center font-mont text-cream-200/60">Sipariş bulunamadı.</div>;

  const photoUrl = `${process.env.REACT_APP_BACKEND_URL}${order.photo_url}`;

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">
      <Link to="/admin" className="inline-flex items-center gap-2 text-cream-200/70 hover:text-gold font-mont text-xs tracking-widest mb-8" data-testid="admin-back-link">
        <ArrowLeft className="w-4 h-4" /> SİPARİŞLERE DÖN
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
        <div>
          <span className="font-cinzel text-[11px] tracking-[0.45em] text-gold">SİPARİŞ DETAYI</span>
          <h1 className="mt-2 font-display text-3xl md:text-4xl text-cream-50">#{order.id.slice(0, 8).toUpperCase()}</h1>
          <p className="mt-1 font-mont text-xs text-cream-200/50">Oluşturulma: {new Date(order.created_at).toLocaleString("tr-TR")}</p>
        </div>
        <button onClick={downloadPNG} disabled={downloading} className="btn-gold" data-testid="admin-download-btn">
          {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {downloading ? "Hazırlanıyor" : "PNG İndir (Yüksek Çözünürlük)"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div ref={posterRef}>
          {/* Admin sees clean poster (no watermark) for production-ready PNG */}
          <PosterPreview
            photoUrl={photoUrl}
            quote={order.quote_text}
            date={order.memory_date}
            city={{ name: order.city_name, lat: order.city_lat, lon: order.city_lon }}
            zodiac={order.zodiac}
            spotifyUrl={order.spotify_url}
          />
          <p className="mt-3 font-mont text-[10px] tracking-widest text-cream-200/40 text-center">PRODUCTION-READY · WATERMARK YOK</p>
        </div>

        <div className="space-y-6">
          <div className="bg-midnight-900/50 border border-cream-50/10 p-6">
            <h3 className="font-cinzel text-[11px] tracking-[0.4em] text-gold mb-4">DURUM</h3>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => updateStatus(s.value)}
                  data-testid={`admin-status-${s.value}`}
                  className={`px-3 py-2 font-mont text-xs tracking-widest border transition ${
                    order.status === s.value
                      ? "bg-gold text-midnight-950 border-gold"
                      : "bg-transparent text-cream-200/80 border-cream-50/15 hover:border-gold"
                  }`}
                >
                  {s.label.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-midnight-900/50 border border-cream-50/10 p-6 space-y-4 font-mont text-sm">
            <Detail label="MÜŞTERİ" value={order.customer_name} />
            <Detail label="E-POSTA" value={order.customer_email} />
            <Detail label="TELEFON" value={order.customer_phone} />
            <Detail label="ADRES" value={order.delivery_address} multiline />
            <Detail label="ŞEHİR" value={`${order.city_name} (${order.city_lat.toFixed(4)}°, ${order.city_lon.toFixed(4)}°)`} />
            <Detail label="TARİH" value={order.memory_date} />
            {order.zodiac ? <Detail label="BURÇ" value={order.zodiac} /> : null}
            <Detail label="ANI CÜMLESİ" value={order.quote_text} multiline />
            {order.spotify_url ? <Detail label="SPOTIFY" value={order.spotify_url} link /> : null}
            <Detail label="EKSTRALAR" value={[
              order.gift_package ? "Hediye Paketi" : null,
              order.message_card ? "Mesaj Kartı" : null,
            ].filter(Boolean).join(" · ") || "—"} />
            {order.notes ? <Detail label="NOT" value={order.notes} multiline /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function Detail({ label, value, multiline, link }) {
  return (
    <div className="border-b border-cream-50/5 pb-3 last:border-0 last:pb-0">
      <div className="font-cinzel text-[10px] tracking-[0.4em] text-gold mb-1">{label}</div>
      {link ? (
        <a href={value} target="_blank" rel="noreferrer" className="text-cream-50 hover:text-gold break-all">{value}</a>
      ) : (
        <div className={`text-cream-50 ${multiline ? "whitespace-pre-line" : ""}`}>{value || "—"}</div>
      )}
    </div>
  );
}
