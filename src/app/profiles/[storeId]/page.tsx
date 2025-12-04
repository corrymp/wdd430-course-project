import { Metadata } from 'next';
import Image from 'next/image';
import ProductCard from '@/app/profiles/[storeId]/components/ProductCard';
import styles from '@/app/profiles/[storeId]/page.module.css';
import '@/app/profiles/[storeId]/styles/globals.css';

import { Shop, Product } from '@/types/types';
import { fetchProductsOfShopById, fetchReviewsOfSeller, fetchShopById } from '@/app/lib/data';
import { dateFrom } from '@/app/lib/utils';
import Link from 'next/link';

// const shop: Shop = {
//   name: 'Nico Artisan',
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
  console.log('metadata', _params, id);
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
  const reviews = await fetchReviewsOfSeller(id);
  const seller = shop.manager;
  return (
    <div className={styles.container}>
      {/* Seller Info */}
      <section className={styles.sellerInfo}>
        <Image src={seller.pfp.path} alt={seller.pfp.alt_text} className={styles.sellerAvatar} width={120} height={120} />
        <div>
          <h1>{shop.name}</h1>
          <p>Artisan specializing in handmade crafts.</p>
        </div>
      </section>

      {/* Product List */}
      <section className={styles.productList}>
        <h2>Products</h2>
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Reviews & Comments */}
      <section className={styles.reviews}>
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