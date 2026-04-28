import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

const Q = [
  { q: "Tablo boyutu nedir?", a: "Standart boyutumuz 30×50 cm dikey pleksidir. Talep üzerine farklı boyutlar üretebiliriz." },
  { q: "Yıldız haritası gerçek mi?", a: "Evet. Tarih ve şehir koordinatlarınızdan o anın gökyüzü hesaplanır ve dairesel haritaya işlenir." },
  { q: "Hangi tarihler kullanılabilir?", a: "Geçmiş veya gelecek herhangi bir tarihi kullanabilirsiniz. Yıl dönümü, doğum günü, evlilik teklifi gibi." },
  { q: "Fotoğraf kalitesi nasıl olmalı?", a: "Net, yüksek çözünürlüklü (en az 1500×1500 piksel önerilir) ve yüzlerin tablonun üst kısmına yakın çerçevelenmiş olması idealdir." },
  { q: "Spotify yerine başka platform olabilir mi?", a: "Tablo üretiminde Spotify QR'ı standart olsa da; Apple Music, YouTube veya Soundcloud bağlantıları için bizimle iletişime geçin." },
  { q: "Üretim ve teslim süresi nedir?", a: "Tasarım onayından sonra 3-5 iş günü içinde üretilir, kargo süresiyle birlikte 5-7 iş gününde teslim edilir." },
  { q: "İade & iptal nasıl?", a: "Kişiye özel ürün olduğundan üretim onayı verildikten sonra iade alınmaz. Tasarım onayı vermeden önce dilediğiniz kadar revize talep edebilirsiniz." },
];

export default function FAQ() {
  return (
    <section className="max-w-3xl mx-auto px-6 md:px-10 py-20">
      <span className="font-cinzel text-[11px] tracking-[0.45em] text-gold">SIKÇA SORULANLAR</span>
      <h1 className="mt-4 font-display text-3xl md:text-5xl text-cream-50">Aklınıza takılan her şey</h1>
      <div className="mt-12">
        <Accordion type="single" collapsible className="space-y-3">
          {Q.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-cream-50/10 px-5 bg-midnight-900/40">
              <AccordionTrigger
                data-testid={`faq-trigger-${i}`}
                className="font-display text-lg text-cream-50 hover:no-underline"
              >
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="font-mont text-sm text-cream-200/80 leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
