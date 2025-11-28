// styles
import styles from "@/app/page.module.css";
import '@/app/(home)/home.css';

// types and mock data
import { Product, Shop } from "@/app/lib/types";
import { mockSellerList } from "@/app/lib/mock-data";
import { mockProductsList } from "@/app/lib/mock-data";

// components
import SellerList from "@/app/(home)/seller-list";
import ProductList from "@/app/(home)/product-list";

export default function Home() {
  const products: Product[] = mockProductsList();
  const sellers: Shop[] = mockSellerList();
  return (
    <div className={`${styles.page} home`}>
      <main className={styles.main}>
        <ProductList products={products} />
        <SellerList sellers={sellers} />
      </main>
    </div>
  );
}
