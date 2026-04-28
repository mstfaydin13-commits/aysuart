import React, { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { Search } from "lucide-react";

export default function CitySelect({ value, onChange, dataTestId = "city-select" }) {
  const [cities, setCities] = useState([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    api.get("/cities").then((r) => setCities(r.data.cities || [])).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    const norm = (s) => (s || "")
      .toLocaleLowerCase("tr-TR")
      .replace(/ı/g, "i").replace(/İ/g, "i")
      .replace(/ş/g, "s").replace(/ğ/g, "g")
      .replace(/ü/g, "u").replace(/ö/g, "o").replace(/ç/g, "c");
    const q = norm(query.trim());
    if (!q) return cities.slice(0, 60);
    return cities.filter((c) => norm(c.name).includes(q) || norm(c.country).includes(q)).slice(0, 60);
  }, [query, cities]);

  return (
    <div className="relative">
      <div
        className="flex items-center gap-3 bg-midnight-900 border border-cream-50/10 px-4 py-3 cursor-text rounded-sm focus-within:border-gold/60 transition"
        onClick={() => setOpen(true)}
      >
        <Search className="w-4 h-4 text-cream-200/60" strokeWidth={1.5} />
        <input
          data-testid={`${dataTestId}-input`}
          type="text"
          value={open ? query : value?.name || ""}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Şehir ara (Örn. İstanbul)"
          className="flex-1 bg-transparent outline-none font-mont text-sm text-cream-50 placeholder:text-cream-200/40"
        />
      </div>
      {open && (
        <div
          data-testid={`${dataTestId}-list`}
          className="absolute z-30 mt-1 w-full max-h-64 overflow-y-auto bg-midnight-900 border border-cream-50/10 shadow-xl rounded-sm"
        >
          {filtered.length === 0 ? (
            <div className="px-4 py-3 font-mont text-xs text-cream-200/60">Sonuç yok</div>
          ) : (
            filtered.map((c) => (
              <button
                type="button"
                key={`${c.name}-${c.lat}`}
                data-testid={`city-option-${c.name}`}
                onClick={() => {
                  onChange?.(c);
                  setOpen(false);
                  setQuery("");
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-midnight-800 flex items-center justify-between gap-3"
              >
                <span className="font-mont text-sm text-cream-50">{c.name}</span>
                <span className="font-mont text-[10px] tracking-widest text-cream-200/50">{c.country}</span>
              </button>
            ))
          )}
        </div>
      )}
      {open && (
        <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}
