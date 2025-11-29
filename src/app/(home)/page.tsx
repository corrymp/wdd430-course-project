// styles
import styles from "@/app/page.module.css";
import '@/app/(home)/home.css';

// types and data
import { Product, Shop } from "@/app/lib/types";
import { fetchShops, fetchProducts } from "@/app/lib/data";

// components
import SellerList from "@/app/(home)/seller-list";
import ProductList from "@/app/(home)/product-list";

export default async function Home() {
  const products: Product[] = await fetchProducts();
  const sellers: Shop[] = await fetchShops();
  return (
    <div className={`${styles.page} home`}>
      <main className={styles.main}>
        <ProductList products={products} />
        <SellerList sellers={sellers} />
      </main>
    </div>
  );
}
