import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Loader2, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  if (user && user.role === "admin") return <Navigate to="/admin" replace />;
  if (user && user.role === "customer") return <Navigate to="/account" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const u = await login(email.trim().toLowerCase(), password);
      toast.success("Hoş geldiniz");
      navigate(u.role === "admin" ? "/admin" : "/account");
    } catch (err) {
      const msg = err?.response?.data?.detail || "Giriş başarısız";
      toast.error(typeof msg === "string" ? msg : "Giriş başarısız");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="max-w-md mx-auto px-6 py-20">
      <div className="text-center mb-10">
        <span className="block font-cinzel text-[11px] tracking-[0.45em] text-gold">HESABIM</span>
        <h1 className="mt-3 font-display text-3xl text-cream-50">Giriş Yap</h1>
        <p className="mt-2 font-mont text-sm text-cream-200/60">
          Henüz hesabın yok mu? <Link to="/register" className="text-gold hover:underline" data-testid="login-register-link">Kayıt ol</Link>
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-5 bg-midnight-900/50 border border-cream-50/10 p-8">
        <Field label="E-POSTA">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required data-testid="login-email-input" className="w-full bg-midnight-950 border border-cream-50/10 px-4 py-3 font-mont text-sm text-cream-50 focus:outline-none focus:border-gold/60 rounded-sm" />
        </Field>
        <Field label="PAROLA">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required data-testid="login-password-input" className="w-full bg-midnight-950 border border-cream-50/10 px-4 py-3 font-mont text-sm text-cream-50 focus:outline-none focus:border-gold/60 rounded-sm" />
        </Field>
        <button type="submit" disabled={busy} data-testid="login-submit-btn" className="btn-gold w-full justify-center">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {busy ? "Giriş yapılıyor" : "Giriş Yap"}
          <ChevronRight className="w-4 h-4" />
        </button>
      </form>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block font-cinzel text-[11px] tracking-[0.4em] text-gold mb-2">{label}</label>
      {children}
    </div>
  );
}
