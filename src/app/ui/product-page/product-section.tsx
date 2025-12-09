import { Product, Review } from "@/types/types";
import ProductGallery from '@/app/ui/product-page/product-gallery';
import ProductDetails from '@/app/ui/product-page/product-details';

export default function ProductSection({ product, reviews }: { product: Product; reviews: Review[]; }) {
  return (
    <div className="p-row">
      <ProductGallery product={product} />
      <ProductDetails product={product} reviews={reviews} />
    </div>
  );
}