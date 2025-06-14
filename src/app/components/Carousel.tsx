"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

interface CarouselProps {
  images: string[];
}

export default function Carousel({ images }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const visibleSlides = 3;

  // Asegurarnos de que siempre haya suficientes imágenes
  const extendedImages = [...images, ...images.slice(0, visibleSlides - 1)];

  useEffect(() => {
    // Inicializar PhotoSwipe Lightbox
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#carousel-gallery",
      children: "a",
      pswpModule: () => import("photoswipe"),
    });
    lightbox.init();

    return () => {
      lightbox.destroy();
    };
  }, []);

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  // Auto-advance slides
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(goToNext, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovered, currentIndex]);

  // Calcular qué imágenes mostrar
  const getVisibleImages = () => {
    const visible = [];
    for (let i = 0; i < visibleSlides; i++) {
      const index = (currentIndex + i) % images.length;
      visible.push(extendedImages[index]);
    }
    return visible;
  };

  return (
    <div
      className="carousel-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="carousel-track" id="carousel-gallery">
        {getVisibleImages().map((src, index) => (
          <a
            key={`${currentIndex}-${index}`}
            href={src}
            data-pswp-width={1200}
            data-pswp-height={800}
            target="_blank"
            rel="noreferrer"
            className="carousel-slide"
          >
            <Image
              src={src}
              alt={`Slide ${currentIndex + index + 1}`}
              width={400}
              height={300}
              className="carousel-image"
              priority={index === 0}
            />
          </a>
        ))}
      </div>

      {/* Navigation arrows */}
      <button onClick={goToPrev} className="carousel-arrow carousel-arrow-prev" aria-label="Previous slide">
        <FaChevronLeft className="carousel-arrow-icon" />
      </button>
      <button onClick={goToNext} className="carousel-arrow carousel-arrow-next" aria-label="Next slide">
        <FaChevronRight className="carousel-arrow-icon" />
      </button>

      {/* Indicators */}
      <div className="carousel-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`carousel-indicator ${index === currentIndex ? "active" : ""}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
