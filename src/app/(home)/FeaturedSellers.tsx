import ShopList from "@/app/(home)/seller-list";
import { Shop } from "@/types/types";

export default function FeaturedSellers({ sellers }: { sellers: Shop[]; }) {
  return (
    <section className="featured-section">
      <h2>Featured Sellers</h2>
      <ShopList shops={sellers} />
    </section>
  );
}
