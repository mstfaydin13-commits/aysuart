import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Star, User as UserIcon, LogIn } from "lucide-react";
import { useAuth } from "../lib/auth";

const navItems = [
  { to: "/", label: "Anasayfa" },
  { to: "/customize", label: "Tasarla" },
  { to: "/gallery", label: "Galeri" },
  { to: "/about", label: "Hikaye" },
  { to: "/faq", label: "SSS" },
];

export default function Layout() {
  return (
    <div className="App min-h-screen flex flex-col bg-midnight-950 text-cream-50">
      <Header />
      <main className="flex-1 relative">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  const auth = useAuth?.() || {};
  const user = auth.user;
  return (
    <header data-testid="site-header" className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between gap-4">
        <Link to="/" data-testid="brand-logo" className="flex items-center gap-3 group">
          <span className="w-9 h-9 rounded-full border border-gold/60 flex items-center justify-center group-hover:bg-gold/10 transition">
            <Star className="w-4 h-4 text-gold" strokeWidth={1.5} />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-xl tracking-wider">Aysu Art</span>
            <span className="block font-cinzel text-[10px] text-cream-200/80">YILDIZ HARİTASI ATÖLYESİ</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.to === "/"}
              data-testid={`nav-${it.to.replace("/", "") || "home"}`}
              className={({ isActive }) =>
                `px-3 py-2 font-mont text-[12px] uppercase tracking-[0.2em] transition border-b ${
                  isActive ? "text-gold border-gold" : "text-cream-50/80 border-transparent hover:text-gold"
                }`
              }
            >
              {it.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user && user.role === "customer" ? (
            <Link to="/account" data-testid="header-account-link" className="hidden sm:inline-flex items-center gap-2 px-3 py-2 font-mont text-[11px] uppercase tracking-[0.2em] text-cream-50/85 hover:text-gold transition">
              <UserIcon className="w-4 h-4" /> Hesabım
            </Link>
          ) : user && user.role === "admin" ? (
            <Link to="/admin" data-testid="header-admin-link" className="hidden sm:inline-flex items-center gap-2 px-3 py-2 font-mont text-[11px] uppercase tracking-[0.2em] text-gold transition">
              Yönetim
            </Link>
          ) : (
            <Link to="/login" data-testid="header-login-link" className="hidden sm:inline-flex items-center gap-2 px-3 py-2 font-mont text-[11px] uppercase tracking-[0.2em] text-cream-50/85 hover:text-gold transition">
              <LogIn className="w-4 h-4" /> Giriş
            </Link>
          )}
          <Link to="/customize" data-testid="header-cta" className="btn-gold hidden sm:inline-flex">
            Tablonu Tasarla
          </Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="relative mt-24 border-t border-cream-50/10">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="font-display text-2xl">Aysu Art</div>
          <div className="font-cinzel text-[10px] text-cream-200/70 mt-2">UNUTULMAZ ANILAR · YILDIZLARIN ALTINDA</div>
          <p className="font-mont text-sm text-cream-200/80 mt-6 max-w-md leading-relaxed">
            O özel anın gökyüzünü, fotoğrafınızı ve müziğinizi tek bir sanat eserinde buluşturuyoruz. 15×20 cm
            masaüstü premium pleksi, el işçiliğiyle üretilir.
          </p>
        </div>
        <div>
          <h4 className="font-cinzel text-[11px] tracking-[0.25em] text-gold">KEŞFET</h4>
          <ul className="mt-4 space-y-2 font-mont text-sm text-cream-200/80">
            <li><Link to="/customize" className="hover:text-gold">Tablonu Tasarla</Link></li>
            <li><Link to="/gallery" className="hover:text-gold">Galeri</Link></li>
            <li><Link to="/about" className="hover:text-gold">Hikayemiz</Link></li>
            <li><Link to="/faq" className="hover:text-gold">SSS</Link></li>
            <li><Link to="/login" className="hover:text-gold">Hesabım</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-cinzel text-[11px] tracking-[0.25em] text-gold">YASAL</h4>
          <ul className="mt-4 space-y-2 font-mont text-sm text-cream-200/80">
            <li><Link to="/sozlesme" className="hover:text-gold">Mesafeli Satış Sözleşmesi</Link></li>
            <li><Link to="/gizlilik" className="hover:text-gold">Gizlilik Politikası</Link></li>
            <li><Link to="/iade" className="hover:text-gold">İptal & İade</Link></li>
            <li><Link to="/kvkk" className="hover:text-gold">KVKK Aydınlatma</Link></li>
          </ul>
          <h4 className="mt-6 font-cinzel text-[11px] tracking-[0.25em] text-gold">İLETİŞİM</h4>
          <ul className="mt-3 space-y-1 font-mont text-sm text-cream-200/80">
            <li>info@aysuart.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream-50/10 py-5 text-center font-mont text-[11px] tracking-widest text-cream-200/50">
        © {new Date().getFullYear()} AYSU ART · TÜM HAKLARI SAKLIDIR
      </div>
    </footer>
  );
}
