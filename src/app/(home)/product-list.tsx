import type { Product, Seller } from "@/app/lib/types";
import { mockSeller } from "@/app/lib/mock-data";
import Gallery from "@/app/ui/gallery";
import TagList from "@/app/ui/tag-list";
import Image from "next/image";

function ProductListItem({ product }: { product: Product; }) {
  const seller: Seller = mockSeller(product.sellerId);
  return (
    <>
      <Image
        className="home-product-image"
        src={product.images[0]}
        alt={`${product.name}`}
        width={200}
        height={200}
      />
      <p className="home-product-item">
        {product.name}
        <i>${product.price}</i>
      </p>
      <p className="home-product-shop">from <i>{seller.shopName}</i></p>
      <TagList tags={product.tags} limit={2} />
    </>
  );
}

export default function ProductList({ products }: { products: Product[]; }) {
  return (
    <Gallery
      show="3"
      classes="home-product-gallery"
      items={products.map(product => (
        <ProductListItem product={product} key={product.id} />
      ))}
    />
  );
}
