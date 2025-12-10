import "@/app/page.module.css";
import '@/app/(home)/home.css';

// types and data
import { Product, Shop } from "@/types/types";
import { fetchShops, fetchProducts } from "@/app/lib/data";

// components
import Hero from "@/app/(home)/hero";
import FeaturedProducts from "@/app/(home)/FeaturedProducts";
import FeaturedSellers from "@/app/(home)/FeaturedSellers";
import Categories from "@/app/(home)/Categories";

export default async function Home() {
  const products: Product[] = await fetchProducts(10);
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
