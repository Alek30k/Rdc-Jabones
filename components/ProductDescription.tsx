"use client";

import { useState, useRef, useEffect } from "react";
import { PortableText } from "@portabletext/react";
import { ChevronDown } from "lucide-react";
import type { Product } from "@/sanity.types";

interface ProductDescriptionProps {
  product: Product | null | undefined;
  maxLines?: number;
  className?: string;
}

const ProductDescription = ({
  product,
  maxLines = 6,
  className = "",
}: ProductDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const [measurements, setMeasurements] = useState({
    lineHeight: 27,
    collapsedHeight: 0,
    fullHeight: 0,
  });

  // PortableText custom blocks
  const portableTextComponents = {
    block: {
      normal: ({ children }: unknown) => (
        <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
      ),
    },
  };

  useEffect(() => {
    if (textRef.current) {
      const computedStyle = getComputedStyle(textRef.current);
      const lineHeight = Number.parseInt(computedStyle.lineHeight) || 27;
      const collapsedHeight = lineHeight * maxLines;
      const fullHeight = textRef.current.scrollHeight;

      setMeasurements({ lineHeight, collapsedHeight, fullHeight });
      setShowReadMore(fullHeight > collapsedHeight);
    }
  }, [product, maxLines]);

  const toggleExpanded = () => setIsExpanded(!isExpanded);
  const fadeHeight = measurements.lineHeight * 2.5;

  if (!product) {
    return (
      <div
        className={`bg-white p-6 rounded-lg shadow-sm mb-5 border border-gray-200 ${className}`}
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-900 font-inter">
          Descripción
        </h3>
        <p className="text-gray-500 italic">No hay descripción disponible.</p>
      </div>
    );
  }

  const descriptionContent =
    product.richDescription && product.richDescription.length > 0 ? (
      <PortableText
        value={product.richDescription}
        components={portableTextComponents}
      />
    ) : product.description ? (
      product.description
    ) : (
      <p className="text-gray-500 italic">No hay descripción disponible.</p>
    );

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-sm mb-5 border border-gray-200 ${className}`}
    >
      <h3 className="text-xl font-semibold mb-4 text-gray-900 font-inter">
        Descripción
      </h3>

      <div className="relative">
        <div
          ref={textRef}
          className={`whitespace-pre-line font-inter text-xl font-normal leading-[27px] transition-all duration-500 ease-out prose max-w-none ${
            isExpanded ? "max-h-none" : "overflow-hidden"
          }`}
          style={{
            color: "rgba(0,0,0,.55)",
            maxHeight: isExpanded
              ? "none"
              : `${measurements.collapsedHeight}px`,
          }}
        >
          {descriptionContent}
        </div>

        {!isExpanded && showReadMore && (
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{
                height: `${fadeHeight}px`,
                background: `linear-gradient(180deg,
                  hsla(0,0%,100%,0) 0%,
                  hsla(0,0%,100%,1) 100%)`,
              }}
            />
          </div>
        )}
      </div>

      {showReadMore && (
        <div className="mt-4 flex justify-start">
          <button
            onClick={toggleExpanded}
            className="group flex items-center gap-1.5 text-blue-500 hover:text-blue-700 text-sm font-medium transition-all duration-300 font-inter hover:bg-blue-50 px-3 py-1.5 rounded-md -ml-3 active:scale-95"
          >
            <span>{isExpanded ? "Ver menos" : "Ver más"}</span>
            <div
              className={`transition-all duration-500 ease-out ${
                isExpanded ? "rotate-180" : "rotate-0"
              } group-hover:scale-110 group-active:scale-90`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDescription;
