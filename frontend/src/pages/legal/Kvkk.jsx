import React from "react";
import { LegalLayout, COMPANY_INFO } from "./_layout";

export default function Kvkk() {
  return (
    <LegalLayout title="KVKK Aydınlatma Metni" badge="KVKK">
      <p>
        6698 Sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, veri sorumlusu sıfatıyla{" "}
        <strong>{COMPANY_INFO.name}</strong> ("Aysu Art") tarafından kişisel verileriniz aşağıda açıklanan kapsamda
        işlenmektedir.
      </p>

      <h2>1. Veri Sorumlusu</h2>
      <ul>
        <li>Ünvan: {COMPANY_INFO.name}</li>
        <li>Adres: {COMPANY_INFO.address}</li>
        <li>E-posta: {COMPANY_INFO.email}</li>
      </ul>

      <h2>2. İşlenen Kişisel Veriler</h2>
      <ul>
        <li><strong>Kimlik:</strong> Ad, soyad</li>
        <li><strong>İletişim:</strong> E-posta, telefon, adres</li>
        <li><strong>Müşteri işlem:</strong> Sipariş bilgileri, anı cümlesi, tarih, şehir, fotoğraf, müzik tercihi</li>
        <li><strong>İşlem güvenliği:</strong> IP, çerez kayıtları, oturum bilgileri</li>
      </ul>

      <h2>3. İşlenme Amaçları</h2>
      <ul>
        <li>Sipariş süreçlerinin yürütülmesi (üretim, kargo, teslim)</li>
        <li>Müşteri ilişkilerinin yönetimi ve iletişim</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi</li>
        <li>Web sitesi ve hizmet kalitesinin geliştirilmesi</li>
      </ul>

      <h2>4. Hukuki Sebep</h2>
      <p>
        Verileriniz, KVKK m.5'te belirtilen "sözleşmenin kurulması ve ifası", "yasal yükümlülüğün yerine getirilmesi"
        ve "veri sorumlusunun meşru menfaati" hukuki sebeplerine dayanılarak işlenmektedir.
      </p>

      <h2>5. Aktarım</h2>
      <p>
        Verileriniz; siparişin teslimi için kargo firmaları, ödeme altyapı sağlayıcıları ve yasal mercilerle, hizmetin
        gerektirdiği ölçüde paylaşılır. Yurt dışına veri aktarımı söz konusu değildir.
      </p>

      <h2>6. Saklama Süresi</h2>
      <p>
        Kişisel verileriniz; ilgili mevzuatın öngördüği süreler ve sözleşmeden doğan yükümlülüklerin sona ermesinden
        itibaren makul süre boyunca saklanır, bu sürenin sonunda KVKK'ya uygun şekilde imha edilir.
      </p>

      <h2>7. Haklarınız</h2>
      <p>KVKK m.11 kapsamında her zaman aşağıdaki haklarınızı kullanabilirsiniz:</p>
      <ul>
        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
        <li>İşlenmişse bilgi talep etme</li>
        <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
        <li>Eksik/yanlış işlenmiş verilerin düzeltilmesini isteme</li>
        <li>Silinmesini ya da yok edilmesini isteme</li>
        <li>İşlemenin münhasıran otomatik sistemlerle analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
        <li>Verilerin kanuna aykırı işlenmesi sebebiyle uğradığınız zararın giderilmesini talep etme</li>
      </ul>
      <p>
        Taleplerinizi <strong>{COMPANY_INFO.email}</strong> adresine iletebilirsiniz. Başvurunuz, KVKK'ya uygun
        biçimde en geç 30 gün içinde yanıtlanır.
      </p>
    </LegalLayout>
  );
}
