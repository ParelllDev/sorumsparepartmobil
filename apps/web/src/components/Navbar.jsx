import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { BRAND, CONTACT, NAV_LINKS } from "../data/navlinks";

const ICONS = {
  home: (
    <>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9.5h13V10" />
      <path d="M10 19.5v-5h4v5" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.2" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2" />
    </>
  ),
  box: (
    <>
      <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" />
      <circle cx="12" cy="7.8" r="0.6" fill="currentColor" />
    </>
  ),
  phone: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" />
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  cart: (
    <>
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M3 4h2l2.4 11h11l2-8H6.2" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  car: (
    <>
      <path d="M5 16V12l1.8-4.5A2 2 0 0 1 8.7 6h6.6a2 2 0 0 1 1.9 1.5L19 12v4" />
      <path d="M3.5 12h17M5 16h14v2.5H5z" />
      <circle cx="8" cy="14.2" r="0.6" fill="currentColor" />
      <circle cx="16" cy="14.2" r="0.6" fill="currentColor" />
    </>
  ),
  tag: (
    <>
      <path d="M3.5 12.5V4.5a1 1 0 0 1 1-1h8l8 8a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0l-8.5-7.5z" />
      <circle cx="8" cy="8" r="1.3" />
    </>
  ),
  chevron: <path d="m6 9 6 6 6-6" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
};

// Ikon menu dipilih dari label di NAV_LINKS (atau dari properti `icon` jika ada)
const ICON_BY_LABEL = {
  beranda: "home",
  kategori: "grid",
  katalog: "grid",
  produk: "box",
  "merek mobil": "car",
  "tentang kami": "info",
  kontak: "phone",
};

const iconFor = (link) =>
  link.icon || ICON_BY_LABEL[link.label.toLowerCase()] || "grid";

