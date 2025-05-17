import { FaBolt, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

interface ProductProps {
  id: string;
  title: string;
  thumbnail_url: string;
  price: number;
  mrp: number;
}

export default function ProductCard({
  id,
  title,
  thumbnail_url,
  price,
}: ProductProps) {
  return (
    <div className="border rounded shadow hover:shadow-lg p-4 flex flex-col">
      <Link to={`/product/${id}`} className="block flex-grow">
        <img
          src={thumbnail_url}
          alt={title}
          className="w-full h-80 object-cover rounded mb-2"
        />
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-500 mb-4">₹{price}</p>
      </Link>

      <div className="flex gap-3">
        <button
          className="flex-grow flex items-center justify-center gap-2 bg-primary text-secondary py-2 rounded hover:bg-indigo-700 transition"
          onClick={() => {
            alert(`Added "${title}" to cart`);
          }}
        >
          <FaShoppingCart />
          Add to Cart
        </button>

        <button
          className="flex-grow flex items-center justify-center gap-2 bg-primary text-secondary py-2 rounded hover:bg-green-700 transition"
          onClick={() => {
            alert(`Buying "${title}" now`);
          }}
        >
          <FaBolt />
          Buy Now
        </button>
      </div>
    </div>
  );
}
