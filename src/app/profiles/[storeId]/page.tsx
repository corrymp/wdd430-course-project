import { Metadata } from 'next';
import Image from 'next/image';
import ProductCard from '@/app/profiles/[storeId]/components/ProductCard';
import styles from '@/app/profiles/[storeId]/page.module.css';
import '@/app/profiles/[storeId]/styles/globals.css';

import { Shop, Product, Review, User } from '@/types/types';
import { fetchProductsOfShopById, fetchReviewsOfSeller, fetchShopById, getTotalSales } from '@/app/lib/data';
import { dateFrom, getTimeBetween, sumRating } from '@/app/lib/utils';
import Link from 'next/link';

// const shop: Shop = {
//   name: 'Nico Artisan',
//   location: 'United States',
//   rating: 4.8,
//   totalReviews: 300,
//   sales: '4.1k',
//   yearsOnPlatform: 1,
//   products: [
//     { id: 1, name: 'Ceramic Jar', price: 350, image: '/images/products/jar.jpg' },
//     { id: 2, name: 'Wooden Spoon', price: 120, image: '/images/products/spoon.jpg' },
//     { id: 3, name: 'Woven Basket', price: 500, image: '/images/products/woven-basket.jpg' },
//   ],
// };

export async function generateMetadata({ params }: {
  params: Promise<{ storeId: string; }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined; }>;
}): Promise<Metadata> {
  const _params = await params;
  const id = _params.storeId;
  const shop: Shop = await fetchShopById(Number(id));
  return {
    title: shop.name,
    description: `${shop.manager.name}'s seller profile`
  };
}

export default async function SellerProfile(props: { params: Promise<{ storeId: string; }>; }) {
  const params = await props.params;
  const id = Number(params.storeId);
  const shop: Shop = await fetchShopById(id);
  const products: Product[] = await fetchProductsOfShopById(id);
  const totalSales = await getTotalSales(id);
  const reviews: Review[] = await fetchReviewsOfSeller(id);
  const seller: User = shop.manager;
  return (
    <div className={styles.container}>
      {/* Seller Info */}
      <section className={styles.sellerInfo}>
        <Image src={seller.pfp.path} alt={seller.pfp.alt_text} className={styles.sellerAvatar} width={120} height={120} />
        <div className={styles.sellerDetails}>
          <div className={styles.sellerHeader}>
            <h1>{seller.name}</h1>
            <span className={styles.verified}>✓</span>
          </div>
          <p className={styles.location}>{shop.location}</p>
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.starIcon}>★</span>
              <span className={styles.statValue}>{sumRating(reviews)}</span>
              <span className={styles.statLabel}>({reviews.length})</span>
            </div>
            <div className={styles.divider}>|</div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{totalSales}</span>
              <span className={styles.statLabel}>sales</span>
            </div>
            <div className={styles.divider}>|</div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{getTimeBetween(seller.join_date)}</span>
              <span className={styles.statLabel}>year</span>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <nav className={styles.nav}>
        <a href="#products" className={styles.navLink}>Items</a>
        <a href="#reviews" className={styles.navLink}>Reviews</a>
      </nav>

      {/* Product List */}
      <section id="products" className={styles.productList}>
        <h2>Products</h2>
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Reviews & Comments */}
      <section id="reviews" className={styles.reviews}>
        <h2>Reviews & Comments</h2>
        <ul className={styles.reviewList}>
          {reviews ? (
            reviews.map(review => (<li key={review.id}>
              <strong>{review.reviewer.name}: </strong>{review.content}<br />
              <small>Review of <Link href={`products/${review.product.id}`}>{review.product.name}</Link> | {dateFrom(review.posted_at)}</small>
            </li>))
          ) : (
            <li>No reviews yet... Be the first?</li>
          )}
        </ul>
      </section>
    </div>
  );
}