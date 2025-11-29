"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import type { Product } from "@/app/lib/types";
import ProductListItem from "./ProductListItem";

export default function FeaturedProducts({
  products,
}: {
  products: Product[];
}) {
  return (
    <section className="featured-section">
      <h2>Featured Products</h2>

      <Splide
        options={{
          type: "loop", 
          perPage: 4,
          perMove: 1,
          gap: "1rem",
          arrows: true,
          autoplay: true,
          interval: 2500,
          pauseOnHover: true,
          pagination: false,
          breakpoints: {
            1024: { perPage: 3 },
            640: { perPage: 1 },
          },
        }}
        aria-label="Featured Products"
      >
        {products.map((product) => (
          <SplideSlide key={product.id}>
            <ProductListItem product={product} />
          </SplideSlide>
        ))}
      </Splide>
    </section>
  );
}
