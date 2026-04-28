import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Loader2, ChevronRight } from "lucide-react";
import { api, fileUrl } from "../lib/api";
import PosterPreview from "../components/poster/PosterPreview";
import CitySelect from "../components/CitySelect";
import { zodiacFromDate } from "../data/zodiac";
import { toast } from "sonner";

const DEFAULT_CITY = { name: "İstanbul", lat: 41.0082, lon: 28.9784, country: "Türkiye" };

export default function Customize() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [photoFileId, setPhotoFileId] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const [date, setDate] = useState("2024-08-14");
  const [city, setCity] = useState(DEFAULT_CITY);
  const [quote, setQuote] = useState("Yıldızlar bizi ilk burada gördü.");
  const [spotifyUrl, setSpotifyUrl] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const zodiac = useMemo(() => zodiacFromDate(date), [date]);

  const handleFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Lütfen bir resim dosyası seçin");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error("Dosya en fazla 10MB olmalı");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setPhotoFileId(res.data.file_id);
      setPhotoUrl(fileUrl(res.data.file_id));
      toast.success("Fotoğraf yüklendi");
    } catch (err) {
      toast.error("Yükleme başarısız oldu");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!photoFileId) return toast.error("Lütfen önce fotoğraf yükleyin");
    if (!quote.trim()) return toast.error("Lütfen anı cümlenizi yazın");
    if (!customerName || !customerEmail || !customerPhone || !deliveryAddress) {
      return toast.error("Lütfen iletişim bilgilerini doldurun");
    }
    setSubmitting(true);
    try {
      const payload = {
        photo_file_id: photoFileId,
        memory_date: date,
        city_name: city.name,
        city_lat: city.lat,
        city_lon: city.lon,
        quote_text: quote.trim(),
        spotify_url: spotifyUrl.trim(),
        zodiac,
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        customer_phone: customerPhone.trim(),
        delivery_address: deliveryAddress.trim(),
        notes: notes.trim(),
      };
      const res = await api.post("/orders", payload);
      toast.success("Sipariş oluşturuldu");
      navigate(`/order/${res.data.id}`);
    } catch (err) {
      const msg = err?.response?.data?.detail || "Sipariş oluşturulamadı";
      toast.error(typeof msg === "string" ? msg : "Sipariş oluşturulamadı");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-20">
      <div className="mb-10 md:mb-14">
        <span className="font-cinzel text-[11px] tracking-[0.45em] text-gold">TASARIM ATÖLYESİ</span>
        <h1 className="mt-4 font-display text-3xl md:text-5xl text-cream-50">
          Beş adımda sonsuz bir <em className="italic text-gold">an</em>.
        </h1>
        <p className="mt-3 font-mont text-cream-200/75 max-w-xl">
          Sağdaki canlı önizleme, seçimlerine göre anlık güncellenir. Tasarım onayından sonra üretim başlar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <form onSubmit={onSubmit} className="lg:col-span-7 space-y-10">
          {/* 1 · Fotoğraf */}
          <Field label="01 · FOTOĞRAF">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
              data-testid="photo-input"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              data-testid="photo-upload-btn"
              className="w-full border border-dashed border-gold/40 hover:border-gold bg-midnight-900/50 px-6 py-10 text-center transition group"
            >
              {uploading ? (
                <Loader2 className="w-6 h-6 mx-auto animate-spin text-gold" />
              ) : photoUrl ? (
                <div className="flex items-center justify-center gap-4">
                  <img src={photoUrl} alt="ön izleme" className="w-14 h-14 object-cover" />
                  <span className="font-mont text-sm text-cream-200/80">Fotoğraf yüklendi · Değiştirmek için tıklayın</span>
                </div>
              ) : (
                <>
                  <Upload className="w-7 h-7 mx-auto text-gold" strokeWidth={1.4} />
                  <div className="mt-3 font-cinzel text-[11px] tracking-[0.35em] text-gold">FOTOĞRAFINIZI SEÇİN</div>
                  <div className="mt-2 font-mont text-xs text-cream-200/60">JPG, PNG · Maks. 10MB · Önerilen 2000×2000+</div>
                </>
              )}
            </button>
          </Field>

          {/* 2 · Anı & Tarih */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Field label="02 · ANI & TARİH · CÜMLE">
                <textarea
                  rows={3}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  data-testid="quote-input"
                  maxLength={140}
                  placeholder="Tablonun ortasında yer alacak cümle (maks. 140 karakter)"
                  className="w-full bg-midnight-900 border border-cream-50/10 px-4 py-3 font-display italic text-base text-cream-50 focus:outline-none focus:border-gold/60 rounded-sm resize-none"
                />
                <div className="mt-1 font-mont text-[10px] tracking-widest text-cream-200/40 text-right">{quote.length}/140</div>
              </Field>
            </div>
            <div>
              <Field label="ÖZEL TARİH">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  data-testid="date-input"
                  className="w-full bg-midnight-900 border border-cream-50/10 px-4 py-3 font-mont text-sm text-cream-50 focus:outline-none focus:border-gold/60 rounded-sm"
                />
                {zodiac && (
                  <div className="mt-2 font-mont text-[11px] tracking-widest text-cream-200/60">
                    BURÇ: <span className="text-gold">{zodiac.toUpperCase()}</span>
                  </div>
                )}
              </Field>
            </div>
          </div>

          {/* 3 · Konum & Burç */}
          <Field label="03 · KONUM & BURÇ">
            <CitySelect value={city} onChange={setCity} />
            <div className="mt-2 font-mont text-[11px] tracking-widest text-cream-200/60">
              {city.lat.toFixed(4)}° {city.lat >= 0 ? "N" : "S"} · {city.lon.toFixed(4)}° {city.lon >= 0 ? "E" : "W"}
              {zodiac ? <span className="ml-3">· BURÇ <span className="text-gold">{zodiac.toUpperCase()}</span></span> : null}
            </div>
          </Field>

          {/* 4 · Şarkı */}
          <Field label="04 · ŞARKI · SPOTIFY BAĞLANTISI (Opsiyonel)">
            <input
              type="url"
              value={spotifyUrl}
              onChange={(e) => setSpotifyUrl(e.target.value)}
              data-testid="spotify-input"
              placeholder="https://open.spotify.com/track/..."
              className="w-full bg-midnight-900 border border-cream-50/10 px-4 py-3 font-mont text-sm text-cream-50 focus:outline-none focus:border-gold/60 rounded-sm"
            />
            <p className="mt-1 font-mont text-[11px] text-cream-200/50">Tablonun sağ alt köşesine QR kod olarak işlenir.</p>
          </Field>

          {/* 5 · Sipariş */}
          <div className="border-t border-cream-50/10 pt-8">
            <span className="font-cinzel text-[11px] tracking-[0.45em] text-gold">05 · SİPARİŞ · TESLİMAT BİLGİLERİ</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="AD SOYAD">
              <Input value={customerName} onChange={setCustomerName} testId="name-input" />
            </Field>
            <Field label="E-POSTA">
              <Input value={customerEmail} onChange={setCustomerEmail} type="email" testId="email-input" />
            </Field>
            <Field label="TELEFON">
              <Input value={customerPhone} onChange={setCustomerPhone} testId="phone-input" placeholder="+90 ..." />
            </Field>
            <Field label="ADRES" full>
              <textarea
                rows={3}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                data-testid="address-input"
                className="w-full bg-midnight-900 border border-cream-50/10 px-4 py-3 font-mont text-sm text-cream-50 focus:outline-none focus:border-gold/60 rounded-sm resize-none"
              />
            </Field>
            <Field label="NOTLAR (Opsiyonel)" full>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                data-testid="notes-input"
                className="w-full bg-midnight-900 border border-cream-50/10 px-4 py-3 font-mont text-sm text-cream-50 focus:outline-none focus:border-gold/60 rounded-sm resize-none"
              />
            </Field>
          </div>

          <div className="pt-2">
            <button type="submit" disabled={submitting} className="btn-gold" data-testid="submit-order-btn">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {submitting ? "Gönderiliyor" : "Siparişi Tamamla"}
              <ChevronRight className="w-4 h-4" />
            </button>
            <p className="mt-3 font-mont text-[11px] text-cream-200/50">
              Tasarımınız ekibimiz tarafından kontrol edilip onayınız alındıktan sonra üretim başlar.
            </p>
          </div>
        </form>

        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <div className="font-cinzel text-[11px] tracking-[0.45em] text-gold mb-4 text-center lg:text-left">
              CANLI ÖNİZLEME · 30×50 CM · PLEKSİ
            </div>
            <PosterPreview
              photoUrl={photoUrl}
              quote={quote}
              date={date}
              city={city}
              zodiac={zodiac}
              spotifyUrl={spotifyUrl}
            />
            <p className="mt-4 font-mont text-[11px] text-cream-200/50 text-center lg:text-left">
              * Önizleme yaklaşıktır. Üretimde renkler ve detaylar el ile rötuşlanır.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Field({ label, children, full }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block font-cinzel text-[11px] tracking-[0.4em] text-gold mb-3">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, type = "text", placeholder, testId }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      data-testid={testId}
      className="w-full bg-midnight-900 border border-cream-50/10 px-4 py-3 font-mont text-sm text-cream-50 focus:outline-none focus:border-gold/60 rounded-sm"
    />
  );
}
