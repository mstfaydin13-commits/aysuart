import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie } from "lucide-react";

const KEY = "aysu_cookie_consent_v1";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) {
      const t = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = (val) => {
    localStorage.setItem(KEY, val);
    setShow(false);
  };

  if (!show) return null;
  return (
    <div
      data-testid="cookie-consent"
      className="fixed bottom-4 left-4 right-4 md:left-6 md:bottom-6 md:right-auto md:max-w-md z-50 glass border border-cream-50/15 p-5 shadow-2xl"
    >
      <div className="flex items-start gap-4">
        <Cookie className="w-6 h-6 text-gold shrink-0 mt-0.5" strokeWidth={1.4} />
        <div className="flex-1">
          <div className="font-cinzel text-[11px] tracking-[0.4em] text-gold">ÇEREZLER</div>
          <p className="mt-2 font-mont text-xs text-cream-200/80 leading-relaxed">
            Sitemizde deneyiminizi iyileştirmek için çerezler kullanıyoruz.
            Detaylar için <Link to="/gizlilik" className="text-gold underline">Gizlilik Politikası</Link>'nı inceleyebilirsiniz.
          </p>
          <div className="mt-4 flex gap-2">
            <button onClick={() => accept("accepted")} data-testid="cookie-accept-btn" className="flex-1 px-3 py-2 bg-gold text-midnight-950 text-[11px] tracking-widest font-mont uppercase hover:bg-gold-muted transition rounded-sm">
              Kabul Et
            </button>
            <button onClick={() => accept("dismissed")} data-testid="cookie-dismiss-btn" className="flex-1 px-3 py-2 border border-cream-50/20 text-cream-200/80 text-[11px] tracking-widest font-mont uppercase hover:border-gold/60 hover:text-gold transition rounded-sm">
              Yalnızca Zorunlu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
