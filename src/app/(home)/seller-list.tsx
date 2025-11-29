"use client";

import { useState, useEffect } from "react";
import type { Shop } from "@/app/lib/types";
import Image from "next/image";

function SellerItem({ shop }: { shop: Shop; }) {
  const seller = shop.manager;
  return (
    <div className="product-list-item-card">
      {" "}
      {/* reuse product card */}
      <div className="product-image-wrapper">
        <Image
          className="home-product-image"
          src={seller.shopBanner}
          alt={`shop banner for ${seller.shopName}`}
          width={200}
          height={150}
        />
      </div>
      <div className="product-info">
        <p className="home-product-item">{seller.shopName}</p>
        <p className="home-product-shop">
          by <i>{seller.name}</i>
        </p>
        <p className="home-product-shop">
          joined {seller.joinDate.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export default function SellerList({ sellers }: { sellers: Seller[]; }) {
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
    ? sellers.slice(0, 6)
    : sellers.slice(0, visibleCount);

  return (
    <>
      <div className="home-seller-gallery">
        {visibleSellers.map((seller) => (
          <SellerItem seller={seller} key={seller.id} />
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
