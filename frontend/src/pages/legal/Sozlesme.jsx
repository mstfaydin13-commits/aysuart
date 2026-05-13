import React from "react";
import { LegalLayout, COMPANY_INFO } from "./_layout";

export default function Sozlesme() {
  return (
    <LegalLayout title="Mesafeli Satış Sözleşmesi" badge="SÖZLEŞME">
      <h2>1. Taraflar</h2>
      <p>
        İşbu sözleşme, bir tarafta <strong>{COMPANY_INFO.name}</strong> ("Aysu Art" veya "Satıcı"), diğer tarafta
        siparişi onaylayan müşteri ("Alıcı") arasında, aşağıdaki koşullarda akdedilmiştir.
      </p>

      <h3>SATICI BİLGİLERİ</h3>
      <ul>
        <li>Ünvan: {COMPANY_INFO.name}</li>
        <li>Adres: {COMPANY_INFO.address}</li>
        <li>Vergi Dairesi / No: {COMPANY_INFO.taxOffice} / {COMPANY_INFO.taxNumber}</li>
        <li>E-posta: {COMPANY_INFO.email}</li>
        <li>Telefon: {COMPANY_INFO.phone}</li>
      </ul>

      <h2>2. Sözleşmenin Konusu</h2>
      <p>
        İşbu sözleşmenin konusu, Alıcı'nın Satıcı'ya ait <em>{COMPANY_INFO.website}</em> internet sitesinden elektronik
        ortamda sipariş verdiği, kişiye özel olarak üretilen yıldız haritalı pleksi tablonun (30×50 cm) satışı ve teslimi
        ile tarafların hak ve yükümlülüklerinin belirlenmesidir.
      </p>

      <h2>3. Ürün ve Fiyat Bilgisi</h2>
      <p>
        Ürünün temel özellikleri (boyut, malzeme, kişiselleştirme detayları), satış fiyatı, KDV dahil toplam tutar,
        kargo ücreti ve teslim süresi web sitesinde sipariş onayı öncesinde Alıcı'ya gösterilir. Alıcı, sipariş
        verirken bu bilgileri okuduğunu ve onayladığını kabul eder.
      </p>

      <h2>4. Ürünün Kişiye Özel Üretim Niteliği</h2>
      <p>
        Aysu Art tarafından üretilen tablolar, Alıcı'nın yüklediği fotoğraf, seçtiği tarih, şehir, anı cümlesi
        ve müzik tercihi doğrultusunda <strong>kişiye özel üretilmektedir</strong>. Bu nedenle 6502 sayılı Tüketicinin
        Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesi uyarınca cayma hakkı
        kapsamı dışındadır.
      </p>

      <h2>5. Teslimat</h2>
      <ul>
        <li>Tasarım onayı verildikten sonra üretim 3–5 iş günü içinde tamamlanır.</li>
        <li>Kargo süresi 1–3 iş günüdür.</li>
        <li>Teslimat anlaşmalı kargo firması ile Alıcı'nın belirttiği adrese yapılır.</li>
        <li>Kargo ücreti, sipariş onayı sırasında ayrıca belirtilir.</li>
      </ul>

      <h2>6. Ödeme</h2>
      <p>
        Ödeme, web sitesi üzerinden kredi/banka kartı ya da havale/EFT yöntemiyle yapılır. Ödeme alındıktan ve
        tasarım Alıcı tarafından onaylandıktan sonra üretime geçilir.
      </p>

      <h2>7. Tasarım Onayı</h2>
      <p>
        Sipariş sonrası Aysu Art tasarım ekibi, Alıcı'nın yüklediği fotoğraf ve seçimleri doğrultusunda dijital
        bir önizleme hazırlar. Alıcı bu önizlemeyi onayladıktan sonra üretim başlar. Alıcı dilerse onay öncesi
        revize talep edebilir.
      </p>

      <h2>8. Sorumluluğun Sınırları</h2>
      <p>
        Alıcı'nın yüklediği fotoğrafın çözünürlük yetersizliği, hatalı bilgi (tarih, şehir, ad-soyad vb.) veya
        Spotify bağlantısının geçersizliği halinde Aysu Art'ın sorumluluğu doğmaz. Alıcı bilgilerin doğruluğundan
        kendi sorumludur.
      </p>

      <h2>9. Yetkili Mahkeme</h2>
      <p>
        İşbu sözleşmenin uygulanmasından doğan uyuşmazlıklarda Tüketici Hakem Heyetleri ile Tüketici Mahkemeleri
        yetkilidir.
      </p>

      <h2>10. Yürürlük</h2>
      <p>
        Alıcı, sipariş onayı vererek işbu sözleşmenin tüm maddelerini okuduğunu, anladığını ve kabul ettiğini
        beyan eder. Sözleşme onay tarihinden itibaren yürürlüğe girer.
      </p>
    </LegalLayout>
  );
}
