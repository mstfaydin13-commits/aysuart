import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { Loader2, LogOut, ChevronRight, Package2 } from "lucide-react";
import { Badge } from "../components/ui/badge";

const STATUS_LABEL = {
  pending: "BEKLİYOR",
  approved: "ONAYLANDI",
  in_production: "ÜRETİMDE",
  shipped: "KARGODA",
  completed: "TAMAMLANDI",
  cancelled: "İPTAL",
};

const STATUS_COLOR = {
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  approved: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  in_production: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  shipped: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  cancelled: "bg-red-500/15 text-red-300 border-red-500/30",
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/orders")
      .then((r) => setOrders(r.data.orders || []))
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    inProd: orders.filter((o) => o.status === "in_production").length,
    completed: orders.filter((o) => o.status === "completed").length,
  };

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <span className="font-cinzel text-[11px] tracking-[0.45em] text-gold">YÖNETİM PANELİ</span>
          <h1 className="mt-2 font-display text-3xl md:text-4xl text-cream-50">Siparişler</h1>
          <p className="mt-1 font-mont text-sm text-cream-200/60">Hoş geldin, {user?.name || user?.email}</p>
        </div>
        <button onClick={() => { logout(); navigate("/admin/login"); }} data-testid="admin-logout-btn" className="btn-ghost">
          <LogOut className="w-4 h-4" /> Çıkış
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
        <Stat label="TOPLAM" value={stats.total} />
        <Stat label="BEKLİYOR" value={stats.pending} accent="text-amber-400" />
        <Stat label="ÜRETİMDE" value={stats.inProd} accent="text-purple-300" />
        <Stat label="TAMAMLANAN" value={stats.completed} accent="text-emerald-300" />
      </div>

      {loading ? (
        <div className="py-16 text-center"><Loader2 className="w-6 h-6 mx-auto animate-spin text-gold" /></div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center font-mont text-sm text-cream-200/60 border border-dashed border-cream-50/10">
          Henüz sipariş yok.
        </div>
      ) : (
        <div className="border border-cream-50/10 overflow-hidden">
          <table className="w-full text-left" data-testid="admin-orders-table">
            <thead className="bg-midnight-900/60 font-cinzel text-[10px] tracking-[0.3em] text-gold">
              <tr>
                <th className="px-5 py-4">SİPARİŞ</th>
                <th className="px-5 py-4">MÜŞTERİ</th>
                <th className="px-5 py-4 hidden md:table-cell">ŞEHİR / TARİH</th>
                <th className="px-5 py-4 hidden lg:table-cell">EKSTRA</th>
                <th className="px-5 py-4">DURUM</th>
                <th className="px-5 py-4"></th>
              </tr>
            </thead>
            <tbody className="font-mont text-sm">
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-cream-50/5 hover:bg-midnight-900/40 transition">
                  <td className="px-5 py-4 text-cream-200/80 font-mono">#{o.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-5 py-4">
                    <div className="text-cream-50">{o.customer_name}</div>
                    <div className="text-cream-200/50 text-xs">{o.customer_email}</div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell text-cream-200/70">
                    <div>{o.city_name}</div>
                    <div className="text-xs text-cream-200/50">{o.memory_date}</div>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell text-cream-200/70 text-xs">
                    {o.gift_package ? <span className="mr-2 inline-flex items-center gap-1"><Package2 className="w-3 h-3" /> Paket</span> : null}
                    {o.message_card ? <span className="inline-flex items-center gap-1">Kart</span> : null}
                    {!o.gift_package && !o.message_card ? "—" : null}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-block px-2 py-1 border text-[10px] tracking-widest ${STATUS_COLOR[o.status] || ""}`}>
                      {STATUS_LABEL[o.status] || o.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link to={`/admin/orders/${o.id}`} data-testid={`admin-order-link-${o.id}`} className="text-gold inline-flex items-center gap-1 text-xs tracking-widest font-cinzel">
                      DETAY <ChevronRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Stat({ label, value, accent = "text-cream-50" }) {
  return (
    <div className="bg-midnight-900/50 border border-cream-50/10 p-5">
      <div className="font-cinzel text-[10px] tracking-[0.4em] text-gold">{label}</div>
      <div className={`mt-3 font-display text-3xl ${accent}`}>{value}</div>
    </div>
  );
}
