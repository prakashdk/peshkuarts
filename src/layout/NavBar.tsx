import { Link } from "react-router-dom";
import CartIcon from "./CartIcon";
import Search from "./Search";
import UserMenu from "./UserMenu";

export default function Navbar() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left: Logo */}
        <Link to="/" className="text-2xl font-bold text-primary">
          Peshkuarts
        </Link>

        {/* Center: Navigation */}
        <nav className="hidden sm:flex gap-6 font-medium text-gray-600 items-center">
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
          <Search />
        </nav>

        {/* Right: Cart and User */}
        <div className="flex items-center gap-4">
          <CartIcon />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
