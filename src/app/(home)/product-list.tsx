import type { Product, Shop } from "@/app/lib/types";
import Gallery from "@/app/ui/gallery";
import TagList from "@/app/ui/tag-list";
import Image from "next/image";
import { mockImage } from "@/app/lib/mock-data";

async function ProductListItem({ product }: { product: Product; }) {
  const shop: Shop = product.shop;
  const image = product.images[0] ?? mockImage();
  return (
    <>
      <Image
        className="home-product-image"
        src={image.path}
        alt={`${product.name}`}
        width={200}
        height={200}
      />
      <p className="home-product-item">
        {product.name}
        <i>${product.price}</i>
      </p>
      <p className="home-product-shop">from <i>{shop.name}</i></p>
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
