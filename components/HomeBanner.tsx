"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Title } from "./ui/Text";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { banner_2 } from "@/images";

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
}

const bannerSlides: BannerSlide[] = [
  {
    id: 1,
    title: "Consigue descuento imperdibles en",
    subtitle: "sección de regalos",
    buttonText: "Comprar ahora",
    buttonLink: "/shop",
    image: banner_2,
    backgroundColor: "bg-shop_light_pink",
    buttonColor: "bg-shop_dark_green/90 hover:bg-shop_dark_green",
  },
  {
    id: 2,
    title: "Nueva colección de jabones",
    subtitle: "artesanales disponible",
    buttonText: "Ver colección",
    buttonLink: "/shop?category=artesanales",
    image: banner_2,
    backgroundColor: "bg-blue-50",
    buttonColor: "bg-blue-600/90 hover:bg-blue-600",
  },
  {
    id: 3,
    title: "Envío gratis en compras",
    subtitle: "superiores a $15.000",
    buttonText: "Aprovecha ahora",
    buttonLink: "/shop",
    image: banner_2,
    backgroundColor: "bg-green-50",
    buttonColor: "bg-green-600/90 hover:bg-green-600",
  },
  {
    id: 4,
    title: "Productos naturales para",
    subtitle: "el cuidado de tu piel",
    buttonText: "Descubrir más",
    buttonLink: "/shop?category=naturales",
    image: banner_2,
    backgroundColor: "bg-amber-50",
    buttonColor: "bg-amber-600/90 hover:bg-amber-600",
  },
];

const HomeBannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isPlaying, isHovered]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length
    );
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // const currentBanner = bannerSlides[currentSlide];

  return (
    <div
      className="relative overflow-hidden rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Carousel Container */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {bannerSlides.map((slide) => (
          <div
            key={slide.id}
            className={`w-full flex-shrink-0 py-16 md:py-0 ${slide.backgroundColor} px-10 lg:px-24 flex items-center justify-between min-h-[300px] md:min-h-[400px]`}
          >
            <div className="space-y-5 flex-1">
              <Title className={slide.textColor || "text-gray-800"}>
                {slide.title}
                {slide.subtitle && (
                  <>
                    <br />
                    {slide.subtitle}
                  </>
                )}
              </Title>
              <Link
                href={slide.buttonLink}
                className={`inline-block ${slide.buttonColor || "bg-shop_dark_green/90 hover:bg-shop_dark_green"} text-white/90 px-5 py-2 text-sm rounded-md font-semibold hover:text-white hoverEffect transition-all duration-300`}
              >
                {slide.buttonText}
              </Link>
            </div>
            <div className="flex-shrink-0">
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={`Banner ${slide.id}`}
                className="hidden md:inline-flex w-96 object-contain"
                priority={slide.id === 1}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white shadow-lg scale-110"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/10">
        <div
          className="h-full bg-white/60 transition-all duration-100 ease-linear"
          style={{
            width:
              isPlaying && !isHovered
                ? `${((currentSlide + 1) / bannerSlides.length) * 100}%`
                : "0%",
          }}
        />
      </div>

      {/* Hover overlay for better UX */}
      <div className="absolute inset-0 group" />
    </div>
  );
};

export default HomeBannerCarousel;
