import type { Product, Seller } from "@/app/lib/types";
import { mockSeller } from "@/app/lib/mock-data";
import TagList from "@/app/ui/tag-list";
import Image from "next/image";

export default function ProductListItem({ product }: { product: Product }) {
  const seller: Seller = mockSeller(product.sellerId);

  return (
    <div className="product-list-item-card">
      <div className="product-image-wrapper">
        <Image
          className="home-product-image"
          src={product.images[0]}
          alt={product.name}
          width={250}
          height={250}
        />

        {/* Hover CTA */}
        <button className="product-read-more">Read more →</button>
      </div>

      <div className="product-info">
        <div className="product-title-price">
          <p className="home-product-item">{product.name}</p>
          <span className="home-product-price">${product.price}</span>
        </div>

        <p className="home-product-shop">from {seller.shopName}</p>
        <TagList tags={product.tags} limit={2} />
      </div>
    </div>
  );
}
