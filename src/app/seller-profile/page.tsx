import Image from 'next/image';
import ProductCard from './components/ProductCard';
import styles from './page.module.css';

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

type Seller = {
  name: string;
  location: string;
  rating: number;
  totalReviews: number;
  sales: string;
  yearsOnPlatform: number;
  products: Product[];
};

const seller: Seller = {
  name: 'Nico Artisan',
  location: 'United States',
  rating: 4.8,
  totalReviews: 300,
  sales: '4.1k',
  yearsOnPlatform: 1,
  products: [
    { id: 1, name: 'Ceramic Jar', price: 350, image: '/images/products/jar.jpg' },
    { id: 2, name: 'Wooden Spoon', price: 120, image: '/images/products/spoon.jpg' },
    { id: 3, name: 'Woven Basket', price: 500, image: '/images/products/woven-basket.jpg' },
  ],
};

export default function SellerProfile() {
  return (
    <div className={styles.container}>
      {/* Seller Info */}
      <section className={styles.sellerInfo}>
        <Image src="/images/sellers/avatar.svg" alt="Seller Avatar" className={styles.sellerAvatar} width={80} height={80} />
        <div className={styles.sellerDetails}>
          <div className={styles.sellerHeader}>
            <h1>{seller.name}</h1>
            <span className={styles.verified}>✓</span>
          </div>
          <p className={styles.location}>{seller.location}</p>
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.starIcon}>★</span>
              <span className={styles.statValue}>{seller.rating}</span>
              <span className={styles.statLabel}>({seller.totalReviews})</span>
            </div>
            <div className={styles.divider}>|</div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{seller.sales}</span>
              <span className={styles.statLabel}>sales</span>
            </div>
            <div className={styles.divider}>|</div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{seller.yearsOnPlatform}</span>
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
          {seller.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Reviews & Comments */}
      <section id="reviews" className={styles.reviews}>
        <h2>Reviews & Comments</h2>
        <ul className={styles.reviewList}>
          <li>
            <strong>Jane Doe:</strong> Amazing quality and fast shipping!
          </li>
          <li>
            <strong>John Smith:</strong> Beautiful craftsmanship. Will buy again.
          </li>
        </ul>
        <form className={styles.reviewForm}>
          <input type="text" placeholder="Add your review..." />
          <button type="submit">Submit</button>
        </form>
      </section>
    </div>
  );
}