import React from "react";
import { Link } from "react-router-dom";
import PosterPreview from "../components/poster/PosterPreview";

const SAMPLES = [
  {
    photo: "https://images.unsplash.com/photo-1743642638516-6e26674b8372?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NDh8MHwxfHNlYXJjaHwyfHxyb21hbnRpYyUyMGNvdXBsZSUyMGJsYWNrJTIwYW5kJTIwd2hpdGV8ZW58MHx8fHwxNzc3NDEyMzMyfDA&ixlib=rb-4.1.0&q=85",
    quote: "Bir gece gökyüzünden düştün.",
    date: "2022-06-21",
    city: { name: "Kapadokya", lat: 38.6431, lon: 34.8289 },
    zodiac: "İkizler",
  },
  {
    photo: "https://images.unsplash.com/photo-1743642638414-d2260235c7bc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NDh8MHwxfHNlYXJjaHwzfHxyb21hbnRpYyUyMGNvdXBsZSUyMGJsYWNrJTIwYW5kJTIwd2hpdGV8ZW58MHx8fHwxNzc3NDEyMzMyfDA&ixlib=rb-4.1.0&q=85",
    quote: "Sen ve ben, sonsuza dek.",
    date: "2024-02-14",
    city: { name: "Paris", lat: 48.8566, lon: 2.3522 },
    zodiac: "Kova",
  },
  {
    photo: "https://images.pexels.com/photos/31743605/pexels-photo-31743605.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    quote: "Yıldızların altında ilk bakış.",
    date: "2023-11-09",
    city: { name: "İzmir", lat: 38.4192, lon: 27.1287 },
    zodiac: "Akrep",
  },
  {
    photo: "https://images.unsplash.com/photo-1743642638516-6e26674b8372?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NDh8MHwxfHNlYXJjaHwyfHxyb21hbnRpYyUyMGNvdXBsZSUyMGJsYWNrJTIwYW5kJTIwd2hpdGV8ZW58MHx8fHwxNzc3NDEyMzMyfDA&ixlib=rb-4.1.0&q=85",
    quote: "Sen, evrenin en güzel tesadüfüsün.",
    date: "2021-12-31",
    city: { name: "Bodrum", lat: 37.0344, lon: 27.4305 },
    zodiac: "Yay",
  },
  {
    photo: "https://images.unsplash.com/photo-1743642638414-d2260235c7bc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NDh8MHwxfHNlYXJjaHwzfHxyb21hbnRpYyUyMGNvdXBsZSUyMGJsYWNrJTIwYW5kJTIwd2hpdGV8ZW58MHx8fHwxNzc3NDEyMzMyfDA&ixlib=rb-4.1.0&q=85",
    quote: "Aynı gökyüzünün altında, aynı kalp atışı.",
    date: "2025-04-23",
    city: { name: "Antalya", lat: 36.8969, lon: 30.7133 },
    zodiac: "Boğa",
  },
  {
    photo: "https://images.pexels.com/photos/31743605/pexels-photo-31743605.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    quote: "Hayat seninle masal gibi.",
    date: "2020-09-12",
    city: { name: "Roma", lat: 41.9028, lon: 12.4964 },
    zodiac: "Başak" },
];

export default function Gallery() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-2xl">
        <span className="font-cinzel text-[11px] tracking-[0.45em] text-gold">GALERİ</span>
        <h1 className="mt-4 font-display text-3xl md:text-5xl text-cream-50">Müşterilerimizin yıldız anıları</h1>
        <p className="mt-4 font-mont text-cream-200/75">Her tablo, eşi olmayan bir hatıra. İlham alın, kendi tablonuzu tasarlayın.</p>
      </div>
      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {SAMPLES.map((s, i) => (
          <div key={i} className="">
            <PosterPreview
              photoUrl={s.photo}
              quote={s.quote}
              date={s.date}
              city={s.city}
              zodiac={s.zodiac}
              spotifyUrl="https://open.spotify.com"
            />
          </div>
        ))}
      </div>
      <div className="mt-20 text-center">
        <Link to="/customize" className="btn-gold" data-testid="gallery-cta">Kendi Tablonu Tasarla</Link>
      </div>
    </section>
  );
}
