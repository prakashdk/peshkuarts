import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./layout/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import CheckoutBase from "./layout/checkout/CheckoutBase";

function App() {
  const location = useLocation();
  const hideNavbarOn = ["/login", "/signup"];
  const shouldShowNavbar = !hideNavbarOn.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<CheckoutBase />} />
      </Routes>
    </>
  );
}

export default App;
