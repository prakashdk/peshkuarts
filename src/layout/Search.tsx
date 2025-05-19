import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { id: string; title: string; thumbnail_url: string }[]
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  let debounceTimeout: NodeJS.Timeout;

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    // Debounce input to avoid spamming queries
    debounceTimeout = setTimeout(() => {
      fetchResults(query);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [query]);

  async function fetchResults(searchTerm: string) {
    const { data, error } = await supabase
      .from("products")
      .select("id, title, description, price, thumbnail_url")
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .limit(5);

    if (error) {
      console.error("Search error:", error);
      setResults([]);
    } else {
      setResults(data || []);
      setIsOpen(true);
    }
  }

  const handleSelect = (id: string, slug?: string) => {
    setIsOpen(false);
    setQuery("");
    if (slug) {
      navigate(`/product/${slug}`);
    } else {
      navigate(`/product/${id}`);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-64 sm:w-80" ref={wrapperRef}>
      <input
        type="search"
        aria-label="Search products"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.trim() && setIsOpen(true)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition"
      />

      {isOpen && results.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
          {results.map(({ id, title, thumbnail_url }) => (
            <li
              key={id}
              className="cursor-pointer px-4 py-2 hover:bg-indigo-100 flex items-center gap-3"
              onClick={() => handleSelect(id)}
            >
              <img
                src={thumbnail_url}
                alt={title}
                className="w-10 h-10 object-cover rounded"
              />
              <span className="text-sm text-primary font-medium">{title}</span>
            </li>
          ))}
        </ul>
      )}

      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-500">
          No products found.
        </div>
      )}
    </div>
  );
}
