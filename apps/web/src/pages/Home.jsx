import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../data/navlinks";

/* Isi dengan path gambar hero (mis. "/images/hero-parts.png") jika sudah ada.
   Kalau null, ditampilkan ilustrasi dekoratif sebagai pengganti. */
const HERO_IMAGE = "/bg.png";

const BRANDS = ["Toyota", "Honda", "Mitsubishi", "Suzuki", "Daihatsu"];

const TRUST = [
  { icon: "shield", title: "100% Original", text: "Jaminan keaslian produk" },
  { icon: "truck", title: "Garansi Resmi", text: "Produk bergaransi resmi" },
  { icon: "bolt", title: "Pengiriman Cepat", text: "Seluruh Indonesia" },
];

const ICONS = {
  shield: (
    <>
      <path d="M12 3 5 6v5.5c0 4.2 2.9 7.8 7 9 4.1-1.2 7-4.8 7-9V6l-7-3z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  ),
  bolt: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m13 6-4.5 7H12l-1 5 4.5-7H12l1-5z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" />
    </>
  ),
  chart: <path d="M6 20v-6M12 20V6M18 20v-9" />,
  oil: (
    <>
      <path d="M7 8h10v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8zM9 4h6v4H9z" />
      <path d="M7 13h10" />
    </>
  ),
  brake: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 4v3M12 17v3M4 12h3M17 12h3" />
    </>
  ),
};

