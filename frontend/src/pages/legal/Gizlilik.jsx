import React from "react";
import { LegalLayout, COMPANY_INFO } from "./_layout";

export default function Gizlilik() {
  return (
    <LegalLayout title="Gizlilik Politikası" badge="GİZLİLİK">
      <p>
        Aysu Art ({COMPANY_INFO.name}) olarak müşterilerimizin gizliliğine saygı duyuyor ve kişisel verilerinin
        korunmasına büyük önem veriyoruz. İşbu Gizlilik Politikası, web sitemizi ziyaret eden ve hizmetlerimizi
        kullanan kullanıcıların verilerinin nasıl toplandığını, işlendiğini ve korunduğunu açıklar.
      </p>

      <h2>1. Toplanan Bilgiler</h2>
      <ul>
        <li><strong>Kimlik bilgileri:</strong> Ad, soyad, telefon, e-posta</li>
        <li><strong>Teslimat bilgileri:</strong> Açık adres</li>
        <li><strong>Sipariş bilgileri:</strong> Yüklenen fotoğraf, tarih, şehir, anı cümlesi, Spotify bağlantısı</li>
        <li><strong>Teknik bilgiler:</strong> IP adresi, tarayıcı türü, çerez verileri</li>
      </ul>

      <h2>2. Bilgilerin Kullanım Amacı</h2>
      <ul>
        <li>Siparişin alınması, hazırlanması ve teslim edilmesi</li>
        <li>Müşteri hizmetleri ve iletişim</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi (fatura, garanti vb.)</li>
        <li>Hizmet kalitesinin artırılması ve site deneyiminin iyileştirilmesi</li>
        <li>İzin verilmesi halinde tanıtım ve kampanya bildirimleri</li>
      </ul>

      <h2>3. Bilgilerin Paylaşımı</h2>
      <p>
        Kişisel verileriniz; kargo firması, ödeme altyapı sağlayıcıları ve yasal merciler dışında üçüncü kişilerle
        paylaşılmaz. Tüm paylaşımlar yalnızca hizmetin sağlanması için zorunlu olduğu ölçüde gerçekleşir.
      </p>

      <h2>4. Çerezler (Cookies)</h2>
      <p>
        Web sitemizde kullanıcı deneyimini iyileştirmek amacıyla çerezler kullanılır. Tarayıcı ayarlarınızdan
        çerezleri devre dışı bırakabilirsiniz; ancak bu durumda sitenin bazı işlevleri sınırlı çalışabilir.
      </p>

      <h2>5. Veri Güvenliği</h2>
      <p>
        Verileriniz, güncel teknik ve idari önlemlerle korunur. Şifreler bcrypt ile geri dönüşsüz biçimde
        şifrelenir; bağlantılar HTTPS protokolü ile sağlanır; yetkisiz erişime karşı tüm makul güvenlik tedbirleri
        alınır.
      </p>

      <h2>6. Haklarınız (KVKK 11. Madde)</h2>
      <ul>
        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
        <li>Verilerinize erişme, düzeltme veya silinmesini isteme</li>
        <li>Eksik/yanlış işlenen verilerin düzeltilmesini isteme</li>
        <li>İzin verdiğiniz pazarlama iletişiminden vazgeçme</li>
      </ul>
      <p>
        Talepleriniz için bize <strong>{COMPANY_INFO.email}</strong> adresinden ulaşabilirsiniz.
      </p>

      <h2>7. Politika Değişiklikleri</h2>
      <p>
        İşbu Gizlilik Politikası ihtiyaç halinde güncellenebilir. Güncellenmiş metin web sitesinde yayınlandığı
        andan itibaren geçerli olur.
      </p>
    </LegalLayout>
  );
}
