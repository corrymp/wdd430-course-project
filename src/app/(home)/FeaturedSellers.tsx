import SellerList from "@/app/(home)/seller-list";
import { Seller } from "@/app/lib/types";

export default function FeaturedSellers({ sellers }: { sellers: Seller[] }) {
  return (
    <section className="featured-section">
      <h2>Featured Sellers</h2>
      <SellerList sellers={sellers} />
    </section>
  );
}
