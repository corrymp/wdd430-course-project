"use client";

import { PlaceholderImage } from "@/app/lib/mock-data";
import Link from "next/link";
import { Tag } from "@/types/types";
import { SplideSlide } from "@splidejs/react-splide";
import { Splide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import type { Splide as SplideInstance } from "@splidejs/splide";
import { useState } from "react";

export default function CategoryList({categories}: {categories: Tag[]}) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleMove = (_splide: SplideInstance, newIndex: number) => {
    setActiveIndex(newIndex);
  };

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
      {categories.map((cat) => (
        <SplideSlide key={cat.id}>
          <div className="category-card">
            <Link href={`products?query=${cat.title}`}></Link>
            <div className="category-img">
              <PlaceholderImage width={100} height={100} />
            </div>
            <p className="cat-name">{cat.title}</p>
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
    </>
  );
}