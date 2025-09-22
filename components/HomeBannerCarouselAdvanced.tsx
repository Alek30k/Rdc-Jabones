"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Title } from "./ui/Text";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ShoppingBag,
  Gift,
  Truck,
  Sparkles,
} from "lucide-react";
import { banner_10, banner_2, banner_9 } from "@/images";

interface BannerSlide {
  id: number;
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  image: any;
  backgroundColor: string;
  textColor?: string;
  buttonColor?: string;
  icon?: React.ReactNode;
  badge?: string;
}

const bannerSlides: BannerSlide[] = [
  {
    id: 1,
    title: "Consigue descuento imperdibles en",
    subtitle: "sección de regalos",
    buttonText: "Comprar ahora",
    buttonLink: "/shop",
    image: banner_2,
    backgroundColor: "bg-gradient-to-br from-shop_light_pink to-pink-100",
    buttonColor: "bg-shop_dark_green/90 hover:bg-shop_dark_green",
    icon: <Gift className="w-6 h-6" />,
    badge: "¡Oferta especial!",
  },
  {
    id: 2,
    title: "Nueva colección de jabones",
    subtitle: "artesanales disponible",
    buttonText: "Ver colección",
    buttonLink: "/product/jabon-nutritivo-de-miel",
    image: banner_9,
    backgroundColor: "bg-gradient-to-br from-indigo-50 to-green-100",
    buttonColor: "bg-green-500/90 hover:bg-green-600",
    icon: <Sparkles className="w-6 h-6" />,
    badge: "Nuevo",
  },
  {
    id: 3,
    title: "Envío gratis en compras",
    subtitle: "superiores a $100.000",
    buttonText: "Aprovecha ahora",
    buttonLink: "/shop",
    image: banner_2,
    backgroundColor: "bg-gradient-to-br from-green-50 to-emerald-100",
    buttonColor: "bg-green-600/90 hover:bg-green-600",
    icon: <Truck className="w-6 h-6" />,
    badge: "Envío gratis",
  },
  {
    id: 4,
    title: "Productos naturales para",
    subtitle: "el cuidado de tu piel",
    buttonText: "Descubrir más",
    buttonLink: "/shop?category=naturales",
    image: banner_10,
    backgroundColor: "bg-gradient-to-br from-amber-50 to-orange-100",
    buttonColor: "bg-amber-600/90 hover:bg-amber-600",
    icon: <ShoppingBag className="w-6 h-6" />,
    badge: "100% Natural",
  },
];

const HomeBannerCarouselAdvanced = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  const SLIDE_DURATION = 5000; // 5 seconds per slide

  // Progress bar animation
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const timer = setTimeout(() => {
      setCurrentSlide((current) => (current + 1) % bannerSlides.length);
    }, SLIDE_DURATION);

    return () => clearTimeout(timer);
  }, [currentSlide, isPlaying, isHovered]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentSlide(
      (prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length
    );
    setProgress(0);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    setProgress(0);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      setProgress(0);
    }
  }, [isPlaying]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        goToPrevious();
      } else if (event.key === "ArrowRight") {
        goToNext();
      } else if (event.key === " ") {
        event.preventDefault();
        togglePlayPause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrevious, goToNext, togglePlayPause]);

  const currentBanner = bannerSlides[currentSlide];

  return (
    <div
      className="relative overflow-hidden rounded-lg shadow-xl group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Carousel Container */}
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {bannerSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`min-w-full ${slide.backgroundColor} px-10 lg:px-24 flex items-center justify-between min-h-[300px] md:min-h-[400px] relative overflow-hidden`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12" />
            </div>

            {/* Content */}
            <div className="space-y-6 flex-1 relative z-10">
              {/* Badge */}
              {slide.badge && (
                <div className="inline-flex items-center gap-2 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                  {slide.icon}
                  {slide.badge}
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <Title
                  className={`${slide.textColor || "text-gray-800"} leading-tight`}
                >
                  {slide.title}
                  {slide.subtitle && (
                    <>
                      <br />
                      <span className="text-2xl md:text-3xl font-medium opacity-90 text-shop_dark_green">
                        {slide.subtitle}
                      </span>
                    </>
                  )}
                </Title>
              </div>

              {/* Button */}
              <Link
                href={slide.buttonLink}
                className={`inline-flex items-center gap-2 ${slide.buttonColor || "bg-shop_dark_green/90 hover:bg-shop_dark_green"} text-white px-6 py-3 text-sm rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 transform`}
              >
                {slide.buttonText}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Image */}
            <div className="flex-shrink-0 relative">
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/20 rounded-full blur-3xl transform scale-150" />
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={`Banner ${slide.id}`}
                className="hidden md:inline-flex w-80 object-contain relative z-10 drop-shadow-2xl"
                priority={index === 0}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
        aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </button>

      {/* Slide Indicators */}
      <div className="hidden absolute bottom-6 left-1/2 -translate-x-1/2 md:flex space-x-3 z-20">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative w-12 h-3 rounded-full transition-all duration-300 overflow-hidden ${
              index === currentSlide
                ? "bg-gradient-to-r from-orange-400 to-green-400 shadow-lg scale-110"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Ir al slide ${index + 1}`}
          >
            {index === currentSlide && isPlaying && !isHovered && (
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400"
                style={{
                  width: `${progress}%`,
                  transition: "width 100ms linear",
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-4 left-4 bg-black/20 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {currentSlide + 1} / {bannerSlides.length}
      </div>
    </div>
  );
};

export default HomeBannerCarouselAdvanced;
