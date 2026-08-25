import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout.tsx";
import { AboutPage } from "./pages/AboutPage.tsx";
import { CartPage } from "./pages/CartPage.tsx";
import { ContactPage } from "./pages/ContactPage.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { NotFoundPage } from "./pages/NotFoundPage.tsx";
import { ProductPage } from "./pages/ProductPage.tsx";
import { ReturnsPage } from "./pages/ReturnsPage.tsx";
import { OrderSuccessPage } from "./pages/OrderSuccessPage.tsx";
import { ShopPage } from "./pages/ShopPage.tsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="product/:slug" element={<ProductPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="order-success" element={<OrderSuccessPage />} />
        <Route path="returns" element={<ReturnsPage />} />
        <Route path="collections/all" element={<Navigate to="/shop" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
