import { ProductSearchResultProduct, searchProductsAndGetCount } from "@/app/lib/data";
import Pagination from "@/app/ui/pagination";
import TagList from "@/app/ui/tag-list";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Search from "@/app/ui/search";

async function SearchItems({ products }: { products: ProductSearchResultProduct[]; }) {
  return (
    <ul>
      {products.map(product => {
        console.log(product);
        const image = product.images[0];
        return (
          <li key={product.prodId}>
            <Link href={`products/${product.prodId}`}>
              <h3>{product.prodName}</h3>
              <p>${product.price}</p>
              <Image src={image.path} alt={image.alt_text} width={image.width} height={image.height} />
            </Link>
            <p><Link href={`shops/${product.shopId}`}>{product.shopName}</Link> | <Link href={`sellers/${product.managerId}`}>{product.managerName}</Link> | {product.location}</p>
            <TagList tags={product.tags} />
          </li>
        );
      })}
    </ul>
  );
}

export default async function Page(props: { searchParams?: Promise<{ query?: string; priceRangeLo?: number; priceRangeHi?: number; page?: string; }>; }) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const priceRangeLo = searchParams?.priceRangeLo || 0;
  const priceRangeHi = searchParams?.priceRangeHi || 9999;
  const priceRange = [priceRangeLo, priceRangeHi];
  const currentPage = Number(searchParams?.page) || 1;
  const { products, pageCount } = await searchProductsAndGetCount(query, priceRange, currentPage);

  return (
    <>
      <h1>All Products</h1>
      <Search placeholder="Search products..." />
      <Suspense fallback={
        <ul>
          <li style={{ backgroundColor: '#aaa', width: '100%', height: '60px', margin: '10px 0' }}></li>
          <li style={{ backgroundColor: '#aaa', width: '100%', height: '60px', margin: '10px 0' }}></li>
          <li style={{ backgroundColor: '#aaa', width: '100%', height: '60px', margin: '10px 0' }}></li>
          <li style={{ backgroundColor: '#aaa', width: '100%', height: '60px', margin: '10px 0' }}></li>
        </ul>
      }>
        <SearchItems products={products} />
      </Suspense>
      <Pagination totalPages={pageCount} />
    </>
  );
}