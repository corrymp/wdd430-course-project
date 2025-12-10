import { ShopQueryResult, searchShopAndGetCount } from "@/app/lib/data";
import Pagination from "@/app/ui/pagination";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Search from "@/app/ui/searchShops";
import { date, dateFrom } from "@/app/lib/utils";
import '@/app/ui/search-pages.css';

async function SearchItems({ shops }: { shops: ShopQueryResult[]; }) {
  return (
    <ul className="search-results profiles-list">
      {shops.map(shop => (
        <li className="result-item search-item" key={shop.sellerId}>
          <Link 
            className="profiles-link-main search-item-link-main" 
            href={`profiles/${shop.id}`} 
            style={{
              backgroundImage: `url('${shop.bannerPath}')`
            }}
          >
            <Image
              className="profiles-pfp search-res-main-img"
              src={shop.pfpPath}
              alt={shop.pfpAlt}
              width={shop.pfpWidth}
              height={shop.pfpHeight}
            />
            <h3>{shop.name}</h3>
          </Link>
          <p>
            <Link
              className="profiles-link-shop"
              href={`profiles/${shop.id}`}
            >{shop.name}</Link> |{' '}

            <Link
              className="profiles-link-prof"
              href={`profiles/${shop.sellerId}`}
            >{shop.sellerName}</Link> |{' '}

            <span className="profiles-loc">{shop.location}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}

export default async function Page(props: { searchParams?: Promise<{ query?: string; joinedBefore?: string; joinedAfter?: string; page?: string; }>; }) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';

  // current date and date from before users could have joined when join date not being used to search
  const joinedBefore = dateFrom(searchParams?.joinedBefore) ?? date();
  const joinedAfter = dateFrom(searchParams?.joinedAfter) ?? '2015-09-29';
  const joinedBetween = [joinedAfter, joinedBefore];

  const currentPage = Number(searchParams?.page) || 1;
  const { shops, pageCount } = await searchShopAndGetCount(query, joinedBetween, currentPage);

  return (
    <section className="search-page">
      <h2>Shops</h2>
      <Search placeholder="Search shops..." />
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
        <SearchItems shops={shops} />
      </Suspense>
      <Pagination totalPages={pageCount} />
    </section>
  );
}