import { Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
// import Katalog from "../pages/Katalog";
// import Merek from "../pages/Merek";
// import Promo from "../pages/Promo";
// import Kontak from "../pages/Kontak";
// import Keranjang from "../pages/Keranjang";
// import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        {/* <Route path="katalog" element={<Katalog />} />
        <Route path="katalog/:kategori" element={<Katalog />} />
        <Route path="merek" element={<Merek />} />
        <Route path="promo" element={<Promo />} />
        <Route path="kontak" element={<Kontak />} />
        <Route path="keranjang" element={<Keranjang />} />
        <Route path="*" element={<NotFound />} /> */}
      </Route>
    </Routes>
  );
}