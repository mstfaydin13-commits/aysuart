import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { Loader2, LogOut, Package, Star } from "lucide-react";

const STATUS_LABEL = {
  pending: "Bekliyor",
  approved: "Onaylandı",
  in_production: "Üretimde",
  shipped: "Kargoda",
  completed: "Tamamlandı",
  cancelled: "İptal",
};

export default function Account() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/me/orders").then((r) => setOrders(r.data.orders || [])).finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-5xl mx-auto px-6 md:px-10 py-16">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <div>
          <span className="font-cinzel text-[11px] tracking-[0.45em] text-gold">HESABIM</span>
          <h1 className="mt-3 font-display text-3xl md:text-4xl text-cream-50">Merhaba, {user?.name || user?.email}</h1>
          <p className="mt-1 font-mont text-sm text-cream-200/60">{user?.email}</p>
        </div>
        <button onClick={() => { logout(); navigate("/"); }} data-testid="account-logout-btn" className="btn-ghost">
          <LogOut className="w-4 h-4" /> Çıkış Yap
        </button>
      </div>

      <div className="mb-10">
        <h2 className="font-display text-2xl text-cream-50 mb-2">Siparişlerim</h2>
        <p className="font-mont text-sm text-cream-200/60">Geçmişteki tüm tablo siparişleriniz burada listelenir.</p>
      </div>

      {loading ? (
        <div className="py-16 text-center"><Loader2 className="w-6 h-6 mx-auto animate-spin text-gold" /></div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-cream-50/10 px-6">
          <Star className="w-7 h-7 mx-auto text-gold" strokeWidth={1.4} />
          <p className="mt-4 font-mont text-sm text-cream-200/65">Henüz bir siparişiniz yok.</p>
          <Link to="/customize" className="btn-gold mt-6 inline-flex" data-testid="account-customize-cta">İlk Tabloyu Tasarla</Link>
        </div>
      ) : (
        <div className="space-y-4" data-testid="account-orders-list">
          {orders.map((o) => (
            <Link
              key={o.id}
              to={`/order/${o.id}`}
              data-testid={`account-order-${o.id}`}
              className="block border border-cream-50/10 p-5 bg-midnight-900/40 hover:border-gold/50 transition group"
            >
              <div className="flex flex-wrap items-center gap-4 justify-between">
                <div className="flex items-center gap-4">
                  <Package className="w-5 h-5 text-gold" strokeWidth={1.4} />
                  <div>
                    <div className="font-mont text-[11px] tracking-widest text-cream-200/55">SİPARİŞ #{o.id.slice(0,8).toUpperCase()}</div>
                    <div className="font-display text-lg text-cream-50 italic mt-0.5">"{(o.quote_text || '').slice(0,60)}{(o.quote_text||'').length>60?'…':''}"</div>
                    <div className="font-mont text-xs text-cream-200/55 mt-1">{o.city_name} · {o.memory_date}</div>
                  </div>
                </div>
                <div className="font-cinzel text-[11px] tracking-[0.35em] text-gold">
                  {(STATUS_LABEL[o.status] || o.status).toUpperCase()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
