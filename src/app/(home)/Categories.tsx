"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import type { Splide as SplideInstance } from "@splidejs/splide";
import { PlaceholderImage } from "@/app/lib/mock-data";
import { useState } from "react";

const categories = [
  { id: 1, name: "Art", image: "/placeholders/art.jpg" },
  { id: 2, name: "Fashion", image: "/placeholders/fashion.jpg" },
  { id: 3, name: "Home Decor", image: "/placeholders/home.jpg" },
  { id: 4, name: "Jewelry", image: "/placeholders/jewelry.jpg" },
  { id: 5, name: "Digital", image: "/placeholders/digital.jpg" },
];

export default function Categories() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleMove = (_splide: SplideInstance, newIndex: number) => {
    setActiveIndex(newIndex);
  };

  return (
    <section className="home-section categories-wrapper">
      <h2>Explore Categories</h2>

      <Splide
        options={{
          type: "loop",
          perPage: 4,
          perMove: 1,
          gap: "1rem",
          arrows: false,
          autoplay: true,
          interval: 2500,
          pauseOnHover: true,
          pagination: false,
          breakpoints: {
            1024: { perPage: 2 },
            640: { perPage: 1 },
          },
        }}
        aria-label="Explore Categories"
        onMove={handleMove}
      >
        {categories.map((cat) => (
          <SplideSlide key={cat.id}>
            <div className="category-card">
              <div className="category-img">
                <PlaceholderImage width={100} height={100} />
              </div>
              <p className="cat-name">{cat.name}</p>
            </div>
          </SplideSlide>
        ))}
      </Splide>

      <div className="cat-pagination">
        {categories.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === activeIndex ? "active" : ""}`}
          />
        ))}
      </div>
    </section>
  );
}
