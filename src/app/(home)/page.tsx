import styles from "@/app/page.module.css";
import '@/app/(home)/home.css';

// data
import { Product, Seller } from "@/app/lib/types";
import { mockSellerList, mockProductsList } from "@/app/lib/mock-data";

// components
import Hero from "./hero";
import FeaturedProducts from "./FeaturedProducts";
import FeaturedSellers from "./FeaturedSellers";
import Categories from "./Categories";

export default function Home() {
  const products: Product[] = mockProductsList();
  const sellers: Seller[] = mockSellerList();

  return (
    <div className={`home-page`}>
      <Hero />
      <main className={``}>
        <FeaturedProducts products={products} />
        <FeaturedSellers sellers={sellers} />
        <Categories />
      </main>
    </div>
  );
}
