import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { api, tokenStore } from "../lib/api";
import { useAuth } from "../lib/auth";
import { Loader2, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function Register() {
  const { user, login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  if (user && user.role) return <Navigate to={user.role === "admin" ? "/admin" : "/account"} replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!agree) return toast.error("Devam etmek için sözleşmeleri onaylamalısınız");
    if (password.length < 6) return toast.error("Parola en az 6 karakter olmalı");
    setBusy(true);
    try {
      await api.post("/auth/register", {
        email: email.trim().toLowerCase(),
        password,
        name: name.trim(),
        phone: phone.trim(),
      });
      // Auto-login
      await login(email.trim().toLowerCase(), password);
      toast.success("Hesabınız oluşturuldu");
      navigate("/account");
    } catch (err) {
      const msg = err?.response?.data?.detail || "Kayıt başarısız";
      toast.error(typeof msg === "string" ? msg : "Kayıt başarısız");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="max-w-md mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <span className="block font-cinzel text-[11px] tracking-[0.45em] text-gold">YENİ HESAP</span>
        <h1 className="mt-3 font-display text-3xl text-cream-50">Kayıt Ol</h1>
        <p className="mt-2 font-mont text-sm text-cream-200/60">
          Zaten üye misin? <Link to="/login" className="text-gold hover:underline" data-testid="register-login-link">Giriş yap</Link>
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-5 bg-midnight-900/50 border border-cream-50/10 p-8">
        <Field label="AD SOYAD">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required data-testid="register-name-input" className="input" />
        </Field>
        <Field label="E-POSTA">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required data-testid="register-email-input" className="input" />
        </Field>
        <Field label="TELEFON (Opsiyonel)">
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+90 ..." data-testid="register-phone-input" className="input" />
        </Field>
        <Field label="PAROLA (en az 6 karakter)">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} data-testid="register-password-input" className="input" />
        </Field>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} data-testid="register-agree-input" className="mt-1 accent-[#D4AF37]" />
          <span className="font-mont text-xs text-cream-200/70 leading-relaxed">
            <Link to="/sozlesme" className="text-gold hover:underline">Mesafeli Satış Sözleşmesi</Link>,{" "}
            <Link to="/gizlilik" className="text-gold hover:underline">Gizlilik Politikası</Link> ve{" "}
            <Link to="/kvkk" className="text-gold hover:underline">KVKK Aydınlatma Metni</Link>'ni okudum, kabul ediyorum.
          </span>
        </label>
        <button type="submit" disabled={busy} data-testid="register-submit-btn" className="btn-gold w-full justify-center">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {busy ? "Hesap oluşturuluyor" : "Hesap Oluştur"}
          <ChevronRight className="w-4 h-4" />
        </button>
      </form>
      <style>{`.input{width:100%;background:#040814;border:1px solid rgba(253,251,247,0.1);padding:0.75rem 1rem;font-family:'Montserrat',sans-serif;font-size:0.875rem;color:#FDFBF7;outline:none;border-radius:2px}.input:focus{border-color:rgba(212,175,55,0.6)}`}</style>
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
