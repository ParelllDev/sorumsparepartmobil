import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  // Ganti dengan state/context keranjang yang sebenarnya
  const [cartCount] = useState(0);
  const { pathname } = useLocation();

  // Kembali ke atas setiap pindah halaman
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar cartCount={cartCount} />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <Outlet />
      </main>
    </div>
  );
}