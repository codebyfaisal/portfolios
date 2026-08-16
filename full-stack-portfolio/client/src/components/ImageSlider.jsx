import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { cn } from "@/utils/cn";
import { optimizeImage } from "@/utils/imageOptimizer";
import { ServiceIllustration } from "@/features/home/components/previews/Illustrations";
 
const ImageSlider = ({ images = [], title, rounded }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images?.length]);

  if (!images || images.length === 0) {
    return (
      <figure className="relative w-full h-full overflow-hidden group m-0">
        <ServiceIllustration />
        {title && <figcaption className="sr-only">{title}</figcaption>}
      </figure>
    );
  }

  if (images.length === 1) {
    return (
      <figure className="relative w-full h-full overflow-hidden group m-0">
        <img
          src={optimizeImage(images[0], { width: 1200 })}
          alt="Active"
          className="w-full h-full object-cover"
          width="100%"
          height="100%"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent pointer-events-none w-full h-full" />
        {title && <figcaption className="sr-only">{title}</figcaption>}
      </figure>
    );
  }

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = images.length - 1;
      if (nextIndex >= images.length) nextIndex = 0;
      return nextIndex;
    });
  };

  const nextSlide = () => paginate(1);
  const prevSlide = () => paginate(-1);

  return (
    <figure className="relative w-full h-full overflow-hidden group m-0">
      <img
        key={currentIndex}
        src={images[currentIndex]}
        alt={`${title} - Slide ${currentIndex + 1}`}
        className="absolute w-full h-full object-cover"
        width="100%"
        height="100%"
        loading={currentIndex === 0 ? "eager" : "lazy"}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent pointer-events-none w-full h-full" />
      {/* Navigation Arrows */}
      <button
        className={cn(
          "absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 opacity-0 group-hover:opacity-100 transition-all z-10 backdrop-blur-sm",
          rounded,
        )}
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        aria-label="Previous Slide"
        title="Previous Slide"
      >
        <FaChevronLeft />
      </button>
      <button
        className={cn(
          "absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 opacity-0 group-hover:opacity-100 transition-all z-10 backdrop-blur-sm",
          rounded,
        )}
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        aria-label="Next Slide"
        title="Next Slide"
      >
        <FaChevronRight />
      </button>
      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            aria-label={`Go to slide ${idx + 1}`}
            title={`Go to slide ${idx + 1}`}
            className={cn(
              "w-2.5 h-2.5 transition-all backdrop-blur-sm",
              rounded,
              idx === currentIndex
                ? "bg-primary w-6"
                : "bg-primary/50 hover:bg-primary/80",
            )}
          />
        ))}
      </div>
      {title && <figcaption className="sr-only">{title}</figcaption>}
    </figure>
  );
};

export default ImageSlider;
