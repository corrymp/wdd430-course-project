"use client";

import { PlaceholderImage } from "@/app/lib/mock-data";
import Link from "next/link";
import { Tag } from "@/types/types";
import { SplideSlide } from "@splidejs/react-splide";
import { Splide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import type { Splide as SplideInstance } from "@splidejs/splide";
import { useState, useMemo } from "react";

export default function CategoryList({ categories }: { categories: Tag[] }) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleMove = (_splide: SplideInstance, newIndex: number) => {
    setActiveIndex(newIndex);
  };

  // Shuffle and pick 6 random categories
  const randomCategories = useMemo(() => {
    const shuffled = [...categories].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  }, [categories]);

  return (
    <>
      <Splide
        options={{
          type: "loop",
          perPage: 5,
          perMove: 1,
          gap: "1rem",
          arrows: false,
          autoplay: true,
          interval: 2500,
          pauseOnHover: true,
          pagination: false,
          breakpoints: {
            1024: { perPage: 3 },
            640: { perPage: 2 },
          },
        }}
        aria-label="Explore Categories"
        onMove={handleMove}
      >
        {randomCategories.map((cat) => (
          <SplideSlide key={cat.id}>
            <div className="category-card">
              <Link
                href={`products?query=${cat.title}`}
                className="category-link"
              >
                <div className="category-img">
                  <PlaceholderImage width={100} height={100} />
                </div>
                <p className="cat-name">{cat.title}</p>
              </Link>
            </div>
          </SplideSlide>
        ))}
      </Splide>

      <div className="cat-pagination">
        {randomCategories.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === activeIndex ? "active" : ""}`}
          />
        ))}
      </div>
    </>
  );
}
