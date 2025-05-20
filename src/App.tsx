import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./layout/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import CheckoutBase from "./layout/checkout/CheckoutBase";
import AboutPage from "./layout/About";
import ContactPage from "./layout/Contact";
import ReturnPolicy from "./layout/ReturnPolicy";
import Orders from "./layout/Orders";
import UserProfile from "./layout/UserProfile";
import { useEffect } from "react";
import { useUser } from "./hooks/useUser";
import { useCart } from "./hooks/useCart";
import OrderDetails from "./layout/OrderDetails";

function App() {
  const location = useLocation();
  const hideNavbarOn = ["/login", "/signup"];
  const shouldShowNavbar = !hideNavbarOn.includes(location.pathname);

  const fetchUser = useUser((s) => s.fetchUser);
  const fetchCart = useCart((s) => s.fetchCart);

  useEffect(() => {
    const fetchData = async () => {
      await fetchUser();
      await fetchCart();
    };

    fetchData();
  }, []);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/checkout" element={<CheckoutBase />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/account" element={<UserProfile />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
      </Routes>
    </>
  );
}

export default App;
