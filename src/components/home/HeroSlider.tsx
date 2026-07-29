"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: 1,
    title: "Pure Water, Happy Life",
    subtitle: "Domestic RO Systems from Rs 32,500",
    description: "Advanced 5-stage purification for your home",
    cta: "Shop Now",
    ctaLink: "/categories/domestic-ro-plants",
    bgClass: "ocean-gradient",
  },
  {
    id: 2,
    title: "Industrial RO Solutions",
    subtitle: "Custom-Built for Your Business",
    description: "High-capacity systems for commercial & industrial use",
    cta: "Get Quote",
    ctaLink: "/categories/industrial-ro-plants",
    bgClass: "water-gradient",
  },
  {
    id: 3,
    title: "Flash Sale - Up to 20% Off",
    subtitle: "This Week Only!",
    description: "Premium RO systems, filters, and accessories",
    cta: "View Deals",
    ctaLink: "/flash-sale",
    bgClass: "deal-gradient",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => setCurrent(index);
  const prev = () => setCurrent((current - 1 + slides.length) % slides.length);
  const next = () => setCurrent((current + 1) % slides.length);

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[480px] overflow-hidden rounded-2xl lg:rounded-3xl">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-all duration-700 ease-in-out",
            slide.bgClass,
            index === current ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
          )}
        >
          {/* Bubble effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/10"
                style={{
                  width: `${20 + Math.random() * 40}px`,
                  height: `${20 + Math.random() * 40}px`,
                  left: `${Math.random() * 100}%`,
                  bottom: "-50px",
                  animation: `bubble ${6 + Math.random() * 6}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center px-6 sm:px-12 lg:px-16">
            <div className="max-w-lg text-white">
              <p className="text-sm sm:text-base font-medium text-white/80 mb-2">
                {slide.subtitle}
              </p>
              <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
                {slide.title}
              </h2>
              <p className="text-white/70 text-sm sm:text-base mb-6 hidden sm:block">
                {slide.description}
              </p>
              <Link
                href={slide.ctaLink}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[var(--color-primary)] font-semibold rounded-full hover:scale-105 transition-transform shadow-lg"
              >
                {slide.cta}
                <ChevronRight size={18} />
              </Link>
            </div>

            {/* Decorative water drop */}
            <div className="hidden lg:flex absolute right-16 top-1/2 -translate-y-1/2 w-48 h-48 items-center justify-center">
              <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                <Droplets size={80} className="text-white/60" />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === current ? "w-8 bg-white" : "w-2 bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}
