import { useState, useRef } from "react";
import { MdOutlineFullscreen } from "react-icons/md";

interface MagnifierProps {
  src: string;
  width?: number;
  height?: number;
  zoom?: number; // zoom factor
}

export default function Magnifier({
  src,
  width = 400,
  height = 600,
  zoom = 2,
}: MagnifierProps) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { left, top, width, height } =
      imgRef.current!.getBoundingClientRect();

    // mouse position relative to the image
    const x = e.pageX - left - window.pageXOffset;
    const y = e.pageY - top - window.pageYOffset;

    setMagnifierPos({
      x: Math.max(0, Math.min(x, width)),
      y: Math.max(0, Math.min(y, height)),
    });
  };

  return (
    <div
      ref={imgRef}
      style={{ width, height }}
      className="relative cursor-crosshair"
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        src={src}
        alt="Product"
        style={{ width, height, objectFit: "contain" }}
        className="block"
        draggable={false}
      />

      {showMagnifier && (
        <div
          className="pointer-events-none absolute border border-gray-300 rounded"
          style={{
            // size of magnifier lens
            width: 150,
            height: 150,
            top: magnifierPos.y - 75,
            left: magnifierPos.x - 75,
            backgroundColor: "white",
            backgroundRepeat: "no-repeat",

            // background image zoomed
            backgroundImage: `url(${src})`,
            backgroundSize: `${width * zoom}px ${height * zoom}px`,

            // background position moves opposite to cursor, multiplied by zoom
            backgroundPositionX: `-${magnifierPos.x * zoom - 75}px`,
            backgroundPositionY: `-${magnifierPos.y * zoom - 75}px`,
          }}
        />
      )}
    </div>
  );
}
