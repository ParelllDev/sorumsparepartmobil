import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { CATEGORIES } from "../data/navlinks";

export default function Home() {
  return (
    <>
      <PageHeader
        title="Sparepart mobil lengkap, siap pasang"
        description="Cari part berdasarkan kategori, kode part, atau tipe mobil kamu."
      />
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Kategori sparepart
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => (
          <li key={c.slug}>
            <Link
              to={`/katalog/${c.slug}`}
              className="block rounded-md border border-slate-200 bg-white px-4 py-4 font-medium text-slate-800 hover:border-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            >
              {c.label}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}