"use client";

import type {
  internalGroqTypeReferenceTo,
  SanityImageCrop,
  SanityImageHotspot,
} from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  images?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
    _key: string;
  }>;
  isStock?: number | undefined;
}

const ImageView = ({ images = [], isStock }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const activeImage = images[activeIndex];
  const hasMultipleImages = images.length > 1;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === "Escape") {
          setIsFullscreen(false);
        } else if (e.key === "ArrowLeft" && hasMultipleImages) {
          navigateImage("prev");
        } else if (e.key === "ArrowRight" && hasMultipleImages) {
          navigateImage("next");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, hasMultipleImages, activeIndex]);

  const navigateImage = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
    setImageLoading(true);
    setImageError(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  if (!images.length) {
    return (
      <div className="w-full md:w-1/2 space-y-4">
        <div className="w-full h-[500px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
          <div className="text-center space-y-2">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="text-gray-500">No hay imágenes disponibles</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full md:w-1/2 space-y-4">
        {/* Main Image Container */}
        <div className="relative group">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImage?._key}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn(
                "relative w-full h-[400px] md:h-[500px] border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm",
                isStock === 0 && "opacity-75"
              )}
            >
              {/* Loading Skeleton */}
              {imageLoading && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                </div>
              )}

              {/* Error State */}
              {imageError && (
                <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-500">
                      Error al cargar imagen
                    </p>
                  </div>
                </div>
              )}

              {/* Main Image */}
              {!imageError && (
                <Image
                  src={urlFor(activeImage).url() || "/placeholder.svg"}
                  alt={`Imagen del producto ${activeIndex + 1}`}
                  fill
                  priority={activeIndex === 0}
                  className={cn(
                    "object-cover transition-transform duration-300",
                    isZoomed
                      ? "scale-150 cursor-zoom-out"
                      : "cursor-zoom-in hover:scale-105"
                  )}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
              )}

              {/* Stock Badge */}
              {isStock !== undefined && (
                <Badge
                  variant={isStock > 0 ? "default" : "destructive"}
                  className="absolute top-4 left-4 z-10"
                >
                  {isStock > 0 ? "En Stock" : "Agotado"}
                </Badge>
              )}

              {/* Navigation Arrows */}
              {hasMultipleImages && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={() => navigateImage("prev")}
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={() => navigateImage("next")}
                    aria-label="Siguiente imagen"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setIsZoomed(!isZoomed)}
                  aria-label={isZoomed ? "Reducir zoom" : "Hacer zoom"}
                >
                  {isZoomed ? (
                    <ZoomOut className="w-4 h-4" />
                  ) : (
                    <ZoomIn className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setIsFullscreen(true)}
                  aria-label="Ver en pantalla completa"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Image Counter */}
              {hasMultipleImages && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm z-10">
                  {activeIndex + 1} / {images.length}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Thumbnail Grid */}
        {hasMultipleImages && (
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {images.map((image, index) => (
              <button
                key={image._key}
                onClick={() => {
                  setActiveIndex(index);
                  setImageLoading(true);
                  setImageError(false);
                }}
                className={cn(
                  "relative aspect-square border-2 rounded-lg overflow-hidden transition-all duration-200",
                  activeIndex === index
                    ? "border-shop_orange ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-gray-300"
                )}
                aria-label={`Ver imagen ${index + 1}`}
              >
                <Image
                  src={urlFor(image).url() || "/placeholder.svg"}
                  alt={`Miniatura ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-200"
                />
                {activeIndex === index && (
                  <div className="absolute inset-0 bg-blue-500/10" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 z-10"
              onClick={() => setIsFullscreen(false)}
              aria-label="Cerrar pantalla completa"
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Navigation in Fullscreen */}
            {hasMultipleImages && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                  onClick={() => navigateImage("prev")}
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
                  onClick={() => navigateImage("next")}
                  aria-label="Siguiente imagen"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}

            {/* Fullscreen Image */}
            <div className="relative max-w-4xl max-h-full">
              <Image
                src={urlFor(activeImage).url() || "/placeholder.svg"}
                alt={`Imagen del producto ${activeIndex + 1} - Vista completa`}
                width={800}
                height={800}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Image Counter in Fullscreen */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 text-black px-4 py-2 rounded-full font-medium">
                {activeIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageView;
