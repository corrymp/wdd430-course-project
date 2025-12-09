"use client";
import { Product } from "@/types/types";
import Image from "next/image";
import { useState, useEffect, useRef } from 'react';

export default function ProductGallery({ product }: { product: Product; }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const totalImages = product.images.length;

  function nextImage() {
    setCurrentIndex((i) => (i + 1) % totalImages);
  }
  function prevImage() {
    setCurrentIndex((i) => (i - 1 + totalImages) % totalImages);
  }

  /* eslint-disable react-hooks/exhaustive-deps*/
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentIndex]);
  /* eslint-enable react-hooks/exhaustive-deps*/

  const currentImage = product.images[currentIndex];

  return (
    <section className="p-gallery" aria-label="Product images">
      <div className="p-image-main" ref={carouselRef}>
        <button aria-label="Previous image" className="p-carousel-btn p-carousel-prev" onClick={prevImage}>‹</button>
        <button aria-label="Next image" className="p-carousel-btn p-carousel-next" onClick={nextImage}>›</button>

        <Image
          src={currentImage.path}
          alt={`${product.name} image ${currentIndex + 1}: ${currentImage.alt_text}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div className="p-thumbs" role="tablist" aria-label="Image thumbnails">
        {product.images.map((img, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className="p-thumb-btn"
          >
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <Image src={img.path} alt={img.alt_text} fill style={{ objectFit: 'cover' }} />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}