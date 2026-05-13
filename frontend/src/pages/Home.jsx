import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Sparkles, Music2, MapPin, Image as ImageIcon } from "lucide-react";
import PosterPreview from "../components/poster/PosterPreview";

const SAMPLE_PHOTO = "https://images.unsplash.com/photo-1743642638516-6e26674b8372?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NDh8MHwxfHNlYXJjaHwyfHxyb21hbnRpYyUyMGNvdXBsZSUyMGJsYWNrJTIwYW5kJTIwd2hpdGV8ZW58MHx8fHwxNzc3NDEyMzMyfDA&ixlib=rb-4.1.0&q=85";

export default function Home() {
  return (
    <>
      <Hero />
      <ValueRow />
      <Showcase />
      <ProcessSection />
      <FinalCTA />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 star-twinkle" />
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-20 md:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <span className="font-cinzel text-[11px] tracking-[0.45em] text-gold">AYSU · ART · ATÖLYESİ</span>
          <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-cream-50">
            O gece gökyüzü sizin için <em className="italic text-gold">böyleydi</em>.
          </h1>
          <p className="mt-7 font-mont text-base md:text-lg text-cream-200/85 max-w-xl leading-relaxed">
            Sevdiğiniz an, sevdiğiniz fotoğraf, sevdiğiniz şarkı… 15×20 cm masaüstü premium pleksi üzerinde
            gerçek yıldız haritası, duotone portre ve Spotify QR koduyla buluşuyor. Eşsiz bir
            hediye, ölümsüz bir hatıra.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/customize" className="btn-gold" data-testid="hero-cta-primary">
              Tablonu Tasarla <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
            <Link to="/gallery" className="btn-ghost" data-testid="hero-cta-secondary">
              Örnekleri Gör
            </Link>
          </div>
          <div className="mt-12 flex items-center gap-8 font-mont text-[11px] tracking-[0.25em] text-cream-200/60">
            <div>15×20 CM · MASAÜSTÜ</div>
            <div className="hidden sm:block">·</div>
            <div>EL İŞÇİLİĞİ</div>
            <div className="hidden sm:block">·</div>
            <div>3-5 İŞ GÜNÜ</div>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="relative">
            <div className="absolute -inset-6 bg-gold/10 blur-3xl -z-10" />
            <PosterPreview
              photoUrl={SAMPLE_PHOTO}
              quote="Yıldızlar bizi ilk burada gördü."
              date="2023-08-14"
              city={{ name: "İstanbul", lat: 41.0082, lon: 28.9784 }}
              zodiac="Aslan"
              spotifyUrl="https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ValueRow() {
  const items = [
    { icon: ImageIcon, title: "Duotone Portre", text: "Fotoğrafınız gece mavisi tonlarında, pleksi ile bütünleşen sanatsal bir görsele dönüşür." },
    { icon: Sparkles, title: "Gerçek Yıldız Haritası", text: "Tarih ve şehir koordinatlarınıza göre o gecenin gökyüzü hesaplanır." },
    { icon: Music2, title: "Spotify QR Kod", text: "O anınızı anlatan şarkıyı tablonun köşesinden tek dokunuşla dinleyin." },
    { icon: MapPin, title: "Şehir & Koordinat", text: "Anınızın geçtiği yerin enlem-boylamı ve burcu, ince Montserrat dokunuşuyla yer alır." },
  ];
  return (
    <section className="border-y border-cream-50/10 bg-midnight-900/40">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {items.map(({ icon: Icon, title, text }, i) => (
          <div key={i} className="">
            <Icon className="w-6 h-6 text-gold" strokeWidth={1.3} />
            <h3 className="mt-5 font-display text-xl text-cream-50">{title}</h3>
            <p className="mt-2 font-mont text-sm text-cream-200/75 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Showcase() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
      <div className="max-w-2xl">
        <span className="font-cinzel text-[11px] tracking-[0.45em] text-gold">FELSEFE</span>
        <h2 className="mt-5 font-display text-3xl md:text-5xl text-cream-50 leading-tight">
          Bir portreden çok, bir <em className="text-gold italic">sanat eseri</em>.
        </h2>
        <p className="mt-6 font-mont text-cream-200/80 leading-relaxed">
          Tablonuza ilk bakışta dikkat çeken bir hatıra fotoğrafı değil; gece mavisi ile kucaklanmış,
          yıldız haritasıyla bütünleşmiş, müzikle nefes alan bir kompozisyondur.
        </p>
      </div>
      <div className="gold-divider mt-12" />
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {[1, 2, 3].map((i) => (
          <figure key={i} className="relative">
            <div className="aspect-[3/5] overflow-hidden">
              <PosterPreview
                photoUrl={SAMPLE_PHOTO}
                quote={["Bir gece gökyüzünden düştün.", "Sen ve ben, sonsuza dek.", "Yıldızların altında ilk bakış."][i - 1]}
                date={["2022-06-21", "2024-02-14", "2023-11-09"][i - 1]}
                city={[
                  { name: "Kapadokya", lat: 38.6431, lon: 34.8289 },
                  { name: "Paris", lat: 48.8566, lon: 2.3522 },
                  { name: "İzmir", lat: 38.4192, lon: 27.1287 },
                ][i - 1]}
                zodiac={["İkizler", "Kova", "Akrep"][i - 1]}
                spotifyUrl="https://open.spotify.com"
              />
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    { n: "01", t: "Anınızı Seçin", d: "Sizin için özel olan tarihi, şehri ve fotoğrafı belirleyin." },
    { n: "02", t: "Şarkınızı Ekleyin", d: "Spotify linkini paylaşın, tablonun köşesine QR olarak işlensin." },
    { n: "03", t: "Sözünüzü Yazın", d: "Tablonun ortasında yer alacak, kalbinizden bir cümle." },
    { n: "04", t: "Üretim & Teslim", d: "15×20 cm masaüstü pleksi üzerinde el işçiliğiyle üretip kapınıza ulaştırırız." },
  ];
  return (
    <section className="relative bg-midnight-900/40 border-y border-cream-50/10">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="font-cinzel text-[11px] tracking-[0.45em] text-gold">SÜREÇ</span>
            <h2 className="mt-5 font-display text-3xl md:text-5xl text-cream-50">Dört adımda kişisel bir hatıra</h2>
          </div>
          <Link to="/customize" className="btn-ghost self-start" data-testid="process-cta">Hemen Başla</Link>
        </div>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s) => (
            <div key={s.n} className="border border-cream-50/10 p-7 bg-midnight-950/40">
              <div className="font-cinzel text-[11px] tracking-[0.4em] text-gold">{s.n}</div>
              <h3 className="mt-5 font-display text-xl text-cream-50">{s.t}</h3>
              <p className="mt-3 font-mont text-sm text-cream-200/75 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="max-w-5xl mx-auto px-6 md:px-10 py-28 text-center">
      <span className="font-cinzel text-[11px] tracking-[0.45em] text-gold">UNUTULMAZ HEDİYE</span>
      <h2 className="mt-6 font-display text-4xl md:text-6xl leading-tight">
        Onu, evrendeki tek <em className="italic text-gold">o anda</em> ölümsüzleştirin.
      </h2>
      <p className="mt-6 font-mont text-cream-200/80 max-w-xl mx-auto">
        Yıldönümleri, doğum günleri, evlilik teklifleri… Aysu Art tablosu, kelimelerin yetmediği
        anlamları taşır.
      </p>
      <div className="mt-10">
        <Link to="/customize" className="btn-gold" data-testid="final-cta">Tablonu Tasarla</Link>
      </div>
    </section>
  );
}
