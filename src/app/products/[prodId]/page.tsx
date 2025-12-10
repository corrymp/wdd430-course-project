import { Metadata } from 'next';
import { Product, Review } from "@/types/types";
import "@/app/products/[prodId]/productPage.css";
import { fetchProductById, fetchReviewsOfProduct } from '@/app/lib/data';
import ReviewsSection from '@/app/ui/product-page/reviews-section';
import ProductSection from '@/app/ui/product-page/product-section';
import RelatedSection from '@/app/products/[prodId]/related-section';

export async function generateMetadata({ params }: { 
  params: Promise<{ prodId: string; }>; 
  searchParams: Promise<{ [key: string]: string | string[] | undefined; }>; 
}): Promise<Metadata> {
  const _params = await params;
  const id = _params.prodId
  const product: Product = await fetchProductById(Number(id));
  return {
    title: product.name,
    description: product.description
  };
}

export default async function ProductPage(props: { params: Promise<{ prodId: string; }>; }) {
  const params = (await props.params);
  const id = Number(params.prodId);
  const product: Product = await fetchProductById(id);
  const reviews: Review[] = await fetchReviewsOfProduct(product.id);

  return (
    <div className="p-page">
      <main className="p-card">
        <ProductSection product={product} reviews={reviews} />
        <ReviewsSection reviews={reviews} prodId={product.id} />
        <RelatedSection tags={product.tags} />
      </main>
    </div>
  );
}
