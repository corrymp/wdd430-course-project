import { Id, Review } from "@/types/types";
import ReviewForm from '@/app/ui/product-page/review-form';
import Image from "next/image";

export default function ReviewsSection({ reviews, prodId }: { reviews: Review[]; prodId: Id}) {

  return (
    <section className="p-reviews">
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Reviews</h2>

      <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
        {reviews.length === 0 && <div style={{ color: '#6b7280' }}>No reviews yet.</div>}

        {reviews.map((rev) => (
          <article key={rev.id} className="p-review">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>{rev.title}</div>
              <div style={{ fontWeight: 600 }}>{rev.reviewer.name}</div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>{rev.rating} / 5</div>
            </div>

            <p style={{ marginTop: 8, color: '#374151' }}>{rev.content}</p>
            {rev.images && (
              <div>
                {rev.images.map(image => (<Image key={image.id} src={image.path} alt={image.alt_text} width={image.width} height={image.height} />))}
              </div>
            )}
          </article>
        ))}
      </div>

      <ReviewForm prodId={prodId} />
    </section>
  );
}