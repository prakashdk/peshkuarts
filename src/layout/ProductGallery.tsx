import { useState } from "react";
import "yet-another-react-lightbox/styles.css";
import Magnifier from "../components/Magnifier";
import FullscreenImageWrapper from "../components/FullScreen";

export default function ProductGallery({ product }: { product: any }) {
  const [mainImage, setMainImage] = useState(product.image_urls?.[0]);

  if (!mainImage) return null;

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[600px]">
        {product.image_urls.map((url: string, idx: number) => (
          <img
            key={idx}
            src={url}
            alt={`Thumbnail ${idx + 1}`}
            onClick={() => {
              setMainImage(url);
            }}
            className={`w-20 h-20 object-cover border rounded cursor-pointer ${
              url === mainImage ? "vring-2 vring-indigo-500" : "opacity-80"
            }`}
          />
        ))}
      </div>

      {/* Main Image */}
      <div className="bg-white shadow-md rounded p-4 flex items-center justify-center flex-1">
        <FullscreenImageWrapper imageUrl={mainImage}>
          <Magnifier src={mainImage} width={400} height={400} zoom={4} />
        </FullscreenImageWrapper>
      </div>
    </div>
  );
}
