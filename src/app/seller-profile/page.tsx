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
  products: Product[];
};

const seller: Seller = {
  name: 'Nico Artisan',
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
        <Image src="/images/sellers/avatar.svg" alt="Seller Avatar" className={styles.sellerAvatar} width={120} height={120} />
        <div>
          <h1>{seller.name}</h1>
          <p>Artisan specializing in handmade crafts.</p>
        </div>
      </section>

      {/* Product List */}
      <section className={styles.productList}>
        <h2>Products</h2>
        <div className={styles.grid}>
          {seller.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Reviews & Comments */}
      <section className={styles.reviews}>
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