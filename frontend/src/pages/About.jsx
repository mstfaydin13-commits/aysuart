import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <section className="max-w-4xl mx-auto px-6 md:px-10 py-20">
      <span className="font-cinzel text-[11px] tracking-[0.45em] text-gold">HİKAYEMİZ</span>
      <h1 className="mt-4 font-display text-4xl md:text-6xl text-cream-50 leading-tight">
        İnsanların <em className="text-gold italic">en kıymetli anlarını</em> ölümsüzleştiriyoruz.
      </h1>
      <div className="gold-divider my-10" />
      <div className="font-mont text-base md:text-lg text-cream-200/85 leading-relaxed space-y-6">
        <p>
          Aysu Art, gökyüzüne sıkı sıkıya bağlı bir hediye atölyesidir. Her tablo, sevdiklerinin bir
          anısını sonsuza kadar saklamak isteyenler için tasarlanır.
        </p>
        <p>
          Üretim sürecimizde her detay özenle ele alınır: Fotoğrafınız önce siyah-beyaza çevrilir,
          ardından gece mavisi tonlarıyla yeniden boyanır. Yıldız haritası, vermiş olduğunuz tarih
          ve şehrin koordinatlarından hesaplanır. Tablonun sağ alt köşesinde yer alan Spotify QR
          kodu ise anınıza eşlik eden şarkıyı taşır.
        </p>
        <p>
          Premium pleksi üzerinde, 15×20 cm masaüstü formatta ürettiğimiz tablolar; el işçiliğiyle son
          rötuşlardan geçirilir ve sevdiklerine özel bir hediye paketinde teslim edilir.
        </p>
      </div>
      <div className="mt-12">
        <Link to="/customize" className="btn-gold" data-testid="about-cta">Tablonu Tasarla</Link>
      </div>
    </section>
  );
}
