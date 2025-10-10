"use client";

import { TrendingItem } from "@/lib/Trending";
import MediaCard from "../MediaCard";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TrendingCarousel = ({
  trendingItems,
}: {
  trendingItems: TrendingItem[];
}) => {
  console.log("Trending Items in Carousel:", trendingItems);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Responsive cards per view - Updated to show more cards
  const [cardsPerView, setCardsPerView] = useState(6);

  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth;
      if (width < 480) setCardsPerView(2); // Very small screens: 2 cards
      else if (width < 640) setCardsPerView(3); // Small screens: 3 cards
      else if (width < 768) setCardsPerView(4); // Medium screens: 4 cards
      else if (width < 1024) setCardsPerView(5); // Large screens: 5 cards
      else if (width < 1280) setCardsPerView(6); // XL screens: 6 cards
      else if (width < 1536) setCardsPerView(7); // 2XL screens: 7 cards
      else setCardsPerView(6); // 3XL+ screens: 6 cards
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + 1, trendingItems.length - cardsPerView)
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Touch/Mouse drag handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setDragStart(clientX);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = dragStart - clientX;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    const threshold = 100;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        disabled={currentIndex === 0}
        className="absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-3 text-white hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        disabled={currentIndex >= trendingItems.length - cardsPerView}
        className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-3 text-white hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Carousel Track */}
      <div
        ref={carouselRef}
        className="overflow-hidden rounded-2xl pt-4 pb-4"
        onMouseDown={handleMouseDown}
        onMouseMove={isDragging ? handleMouseMove : undefined}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${(currentIndex * 100) / cardsPerView}%)`,
          }}
        >
          {trendingItems.map((item, index) => (
            <MediaCard
              key={item.id}
              item={item}
              index={index}
              currentIndex={currentIndex}
              cardsPerView={cardsPerView}
              isDragging={isDragging}
              dragOffset={dragOffset}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingCarousel;
