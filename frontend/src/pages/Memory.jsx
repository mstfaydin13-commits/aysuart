import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import PosterPreview from "../components/poster/PosterPreview";
import { Loader2, ChevronRight, Music2 } from "lucide-react";

/**
 * Public memory share page. No personal data shown.
 * Heavy watermark + protections to prevent commercial use.
 */
export default function Memory() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/memory/${id}`)
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="py-32 text-center"><Loader2 className="w-6 h-6 mx-auto animate-spin text-gold" /></div>;
  if (!data) return <div className="py-32 text-center font-mont text-cream-200/60">Bu anı bulunamadı.</div>;

  const photoUrl = `${process.env.REACT_APP_BACKEND_URL}${data.photo_url}`;

  return (
    <section className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-24">
      <div className="text-center mb-14">
        <span className="font-cinzel text-[11px] tracking-[0.45em] text-gold">PAYLAŞILMIŞ ANI</span>
        <h1 className="mt-3 font-display text-3xl md:text-5xl text-cream-50 leading-tight">
          Birinin gökyüzünde <em className="italic text-gold">o an</em>.
        </h1>
        <p className="mt-3 font-mont text-cream-200/65 max-w-md mx-auto text-sm">
          Bu, Aysu Art ile üretilmiş gerçek bir hatıra tablosudur. Önizleme amaçlıdır.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="relative">
          <div className="absolute -inset-6 bg-gold/10 blur-3xl -z-10" />
          <PosterPreview
            photoUrl={photoUrl}
            quote={data.quote_text}
            date={data.memory_date}
            city={{ name: data.city_name, lat: data.city_lat, lon: data.city_lon }}
            zodiac={data.zodiac}
            spotifyUrl={data.spotify_url}
            watermark
            protect
          />
        </div>
        <div>
          <p className="font-display italic text-2xl md:text-3xl text-cream-50 leading-snug">
            "{data.quote_text}"
          </p>
          <div className="my-8 gold-divider" />
          <div className="font-cinzel text-[11px] tracking-[0.4em] text-gold">{data.city_name.toUpperCase()}</div>
          <div className="mt-2 font-mont text-[12px] tracking-widest text-cream-200/65">
            {Math.abs(data.city_lat).toFixed(4)}° {data.city_lat >= 0 ? "N" : "S"} · {Math.abs(data.city_lon).toFixed(4)}° {data.city_lon >= 0 ? "E" : "W"}
          </div>
          {data.zodiac ? <div className="mt-1 font-mont text-[12px] tracking-widest text-cream-200/65">{data.zodiac.toUpperCase()} · BURÇ</div> : null}

          {data.spotify_url ? (
            <a href={data.spotify_url} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 font-mont text-sm text-gold hover:underline">
              <Music2 className="w-4 h-4" /> Şarkıyı Spotify'da Dinle
            </a>
          ) : null}

          <div className="mt-12">
            <p className="font-mont text-sm text-cream-200/70 mb-5 leading-relaxed">
              Kendi anınızı sonsuza emanet etmek ister misiniz? Aysu Art ile siz de
              30×50 cm pleksi üzerinde, gerçek yıldız haritanızla, sevdiğinize özel bir
              hediye yaratın.
            </p>
            <Link to="/customize" className="btn-gold" data-testid="memory-cta">
              Kendi Tablonu Tasarla <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
