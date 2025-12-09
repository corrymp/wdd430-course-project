"use client";

import { useState, useEffect } from "react";
import type { Shop } from "@/types/types";
import Image from "next/image";

function ShopItem({ shop }: { shop: Shop; }) {
  const seller = shop.manager;
  return (
    <div className="product-list-item-card">
      {" "}
      {/* reuse product card */}
      <div className="product-image-wrapper">
        <Image
          className="home-product-image"
          src={shop.banner.path}
          alt={shop.banner.alt_text}
          width={shop.banner.width}
          height={shop.banner.height}
        />
      </div>
      <div className="product-info">
        <p className="home-product-item">{shop.name}</p>
        <p className="home-product-shop">
          by <i>{seller.name}</i>
        </p>
        <p className="home-product-shop">
          joined {seller.join_date.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export default function ShopList({ shops }: { shops: Shop[]; }) {
  const [showAll, setShowAll] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const updateCount = () => {
      const width = window.innerWidth;

      if (width <= 640) return setVisibleCount(3); // mobile
      if (width <= 1024) return setVisibleCount(2); // tablet
      return setVisibleCount(4); // desktop
    };

    updateCount();
    window.addEventListener("resize", updateCount);

    return () => window.removeEventListener("resize", updateCount);
  }, []);

  const visibleSellers = showAll
    ? shops.slice(0, 6)
    : shops.slice(0, visibleCount);

  return (
    <>
      <div className="home-seller-gallery">
        {visibleSellers.map((shop) => (
          <ShopItem shop={shop} key={shop.id} />
        ))}
      </div>

      <div className="seller-toggle-wrapper">
        <button
          className="seller-toggle-btn"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Hide" : "Show More"}
        </button>
      </div>
    </>
  );
}
