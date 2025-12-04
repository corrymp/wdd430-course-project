"use client";
import Image from 'next/image';
import { useState } from 'react';
import { Product, Review } from "@/types/types";
import TagList from '@/app/ui/tag-list';

const Star = ({ filled, title = 'star' }: { filled: boolean; title?: string; }) => (
  <svg
    aria-hidden={!title}
    style={{ width: 18, height: 18, display: 'inline-block' }}
    viewBox="0 0 20 20"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
  >
    <title>{title}</title>
    <path
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 1.5l2.6 5.27 5.81.84-4.2 4.09.99 5.78L10 15.77 4.8 17.48l.99-5.78L1.6 7.61l5.81-.84L10 1.5z"
    />
  </svg>
);

const averageRating = (reviews: Review[]): number => {
  if (!reviews.length) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
};

export default function ProductDetails({ product, reviews }: { product: Product; reviews: Review[]; }) {
  const shop = product.shop;
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');
  const rating = averageRating(reviews);

  async function handleAddToCart() {
    setAdding(true);
    setMessage('');
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: qty }),
      });
      setMessage('Added to cart');
    } catch (err) {
      console.error(err);
      setMessage('Could not add to cart — try again');
    } finally {
      setAdding(false);
    }
  }

  return (
    <section className="p-details">
      <h1 className="p-title">{product.name}</h1>

      <div className="p-meta">
        <TagList tags={product.tags} />

        <div className="p-rating" aria-label={`Average rating ${rating} out of 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} filled={i < Math.round(rating)} title={`${i + 1} star`} />
          ))}
          <span style={{ marginLeft: 8, fontSize: 14, color: '#6b7280' }}>{rating} ({reviews.length})</span>
        </div>
      </div>

      <p className="p-short">{product.description}</p>

      <div className="p-purchase">
        <div>
          <div className="p-price">{(product.price)}</div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label htmlFor="quantity" className="sr-only">Quantity</label>
          <input
            id="quantity"
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
            className="p-qty"
            aria-label="Quantity"
          />

          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={`p-btn p-btn-primary`}
          >
            {adding ? 'Adding...' : 'Add to cart'}
          </button>

          <button
            title="Add to wishlist"
            aria-label="Add to wishlist"
            className="p-btn p-btn-ghost"
          >
            ♥
          </button>
        </div>
      </div>

      {message && <p className="p-message">{message}</p>}

      <div className="p-prose">
        <h3>Product details</h3>
        <p className="whitespace-pre-line">{product.description}</p>
      </div>

      <div className="p-seller">
        <div className="avatar" style={{ position: 'relative', width: 64, height: 64 }}>
          <Image src={shop.manager.pfp.path} alt={shop.manager.pfp.alt_text} fill style={{ objectFit: 'cover', borderRadius: '999px' }} />
        </div>

        <div>
          <div style={{ fontWeight: 600 }}>{shop.manager.name}</div>
          <a href={`/sellers/${shop.id}`} style={{ color: '#4f46e5', fontSize: 14, marginTop: 6, display: 'inline-block' }}>View seller profile</a>
        </div>
      </div>
    </section>
  );
}