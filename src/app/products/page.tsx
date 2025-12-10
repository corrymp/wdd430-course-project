import { ProductSearchResultProduct, searchProductsAndGetCount } from "@/app/lib/data";
import Pagination from "@/app/ui/pagination";
import TagList from "@/app/ui/tag-list";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Search from "@/app/ui/searchProducts";
import '@/app/ui/search-pages.css';

async function SearchItems({ products }: { products: ProductSearchResultProduct[]; }) {
  return (
    <ul className="search-results products-list">
      {products.map(product => {
        const image = product.images[0];
        return (
          <li className="result-item search-item" key={product.prodId}>
            <Link className="products-link-main search-item-link-main" href={`products/${product.prodId}`}>
              <Image 
                className="products-prod-img search-res-main-img"
                src={image.path} 
                alt={image.alt_text} 
                width={image.width} 
                height={image.height}
              />
              <h3>{product.prodName}</h3>
            </Link>
            <p>
              <Link
                className="products-link-shop"
                href={`profiles/${product.shopId}`}
              >{product.shopName}</Link> |{' '}

              <Link
                className="products-link-prof"
                href={`sellers/${product.managerId}`}
              >{product.managerName}</Link> |{' '}

              <span>{product.location}</span> | {' '}

              <span>${product.price}</span>
            </p>
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
    <section className="search-page">
      <h2>Products</h2>
      <Search placeholder="Search products..." />
      <Suspense fallback={
        <ul className="search-results">
          <li className="search-item" style={{ backgroundColor: '#aaa', width: '100%', height: '100%', margin: '10px 0' }}></li>
          <li className="search-item" style={{ backgroundColor: '#aaa', width: '100%', height: '100%', margin: '10px 0' }}></li>
          <li className="search-item" style={{ backgroundColor: '#aaa', width: '100%', height: '100%', margin: '10px 0' }}></li>
          <li className="search-item" style={{ backgroundColor: '#aaa', width: '100%', height: '100%', margin: '10px 0' }}></li>
          <li className="search-item" style={{ backgroundColor: '#aaa', width: '100%', height: '100%', margin: '10px 0' }}></li>
          <li className="search-item" style={{ backgroundColor: '#aaa', width: '100%', height: '100%', margin: '10px 0' }}></li>
        </ul>
      }>
        <SearchItems products={products} />
      </Suspense>
      <Pagination totalPages={pageCount} />
    </section>
  );
}