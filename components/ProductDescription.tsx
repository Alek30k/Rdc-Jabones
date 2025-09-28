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
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          {children}
        </p>
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

  const descriptionContent = (() => {
    if (!product)
      return (
        <p className="text-gray-500 dark:text-gray-400 italic">
          No hay descripción disponible.
        </p>
      );

    if (
      Array.isArray(product.richDescription) &&
      product.richDescription.length > 0
    ) {
      return (
        <PortableText
          value={product.richDescription}
          components={portableTextComponents}
        />
      );
    }

    if (product.description) {
      return (
        <p className="text-gray-700 dark:text-gray-300">
          {product.description}
        </p>
      );
    }

    return (
      <p className="text-gray-500 dark:text-gray-400 italic">
        No hay descripción disponible.
      </p>
    );
  })();

  return (
    <div
      className={`bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 p-6 rounded-lg shadow-sm mb-5 border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <h3 className="text-xl font-semibold mb-4 font-inter">Descripción</h3>

      <div className="relative">
        <div
          ref={textRef}
          className={`whitespace-pre-line font-inter text-xl font-normal leading-[27px] transition-all duration-500 ease-out prose max-w-none ${
            isExpanded ? "max-h-none" : "overflow-hidden"
          }`}
          style={{
            maxHeight: isExpanded
              ? "none"
              : `${measurements.collapsedHeight}px`,
          }}
        >
          {descriptionContent}
        </div>

        {!isExpanded && showReadMore && (
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              height: `${fadeHeight}px`,
              background: `linear-gradient(180deg,
                rgba(255,255,255,0) 0%,
                rgba(255,255,255,1) 100%)`,
            }}
          >
            <div className="dark:hidden" />
            <div
              className="hidden dark:block"
              style={{
                background: `linear-gradient(180deg,
                  rgba(17,24,39,0) 0%,
                  rgba(17,24,39,1) 100%)`,
                height: `${fadeHeight}px`,
              }}
            />
          </div>
        )}
      </div>

      {showReadMore && (
        <div className="mt-4 flex justify-start">
          <button
            onClick={toggleExpanded}
            className="group flex items-center gap-1.5 text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-all duration-300 font-inter hover:bg-blue-50 dark:hover:bg-gray-800 px-3 py-1.5 rounded-md -ml-3 active:scale-95"
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
