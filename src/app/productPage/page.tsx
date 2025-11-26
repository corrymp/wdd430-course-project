"use client"
import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect, useRef, FormEvent } from 'react'
import "../productPage/productPage.css" // adjust path if different

export default function ProductPage({ initialProduct = null }) {
  const mockProduct = {
    id: 'prod-001',
    title: 'Handwoven Rwandan Sisal Basket',
    category: 'Home Decor',
    shortDescription: 'Handwoven sisal basket made with sustainable fibers — perfect for storage and décor.',
    description:
      '\nThis handwoven sisal basket is crafted by experienced artisans using sustainable sisal fibers. Each piece is unique and may vary slightly in color and pattern.\n\nCrafting process: harvested sisal, hand-dyed with natural pigments, woven over several days.\n\nCare: spot clean with a damp cloth; keep dry.\n',
    price: 42.0,
    currency: 'USD',
    images: [
      '/images/Paper Wallmate Craft Ideas_.jpeg',
      '/images/Uncut polki kundan bridal necklace set with backside meenakari work.jpeg',
      '/images/Wooden Personalised Keyrings.jpeg',
      '/images/Nordic Style Green Ceramic Dinnerware Set With Gold Inlay High End Porcelain Steak Plate And Bowl.jpeg'
    ],
    dimensions: '30cm x 25cm',
    weight: '500g',
    materials: ['Sisal', 'Natural dye'],
    productionTime: '3-5 days',
    stock: 12,
    seller: {
      id: 'seller-020',
      name: 'Amina Mukamana',
      avatar: '/images/seller-amina.jpg',
      bio: 'Amina is a sisal-weaving artisan from Northern Province focused on sustainable craft and community upliftment.',
    },
    rating: 4.6,
    reviews: [
      { id: 'r1', user: 'Claire', rating: 5, text: 'Beautiful quality — arrived quickly!' },
      { id: 'r2', user: 'Jon', rating: 4, text: 'Very pretty but a bit smaller than expected.' },
    ],
  }

  const product = initialProduct || mockProduct

  const [currentIndex, setCurrentIndex] = useState(0)
  const totalImages = product.images.length
  const carouselRef = useRef<HTMLDivElement | null>(null)

  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState('')

  const [reviews, setReviews] = useState(product.reviews || [])
  const [newReview, setNewReview] = useState({ rating: 5, text: '' })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [currentIndex])

  function nextImage() {
    setCurrentIndex((i) => (i + 1) % totalImages)
  }
  function prevImage() {
    setCurrentIndex((i) => (i - 1 + totalImages) % totalImages)
  }

  async function handleAddToCart() {
    setAdding(true)
    setMessage('')
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: qty }),
      })
      setMessage('Added to cart')
    } catch (err) {
      console.error(err)
      setMessage('Could not add to cart — try again')
    } finally {
      setAdding(false)
    }
  }

  async function submitReview(e: FormEvent) {
    e.preventDefault()
    if (!newReview.text.trim()) return
    const reviewToAdd = { id: Date.now().toString(), user: 'You', ...newReview }
    try {
      setReviews((r) => [reviewToAdd, ...r])
      setNewReview({ rating: 5, text: '' })
    } catch (err) {
      console.error(err)
    }
  }

  const Star = ({ filled, title = 'star' }: { filled: boolean; title?: string }) => (
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
  )

  const averageRating = () => {
    if (!reviews.length) return product.rating || 0
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    return Math.round((sum / reviews.length) * 10) / 10
  }

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title,
    image: product.images.map((src) => typeof src === 'string' ? src : ''),
    description: product.shortDescription,
    sku: product.id,
    brand: { '@type': 'Person', name: product.seller.name },
    offers: {
      '@type': 'Offer',
      priceCurrency: product.currency,
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: averageRating(), reviewCount: reviews.length },
  }

  return (
    <div className="p-page">
      <Head>
        <title>{product.title} — Handcrafted Haven</title>
        <meta name="description" content={product.shortDescription} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>

      <main className="p-card">
        <div className="p-row">
          {/* Image gallery */}
          <section className="p-gallery" aria-label="Product images">
            <div className="p-image-main" ref={carouselRef}>
              <button aria-label="Previous image" className="p-carousel-btn p-carousel-prev" onClick={prevImage}>‹</button>
              <button aria-label="Next image" className="p-carousel-btn p-carousel-next" onClick={nextImage}>›</button>

              {/* main image uses next/image fill + css object-fit via className */}
              <Image
                src={product.images[currentIndex]}
                alt={`${product.title} image ${currentIndex + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                style={{ objectFit: 'cover' }}
              />
            </div>

            <div className="p-thumbs" role="tablist" aria-label="Image thumbnails">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-selected={currentIndex === i}
                  className="p-thumb-btn"
                >
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <Image src={src} alt={`${product.title} thumbnail ${i + 1}`} fill style={{ objectFit: 'cover' }} />
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Product details */}
          <section className="p-details">
            <h1 className="p-title">{product.title}</h1>

            <div className="p-meta">
              <span className="p-badge">{product.category}</span>

              <div className="p-rating" aria-label={`Average rating ${averageRating()} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} filled={i < Math.round(averageRating())} title={`${i + 1} star`} />
                ))}
                <span style={{ marginLeft: 8, fontSize: 14, color: '#6b7280' }}>{averageRating()} ({reviews.length})</span>
              </div>
            </div>

            <p className="p-short">{product.shortDescription}</p>

            <div className="p-purchase">
              <div>
                <div className="p-price">{product.currency} {product.price.toFixed(2)}</div>
                <div className="p-stock">{product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</div>
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <label htmlFor="quantity" className="sr-only">Quantity</label>
                <input
                  id="quantity"
                  type="number"
                  min={1}
                  max={product.stock}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                  className="p-qty"
                  aria-label="Quantity"
                />

                <button
                  onClick={handleAddToCart}
                  disabled={adding || product.stock === 0}
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
              <ul>
                <li><strong>Dimensions:</strong> {product.dimensions}</li>
                <li><strong>Weight:</strong> {product.weight}</li>
                <li><strong>Materials:</strong> {product.materials.join(', ')}</li>
                <li><strong>Production time:</strong> {product.productionTime}</li>
              </ul>
            </div>

            <div className="p-seller">
              <div className="avatar" style={{ position: 'relative', width: 64, height: 64 }}>
                <Image src={product.seller.avatar} alt={`${product.seller.name} avatar`} fill style={{ objectFit: 'cover', borderRadius: '999px' }} />
              </div>

              <div>
                <div style={{ fontWeight: 600 }}>{product.seller.name}</div>
                <div style={{ color: '#6b7280', fontSize: 14 }}>{product.seller.bio}</div>
                <a href={`/sellers/${product.seller.id}`} style={{ color: '#4f46e5', fontSize: 14, marginTop: 6, display: 'inline-block' }}>View seller profile</a>
              </div>
            </div>
          </section>
        </div>

        {/* Reviews */}
        <section className="p-reviews">
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Reviews</h2>

          <form onSubmit={submitReview} className="p-review-form" style={{ marginTop: 12 }}>
            <div>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview((s) => ({ ...s, rating: Number(e.target.value) }))}
                aria-label="Rating"
                className="p-select"
                style={{ marginBottom: 8 }}
              >
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Good</option>
                <option value={3}>3 - Okay</option>
                <option value={2}>2 - Poor</option>
                <option value={1}>1 - Terrible</option>
              </select>

              <textarea
                value={newReview.text}
                onChange={(e) => setNewReview((s) => ({ ...s, text: e.target.value }))}
                rows={4}
                placeholder="Write your review here..."
                className="p-textarea"
                aria-label="Write your review"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button type="submit" className="p-btn p-btn-primary" style={{ background: '#16a34a' }}>Submit review</button>
              <div style={{ color: '#6b7280', fontSize: 13 }}>Reviews help others discover artisanal makers.</div>
            </div>
          </form>

          <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
            {reviews.length === 0 && <div style={{ color: '#6b7280' }}>No reviews yet.</div>}
            {reviews.map((r) => (
              <article key={r.id} className="p-review">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 600 }}>{r.user}</div>
                  <div style={{ color: '#6b7280', fontSize: 13 }}>{r.rating} / 5</div>
                </div>
                <p style={{ marginTop: 8, color: '#374151' }}>{r.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Related */}
        <section className="p-related">
          <h3 style={{ margin: 0, fontWeight: 600 }}>Related products</h3>
          <div className="p-related-grid" style={{ marginTop: 12 }}>
            <div className="p-related-item">Product A</div>
            <div className="p-related-item">Product B</div>
            <div className="p-related-item">Product C</div>
            <div className="p-related-item">Product D</div>
          </div>
        </section>
      </main>
    </div>
  )
}
