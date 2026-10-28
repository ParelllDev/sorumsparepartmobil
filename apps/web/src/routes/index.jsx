import { Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Product from "../pages/Product";
import Contact from "../pages/Contact";
// import Merek from "../pages/Merek";
// import Promo from "../pages/Promo";

// import Keranjang from "../pages/Keranjang";
// import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="produk" element={<Product />} />
        <Route path="kontak" element={<Contact />} />
        {/* <Route path="katalog/:kategori" element={<Katalog />} />
        <Route path="merek" element={<Merek />} />
        <Route path="promo" element={<Promo />} />

        <Route path="keranjang" element={<Keranjang />} />
        <Route path="*" element={<NotFound />} /> */}
      </Route>
    </Routes>
  );
}