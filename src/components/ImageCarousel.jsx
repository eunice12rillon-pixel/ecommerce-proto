import React, { useState, useEffect } from "react";

export default function ImageCarousel({ slides = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="w-full overflow-hidden">
      <div
        className="flex transition-transform duration-1000"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <div key={idx} className="w-full shrink-0 relative">
            <img
              src={slide.image}
              alt={`Slide ${idx}`}
              className="w-full h-64 object-cover"
            />
            {/* Quote overlay */}
            {slide.quote && (
              <div className="absolute bottom-4 left-4 bg-black/50 text-white p-2 rounded">
                {slide.quote}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
