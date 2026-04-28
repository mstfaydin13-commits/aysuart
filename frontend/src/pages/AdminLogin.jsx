import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  if (user && user.role === "admin") return <Navigate to="/admin" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email.trim().toLowerCase(), password);
      toast.success("Hoş geldiniz");
      navigate("/admin");
    } catch (err) {
      const msg = err?.response?.data?.detail || "Giriş başarısız";
      toast.error(typeof msg === "string" ? msg : "Giriş başarısız");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="max-w-md mx-auto px-6 py-24">
      <div className="text-center mb-10">
        <Lock className="w-7 h-7 mx-auto text-gold" strokeWidth={1.4} />
        <span className="mt-4 block font-cinzel text-[11px] tracking-[0.45em] text-gold">YÖNETİM</span>
        <h1 className="mt-3 font-display text-3xl text-cream-50">Aysu Art Admin</h1>
        <p className="mt-2 font-mont text-sm text-cream-200/60">Yalnızca yetkili personel.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-5 bg-midnight-900/50 border border-cream-50/10 p-8">
        <div>
          <label className="block font-cinzel text-[11px] tracking-[0.4em] text-gold mb-2">E-POSTA</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid="admin-email-input"
            className="w-full bg-midnight-950 border border-cream-50/10 px-4 py-3 font-mont text-sm text-cream-50 focus:outline-none focus:border-gold/60 rounded-sm"
            required
          />
        </div>
        <div>
          <label className="block font-cinzel text-[11px] tracking-[0.4em] text-gold mb-2">PAROLA</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="admin-password-input"
            className="w-full bg-midnight-950 border border-cream-50/10 px-4 py-3 font-mont text-sm text-cream-50 focus:outline-none focus:border-gold/60 rounded-sm"
            required
          />
        </div>
        <button type="submit" disabled={busy} data-testid="admin-login-btn" className="btn-gold w-full justify-center">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {busy ? "Giriş yapılıyor" : "Giriş Yap"}
        </button>
      </form>
    </section>
  );
}
