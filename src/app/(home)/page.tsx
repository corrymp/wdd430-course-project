import styles from "@/app/page.module.css";
import '@/app/(home)/home.css';

// types and data
import { Product, Shop } from "@/app/lib/types";
import { fetchShops, fetchProducts } from "@/app/lib/data";

// components
import Hero from "./hero";
import FeaturedProducts from "./FeaturedProducts";
import FeaturedSellers from "./FeaturedSellers";
import Categories from "./Categories";

export default async function Home() {
  const products: Product[] = await fetchProducts();
  const sellers: Shop[] = await fetchShops();
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
