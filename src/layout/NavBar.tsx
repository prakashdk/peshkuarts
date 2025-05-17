import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useUser } from "../hooks/useUser";
import { supabase } from "../config/supabaseClient";

export default function Navbar() {
  const user = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [cartCount, setCartCount] = useState(0);

  const toggleMenu = () => setMenuOpen((open) => !open);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left: Logo */}
        <Link to="/" className="text-2xl font-bold text-primary">
          Peshkuarts
        </Link>

        {/* Center: Navigation */}
        <nav className="hidden sm:flex gap-6 font-medium text-gray-600">
          <Link
            to="/"
            className="relative px-1 py-1 hover:text-indigo-600 transition-colors duration-300"
          >
            Home
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-600 transition-all duration-300 hover:w-full"></span>
          </Link>
          <Link
            to="/about"
            className="relative px-1 py-1 hover:text-indigo-600 transition-colors duration-300"
          >
            About
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-600 transition-all duration-300 hover:w-full"></span>
          </Link>
          <Link
            to="/contact"
            className="relative px-1 py-1 hover:text-indigo-600 transition-colors duration-300"
          >
            Contact
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-600 transition-all duration-300 hover:w-full"></span>
          </Link>
        </nav>

        {/* Right: User */}
        {user ? (
          <div className="relative" ref={menuRef}>
            <div className="flex items-center gap-4">
              <Link
                to="/cart"
                className="relative text-gray-600 hover:text-indigo-600 transition"
                aria-label="Cart"
              >
                <FaShoppingCart className="text-2xl" />
                {cartCount > 0 ? (
                  <span className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full text-xs px-1.5">
                    {cartCount}
                  </span>
                ) : (
                  <span className="absolute -top-1 -right-2 bg-red-600 rounded-full w-2 h-2 p-1.5"></span>
                )}
              </Link>

              <button
                onClick={toggleMenu}
                className="flex items-center gap-1 text-primary hover:text-indigo-800 focus:outline-none"
                aria-haspopup="true"
                aria-expanded={menuOpen}
              >
                <FaUserCircle className="text-2xl" title={user.email} />
                {menuOpen ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg text-gray-700 font-medium">
                <Link
                  to="/account"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 hover:bg-indigo-100"
                >
                  View Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-indigo-100"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-indigo-600 text-white px-4 py-1.5 rounded hover:bg-indigo-700 transition"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
