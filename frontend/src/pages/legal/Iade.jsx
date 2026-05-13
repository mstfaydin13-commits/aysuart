import React from "react";
import { LegalLayout, COMPANY_INFO } from "./_layout";

export default function Iade() {
  return (
    <LegalLayout title="İptal ve İade Politikası" badge="İPTAL & İADE">
      <h2>Sipariş İptali</h2>
      <ul>
        <li>Tasarım onayı verilmeden önce sipariş iptal edilebilir; ödeme bedeli ilgili banka aracılığı ile iade edilir.</li>
        <li>Tasarım onayı verildikten ve üretim süreci başladıktan sonra sipariş iptali yapılamaz; çünkü tablo Alıcı'ya özel üretilmektedir.</li>
        <li>Kargoya verilmiş siparişlerde iptal işlemi yapılamaz.</li>
      </ul>

      <h2>İade Koşulları</h2>
      <ul>
        <li>Aysu Art ürünleri <strong>kişiye özel olarak üretildiğinden</strong>, 6502 Sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesi gereğince <strong>cayma hakkı kapsamı dışındadır</strong> ve iade kabul edilmez.</li>
        <li>Ancak ürünün; üretim hatası, kargo sürecinde oluşan kırık/çizik, veya Aysu Art'tan kaynaklanan tasarım hatası içermesi halinde Alıcı, ürünü teslim aldığı tarihten itibaren <strong>7 gün</strong> içinde Aysu Art'a başvurarak değişim talep edebilir.</li>
        <li>Değişim talep edilen ürünün; kullanılmamış, hasarsız (kargo hasarı haricinde) ve orijinal ambalajında olması gerekmektedir.</li>
      </ul>

      <h2>İade Süreci</h2>
      <ul>
        <li>İade/değişim talepleri <strong>{COMPANY_INFO.email}</strong> adresine sipariş numarası ve durumu açıklayan fotoğraf(lar) ile birlikte gönderilmelidir.</li>
        <li>Talep, ekibimiz tarafından 2 iş günü içinde değerlendirilir ve sonuç Alıcı'ya iletilir.</li>
        <li>Onaylanan iadelerde, iade kargo bedeli; üretim/kargo hatası halinde Aysu Art'a, diğer durumlarda Alıcı'ya aittir.</li>
      </ul>

      <h2>Ücret İadesi</h2>
      <ul>
        <li>İade onaylandıktan sonra ürün bedeli, ödeme yapılan yöntemle (kredi kartı / havale) <strong>7–14 iş günü</strong> içinde iade edilir.</li>
        <li>Kredi kartı iadelerinde, iadenin kart hesabına yansıma süresi bankaya bağlı olarak değişebilir.</li>
        <li>Kargo bedelleri, üretim/kargo hatası dışındaki durumlarda iade edilmez.</li>
      </ul>

      <h2>İletişim</h2>
      <p>
        Tüm iptal, iade ve değişim talepleriniz için bizimle iletişime geçebilirsiniz:
        <br />E-posta: <strong>{COMPANY_INFO.email}</strong>
        <br />Telefon: <strong>{COMPANY_INFO.phone}</strong>
      </p>
    </LegalLayout>
  );
}