function Icon({ name, className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
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

/* ---------- ANIMASI ---------- */

const HIDDEN = {
  up: "translate-y-6 opacity-0",
  left: "-translate-x-6 opacity-0",
  right: "translate-x-6 opacity-0",
  zoom: "scale-95 opacity-0",
};
const SHOWN = "translate-x-0 translate-y-0 scale-100 opacity-100";

/* Muncul (fade + geser) saat elemen masuk layar. Hanya sekali. */
function Reveal({
  as: Tag = "div",
  from = "up",
  delay = 0,
  className = "",
  children,
  ...rest
}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-700 ease-out motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none ${
        shown ? SHOWN : HIDDEN[from]
      } ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* Angka berhitung naik dari 0 */
function CountUp({ to, duration = 1600, startDelay = 0, suffix = "" }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setVal(to);
      return;
    }
    let raf;
    const timer = setTimeout(() => {
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(to * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, startDelay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [to, duration, startDelay]);

  return (
    <>
      {val.toLocaleString("id-ID")}
      {suffix}
    </>
  );
}

/* ---------- KOMPONEN ---------- */

function Eyebrow({ children, dark = false }) {
  return (
    <p
      className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] ${
        dark ? "text-slate-300" : "text-slate-600"
      }`}
    >
      <span className="h-0.5 w-6 rounded-full bg-red-500" />
      {children}
    </p>
  );
}

function GlassCard({ className = "", children }) {
  return (
    <div
      className={`rounded-2xl border border-white/15 bg-white/10 p-4 text-white shadow-xl shadow-black/30 backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflowX;
    document.body.style.overflowX = "clip";
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => {
      document.body.style.overflowX = prev;
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div>
      {/* HERO: full-bleed, warna atasnya sama dengan navbar lalu memudar ke maroon gelap.
          Pseudo-element `before` menutup celah padding atas layout supaya menyatu dengan navbar.
          Animasi dipasang di elemen anak (bukan di <section>) karena section sudah memakai translate-x. */}
      <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[#0b0f17] before:absolute before:inset-x-0 before:-top-24 before:h-24 before:bg-[#0b0f17]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {HERO_IMAGE && (
            <img
              src={HERO_IMAGE}
              alt=""
              className={`h-full w-full object-cover object-right transition-transform duration-[2500ms] ease-out motion-reduce:transform-none motion-reduce:transition-none ${
                mounted ? "scale-100" : "scale-110"
              }`}
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0b0f17_0%,rgba(11,15,23,0.92)_35%,rgba(11,15,23,0.4)_60%,transparent_85%)]" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0b0f17] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0b0f17]/80 to-transparent" />

          {/* Glow dekoratif */}
          <div className="absolute -left-20 top-10 h-72 w-72 animate-pulse rounded-full bg-red-600/20 blur-3xl motion-reduce:animate-none" />
        </div>

        <div className="relative mx-auto max-w-[1500px] px-4 pb-12 pt-4 lg:px-8 lg:pb-16 lg:pt-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Reveal delay={100}>
                <Eyebrow dark>Sparepart mobil original &amp; berkualitas</Eyebrow>
              </Reveal>

              <Reveal
                as="h1"
                delay={250}
                className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]"
              >
                Performa Maksimal,
                <span className="block text-red-500">Sparepart Terbaik</span>
              </Reveal>

              {/* Garis aksen yang memanjang */}
              <div
                className={`mt-4 h-1 rounded-full bg-gradient-to-r from-red-600 to-red-400 transition-all delay-500 duration-1000 ease-out motion-reduce:transition-none ${
                  mounted ? "w-20" : "w-0"
                }`}
              />

              <Reveal
                as="p"
                delay={450}
                className="mt-5 max-w-md text-base leading-relaxed text-slate-300"
              >
                Temukan sparepart mobil original dan berkualitas untuk menjaga
                performa kendaraan Anda.
              </Reveal>

              <ul className="mt-8 grid max-w-xl gap-4 sm:grid-cols-3">
                {TRUST.map((t, i) => (
                  <Reveal
                    as="li"
                    key={t.title}
                    delay={650 + i * 120}
                    className="flex items-start gap-3"
                  >
                    <Icon name={t.icon} className="mt-0.5 h-7 w-7 text-white" />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {t.title}
                      </p>
                      <p className="text-xs text-slate-400">{t.text}</p>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>

            {/* Kartu melayang di atas foto latar (disembunyikan di layar kecil) */}
            <div className="relative hidden min-h-[440px] lg:block">
              {!HERO_IMAGE && (
                <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_60%_40%,rgba(239,28,37,0.35),transparent_60%)]">
                  <Icon name="gear" className="h-40 w-40 text-white/15" />
                </div>
              )}

              <Reveal
                from="zoom"
                delay={800}
                className="absolute left-2 top-3 w-52 sm:left-4"
              >
                <GlassCard className="flex items-center gap-3">
                  <Icon name="oil" className="h-9 w-9 text-red-400" />
                  <div>
                    <p className="text-sm font-semibold">Filter Oli</p>
                    <p className="text-[11px] text-slate-300">
                      Original &amp; Berkualitas
                    </p>
                  </div>
                </GlassCard>
              </Reveal>

              <Reveal
                from="zoom"
                delay={950}
                className="absolute right-2 top-20 w-52 sm:right-0"
              >
                <GlassCard className="flex items-center gap-3">
                  <Icon name="brake" className="h-9 w-9 text-red-400" />
                  <div>
                    <p className="text-sm font-semibold">Kampas Rem</p>
                    <p className="text-[11px] text-slate-300">
                      Daya Cengkeram Maksimal
                    </p>
                  </div>
                </GlassCard>
              </Reveal>

              <Reveal
                from="zoom"
                delay={1100}
                className="absolute bottom-3 right-2 w-52 sm:right-0"
              >
                <GlassCard className="flex items-center gap-3">
                  <Icon name="chart" className="h-9 w-9 text-red-400" />
                  <div>
                    <p className="text-sm font-semibold">
                      <CountUp to={10000} startDelay={1100} suffix="+" />
                    </p>
                    <p className="text-[11px] text-slate-300">
                      Produk Tersedia
                    </p>
                  </div>
                </GlassCard>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* MEREK TERPERCAYA */}
      <section className="mt-10 grid items-center gap-6 lg:grid-cols-[auto_1fr_auto]">
        <Reveal from="left">
          <Eyebrow>Merek terpercaya</Eyebrow>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Tersedia untuk Semua Merek Mobil
          </h2>
        </Reveal>

        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 lg:justify-evenly">
          {BRANDS.map((b, i) => (
            <Reveal as="li" key={b} delay={150 + i * 90}>
              <Link
                to={`/katalog?merek=${encodeURIComponent(b.toLowerCase())}`}
                className={`inline-block rounded text-lg font-extrabold uppercase tracking-wide text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:text-red-600 ${focusRing}`}
              >
                {b}
              </Link>
            </Reveal>
          ))}
        </ul>

        <Reveal from="right" delay={300} className="justify-self-start lg:justify-self-end">
          <Link
            to="/merek"
            className={`group flex items-center gap-2 rounded text-sm font-semibold text-red-600 hover:text-red-500 ${focusRing}`}
          >
            Lihat Semua Merek
            <Icon
              name="arrow"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </Reveal>
      </section>

      {/* KATEGORI */}
      <section className="mt-12 pb-10">
        <Reveal>
          <Eyebrow>Kategori sparepart</Eyebrow>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Kategori Sparepart Populer
          </h2>
        </Reveal>

        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {CATEGORIES.map((c, i) => (
            // Animasi di <li>, hover tetap di <Link> supaya transform tidak bentrok
            <Reveal as="li" key={c.slug} delay={(i % 5) * 100}>
              <Link
                to={`/katalog/${c.slug}`}
                className={`group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-red-300 hover:shadow-lg ${focusRing}`}
              >
                <div className="flex h-28 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-50">
                  {c.image ? (
                    <img
                      src={c.image}
                      alt=""
                      className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <Icon
                      name="gear"
                      className="h-12 w-12 text-slate-400 transition-transform duration-500 group-hover:rotate-90"
                    />
                  )}
                </div>
                <div className="mt-4 flex flex-1 items-end justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{c.label}</p>
                    {c.desc && (
                      <p className="mt-0.5 text-xs text-slate-500">{c.desc}</p>
                    )}
                  </div>
                  <Icon
                    name="arrow"
                    className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-red-600"
                  />
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>
    </div>
  );
}