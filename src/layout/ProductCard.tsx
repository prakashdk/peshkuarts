import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCard";
import BuyNow from "./BuyNow";

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
  mrp,
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
        <div className="mb-4 flex items-baseline gap-3">
          <p className="text-gray-400 line-through text-sm">
            ₹{mrp.toFixed(2)}
          </p>
          <p className="text-lg font-semibold text-gray-800">
            ₹{price.toFixed(2)}
          </p>
        </div>
      </Link>

      <div className="flex gap-3">
        <AddToCartButton productId={id} />

        <BuyNow items={[{ productId: id, quantity: 1 }]} />
      </div>
    </div>
  );
}
