import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { supabase } from "../config/supabaseClient";
import { useUser } from "../hooks/useUser";

export default function UserMenu() {
  const {user} = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  if (!user) {
    return (
      <Link
        to="/login"
        className="bg-indigo-600 text-white px-4 py-1.5 rounded hover:bg-indigo-700 transition"
      >
        Login
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="flex items-center gap-1 text-primary hover:text-indigo-800 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={menuOpen}
      >
        <FaUserCircle className="text-2xl" title={user.email} />
        {menuOpen ? <FiChevronUp /> : <FiChevronDown />}
      </button>

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
  );
}