function Icon({ name, className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500";

/* Logo: huruf S miring dengan garis kecepatan. Ganti dengan <img> logo asli jika ada. */
function Logo() {
  return (
    <Link
      to="/"
      aria-label={`${BRAND.name} - beranda`}
      className={`flex shrink-0 items-center gap-0 rounded ${focusRing}`}
    >
      <svg
        viewBox="0 0 48 48"
        className="h-10 w-12 shrink-0 overflow-visible"
        aria-hidden="true"
      >
   <g fill="#fff" transform="translate(-18 0)">
          <rect x="0" y="16" width="22" height="3" rx="1.5" />
          <rect x="6" y="23" width="18" height="3" rx="1.5" />
        </g>
        <g fill="#ef1c25" transform="translate(-18 0)">
          <rect x="4" y="30" width="16" height="3" rx="1.5" />
        </g>
        <text
          x="2"
          y="54"
          fontSize="80"
          fontWeight="900"
          fontStyle="italic"
          fill="#ef1c25"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          S
        </text>
      </svg>
      <span className="-ml-1.5 leading-none">
        <span className="block whitespace-nowrap text-2xl font-black italic tracking-tight text-white">
          {BRAND.name.toUpperCase()}
        </span>
        <span className="mt-0.5 block whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.4em] text-slate-300">
          {BRAND.tagline || "Sparepart Mobil"}
        </span>
      </span>
    </Link>
  );
}

function SearchForm({ query, setQuery, onSubmit, className = "" }) {
  return (
    <form onSubmit={onSubmit} role="search" className={className}>
      <label htmlFor="cari-sparepart" className="sr-only">
        Cari sparepart
      </label>
      <div className="relative w-full">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-200">
          <Icon name="search" className="h-5 w-5" />
        </span>
        <input
          id="cari-sparepart"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari sparepart, merek, atau kode..."
          className="h-11 w-full rounded-full border border-white/10 bg-white/5 pl-12 pr-4 text-sm text-white placeholder:text-slate-400 focus:border-red-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-500/40"
        />
      </div>
    </form>
  );
}

export default function Navbar({ cartCount = 0 }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileSub, setMobileSub] = useState(false);
  const [query, setQuery] = useState("");
  const desktopNavRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Tutup semua menu setiap pindah halaman
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setMobileSub(false);
  }, [location.pathname, location.search]);

  // Tutup dropdown saat klik di luar, dan semua menu saat tekan Escape
  useEffect(() => {
    const handleClick = (e) => {
      if (desktopNavRef.current && !desktopNavRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/katalog?cari=${encodeURIComponent(q)}`);
  };

  const isKatalogActive = location.pathname.startsWith("/katalog");

  // Gaya item menu desktop: teks putih, aktif merah + garis merah di bawah
  const desktopItem = (active) =>
    `relative flex h-20 items-center gap-2 whitespace-nowrap px-2.5 text-sm font-medium transition-colors xl:px-4 xl:text-[15px] ${
      active ? "text-red-500" : "text-white hover:text-red-400"
    } ${focusRing}`;
  const activeBar = (
    <span className="absolute inset-x-3 bottom-3 h-[3px] rounded-full bg-red-500" />
  );

  const actionClass = `flex flex-col items-center gap-1 whitespace-nowrap px-3 text-xs xl:px-4 font-medium text-white transition-colors hover:text-red-400 ${focusRing}`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0b0f17] shadow-lg shadow-black/30">
      <div className="mx-auto flex h-20 max-w-[1500px] items-center gap-4 px-4 lg:px-8">
        <Logo />

        {/* Menu desktop */}
        <nav
          ref={desktopNavRef}
          aria-label="Navigasi utama"
          className="ml-2 hidden lg:block xl:ml-6"
        >
          <ul className="flex items-center">
            {NAV_LINKS.map((link) => (
              <li key={link.label} className="relative">
                {link.children ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={openDropdown === link.label}
                      aria-haspopup="true"
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === link.label ? null : link.label
                        )
                      }
                      className={desktopItem(isKatalogActive)}
                    >
                      <Icon name={iconFor(link)} className="h-5 w-5" />
                      {link.label}
                      <Icon
                        name="chevron"
                        className={`h-4 w-4 transition-transform ${
                          openDropdown === link.label ? "rotate-180" : ""
                        }`}
                      />
                      {isKatalogActive && activeBar}
                    </button>
                    {openDropdown === link.label && (
                      <ul className="absolute left-0 top-[calc(100%-8px)] w-60 overflow-hidden rounded-xl border border-white/10 bg-[#121722] py-2 shadow-2xl shadow-black/50">
                        {link.children.map((child) => (
                          <li key={child.to}>
                            <NavLink
                              to={child.to}
                              end
                              className={({ isActive }) =>
                                `block px-5 py-2.5 text-sm ${
                                  isActive
                                    ? "bg-red-500/10 font-medium text-red-400"
                                    : "text-slate-200 hover:bg-white/5 hover:text-white"
                                } ${focusRing}`
                              }
                            >
                              {child.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    className={({ isActive }) => desktopItem(isActive)}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon name={iconFor(link)} className="h-5 w-5" />
                        {link.label}
                        {isActive && activeBar}
                      </>
                    )}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Pencarian desktop */}
        <SearchForm
          query={query}
          setQuery={setQuery}
          onSubmit={handleSearch}
          className="ml-auto hidden min-w-[180px] max-w-xl flex-1 lg:block"
        />

        {/* Keranjang + Masuk/Daftar + tombol menu */}
        <div className="ml-auto flex items-center lg:ml-0">
          <div className="hidden items-center lg:flex">
            <span className="mx-2 h-10 w-px bg-white/10" aria-hidden="true" />
            <Link
              to="/keranjang"
              aria-label={`Keranjang, ${cartCount} item`}
              className={actionClass}
            >
              <span className="relative">
                <Icon name="cart" className="h-7 w-7" />
                <span className="absolute -right-2.5 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              </span>
              Keranjang
            </Link>
            <span className="mx-2 h-10 w-px bg-white/10" aria-hidden="true" />
            <Link to="/masuk" className={actionClass}>
              <Icon name="user" className="h-7 w-7" />
              Masuk / Daftar
            </Link>
          </div>

          {/* Mobile: keranjang + hamburger */}
          <div className="flex items-center gap-1 lg:hidden">
            <Link
              to="/keranjang"
              aria-label={`Keranjang, ${cartCount} item`}
              className={`relative flex h-10 w-10 items-center justify-center rounded text-white hover:bg-white/10 ${focusRing}`}
            >
              <Icon name="cart" className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={mobileOpen}
              aria-controls="menu-mobile"
              onClick={() => setMobileOpen((v) => !v)}
              className={`flex h-10 w-10 items-center justify-center rounded text-white hover:bg-white/10 ${focusRing}`}
            >
              <Icon name={mobileOpen ? "close" : "menu"} className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Panel menu mobile */}
      {mobileOpen && (
        <div
          id="menu-mobile"
          className="border-t border-white/10 bg-[#0b0f17] lg:hidden"
        >
          <div className="mx-auto max-w-7xl px-4 py-4">
            <SearchForm
              query={query}
              setQuery={setQuery}
              onSubmit={handleSearch}
              className="mb-3"
            />
            <nav aria-label="Navigasi utama (mobile)">
              <ul className="divide-y divide-white/5">
                {NAV_LINKS.map((link) => (
                  <li key={link.label}>
                    {link.children ? (
                      <>
                        <button
                          type="button"
                          aria-expanded={mobileSub}
                          onClick={() => setMobileSub((v) => !v)}
                          className={`flex w-full items-center gap-3 py-3.5 text-left text-sm font-medium ${
                            isKatalogActive ? "text-red-500" : "text-white"
                          } ${focusRing}`}
                        >
                          <Icon name={iconFor(link)} className="h-5 w-5" />
                          <span className="flex-1">{link.label}</span>
                          <Icon
                            name="chevron"
                            className={`h-4 w-4 transition-transform ${
                              mobileSub ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {mobileSub && (
                          <ul className="mb-2 ml-2 border-l-2 border-red-500 pl-4">
                            {link.children.map((child) => (
                              <li key={child.to}>
                                <NavLink
                                  to={child.to}
                                  end
                                  className={({ isActive }) =>
                                    `block py-2.5 text-sm ${
                                      isActive
                                        ? "font-medium text-red-400"
                                        : "text-slate-300 hover:text-white"
                                    } ${focusRing}`
                                  }
                                >
                                  {child.label}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <NavLink
                        to={link.to}
                        end={link.to === "/"}
                        className={({ isActive }) =>
                          `flex items-center gap-3 py-3.5 text-sm font-medium ${
                            isActive ? "text-red-500" : "text-white"
                          } ${focusRing}`
                        }
                      >
                        <Icon name={iconFor(link)} className="h-5 w-5" />
                        {link.label}
                      </NavLink>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link
                to="/masuk"
                className={`flex items-center justify-center gap-2 rounded-full border border-white/15 py-2.5 text-sm font-semibold text-white hover:bg-white/10 ${focusRing}`}
              >
                <Icon name="user" className="h-4 w-4" />
                Masuk / Daftar
              </Link>
              <a
                href={`tel:${CONTACT.phone.replace(/[^0-9+]/g, "")}`}
                className={`flex items-center justify-center gap-2 rounded-full bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-500 ${focusRing}`}
              >
                <Icon name="phone" className="h-4 w-4" />
                Hubungi
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}