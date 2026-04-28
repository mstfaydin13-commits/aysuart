import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Star } from "lucide-react";

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
  return (
    <header
      data-testid="site-header"
      className="sticky top-0 z-50 glass"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
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
                `px-4 py-2 font-mont text-[12px] uppercase tracking-[0.2em] transition border-b ${
                  isActive ? "text-gold border-gold" : "text-cream-50/80 border-transparent hover:text-gold"
                }`
              }
            >
              {it.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/customize" data-testid="header-cta" className="btn-gold hidden sm:inline-flex">
          Tablonu Tasarla
        </Link>
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
            O özel anın gökyüzünü, fotoğrafınızı ve müziğinizi tek bir sanat eserinde buluşturuyoruz. 30×50 cm
            premium pleksi, el işçiliğiyle üretilir.
          </p>
        </div>
        <div>
          <h4 className="font-cinzel text-[11px] tracking-[0.25em] text-gold">KEŞFET</h4>
          <ul className="mt-4 space-y-2 font-mont text-sm text-cream-200/80">
            <li><Link to="/customize" className="hover:text-gold">Tablonu Tasarla</Link></li>
            <li><Link to="/gallery" className="hover:text-gold">Galeri</Link></li>
            <li><Link to="/about" className="hover:text-gold">Hikayemiz</Link></li>
            <li><Link to="/faq" className="hover:text-gold">SSS</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-cinzel text-[11px] tracking-[0.25em] text-gold">İLETİŞİM</h4>
          <ul className="mt-4 space-y-2 font-mont text-sm text-cream-200/80">
            <li>hello@aysuart.com</li>
            <li>+90 555 000 00 00</li>
            <li>İstanbul · Türkiye</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream-50/10 py-5 text-center font-mont text-[11px] tracking-widest text-cream-200/50">
        © {new Date().getFullYear()} AYSU ART · TÜM HAKLARI SAKLIDIR
      </div>
    </footer>
  );
}
