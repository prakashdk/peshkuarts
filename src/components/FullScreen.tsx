import { useState, useRef, useEffect, type ReactNode } from "react";
import { FiMaximize, FiX } from "react-icons/fi";

interface FullscreenImageWrapperProps {
  children: ReactNode;
  imageUrl: string;
}

export default function FullscreenImageWrapper({
  children,
  imageUrl,
}: FullscreenImageWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      {children}

      {/* Fullscreen Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow transition"
      >
        <FiMaximize className="text-xl text-gray-700" />
      </button>

      {/* Fullscreen Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div ref={modalRef} className="relative max-w-5xl w-full p-4">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              <FiX />
            </button>
            <img
              src={imageUrl}
              alt="Fullscreen"
              className="w-full h-auto max-h-[90vh] object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
