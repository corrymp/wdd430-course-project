import type { Product, Shop } from "@/types/types";
import TagList from "@/app/ui/tag-list";
import Image from "next/image";
import Link from "next/link";

export default function ProductListItem({ product }: { product: Product }) {
  const seller: Shop = product.shop;

  return (
    <div className="product-list-item-card">
      <Link href={`/products/${product.id}`} className="product-link">
        <div className="product-image-wrapper">
          <Image
            className="home-product-image"
            src={product.images[0].path}
            alt={product.name}
            width={250}
            height={250}
            style={{ objectFit: "cover" }}
          />
          <button className="product-read-more">Read more →</button>
        </div>

        <div className="product-info">
          <div className="product-title-price">
            <p className="home-product-item">{product.name}</p>
            <span className="home-product-price">${product.price}</span>
          </div>

          <p className="home-product-shop">from {seller.name}</p>
        </div>
      </Link>
      {/* TagList contains <Link> tags, which can not be nested in other <Link> tags */}
      <TagList tags={product.tags} limit={3} />
    </div>
  );
}
