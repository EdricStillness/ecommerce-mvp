"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const heroSlides = [
  {
    title: "Summer Collection 2025",
    subtitle: "Discover the latest trends in fashion",
    cta: "Shop Now",
    gradient: "from-[#d97757] via-[#c76543] to-[#8b7355]",
  },
  {
    title: "Limited Time Offers",
    subtitle: "Up to 50% off on premium items",
    cta: "View Deals",
    gradient: "from-[#8b7355] via-[#a68a6f] to-[#d4a574]",
  },
  {
    title: "New Arrivals",
    subtitle: "Fresh styles curated just for you",
    cta: "Explore Collection",
    gradient: "from-[#c76543] via-[#d4a574] to-[#a68a6f]",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  const slide = heroSlides[currentSlide];

  return (
    <div className="relative overflow-hidden rounded-3xl mb-12 hero-container">
      <div
        className="relative min-h-[500px] md:min-h-[600px]"
        onMouseMove={handleMouseMove}
      >
        {/* Animated gradient background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-all duration-1000 animate-gradient`}
          style={{
            transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px) scale(1.1)`,
            transition: 'transform 0.3s ease-out',
          }}
        />

        {/* Floating shapes for 3D effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="floating-shape shape-1"
            style={{
              transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
            }}
          />
          <div
            className="floating-shape shape-2"
            style={{
              transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`,
            }}
          />
          <div
            className="floating-shape shape-3"
            style={{
              transform: `translate(${mousePosition.x * 40}px, ${mousePosition.y * -30}px)`,
            }}
          />
        </div>

        {/* Glassmorphism content container */}
        <div className="relative z-10 h-full flex items-center justify-center px-6 py-20">
          <div className="glass-panel max-w-4xl w-full text-center space-y-8 animate-slide-in">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white hero-title">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto">
                {slide.subtitle}
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/"
                className="group relative px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl"
              >
                <span className="relative z-10">{slide.cta}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 text-transparent group-hover:text-white transition-colors duration-300">
                  {slide.cta}
                </span>
              </Link>
            </div>

            {/* Stats with 3D cards */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 mt-12 max-w-2xl mx-auto">
              {[
                { value: "500+", label: "Products" },
                { value: "50k+", label: "Customers" },
                { value: "4.9", label: "Rating" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="stat-card group"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="text-2xl md:text-4xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-white/80">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modern slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className="slide-indicator group"
            aria-label={`Go to slide ${idx + 1}`}
          >
            <div
              className={`h-1 rounded-full transition-all duration-500 ${
                idx === currentSlide
                  ? "w-12 bg-white"
                  : "w-8 bg-white/40 group-hover:bg-white/60"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

