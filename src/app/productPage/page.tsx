"use client"
import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect, useRef, FormEvent } from 'react'

// HandcraftedHaven Product Page (single-file React component for Next.js + Tailwind)
// - Default export React component
// - Uses Tailwind CSS classes (assumes Tailwind is configured in the project)
// - Mock data included; replace fetch logic with real API calls as needed

export default function ProductPage({ initialProduct = null }) {
  // Mock product (used when no initialProduct prop is provided)
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
      '/images/14 Documentary Maker Photos & High Res Pictures.jpeg',
      '/images/Warli Handpainted Terracotta Clay Kullad Tea Cups….jpeg',
      '/images/Paper Wallmate Craft Ideas_.jpeg',
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
  const carouselRef = useRef(null)

  
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
      // Replace with POST to /api/reviews
      // const res = await fetch(`/api/products/${product.id}/reviews`, ...)
      setReviews((r) => [reviewToAdd, ...r])
      setNewReview({ rating: 5, text: '' })
    } catch (err) {
      console.error(err)
    }
  }

  // Accessibility helpers: star rating SVG
  const Star = ({ filled, title = 'star' }: { filled: boolean; title?: string }) => (
    <svg
      aria-hidden={!title}
      className="w-5 h-5 inline-block"
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

  // JSON-LD structured data (product) for SEO
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title,
    image: product.images.map((src) => typeof src === 'string' ? src : ''),
    description: product.shortDescription,
    sku: product.id,
    brand: {
      '@type': 'Person',
      name: product.seller.name,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: product.currency,
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: averageRating(),
      reviewCount: reviews.length,
    },
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Head>
        <title>{product.title} — Handcrafted Haven</title>
        <meta name="description" content={product.shortDescription} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>

      <main className="max-w-6xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="md:flex">
          {/* Image gallery */}
          <section className="md:w-1/2 p-4" aria-label="Product images">
            <div className="relative rounded-md overflow-hidden" ref={carouselRef}>
              <button
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-sm focus:outline-none"
                onClick={prevImage}
              >
                ‹
              </button>

              <button
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-sm focus:outline-none"
                onClick={nextImage}
              >
                ›
              </button>

              <div className="relative w-full h-[350px] md:h-[450px] bg-gray-100 rounded-md overflow-hidden">

                {/* Using next/image; in local dev ensure the images exist under /public/images */}
                <Image
                  src={product.images[currentIndex]}
                  alt={`${product.title} image ${currentIndex + 1}`}
                  fill
                  objectFit="cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>

            <div className="mt-3 flex gap-2" role="tablist" aria-label="Image thumbnails">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-selected={currentIndex === i}
                  className={`w-20 h-20 rounded-md overflow-hidden border ${currentIndex === i ? 'ring-2 ring-offset-2 ring-indigo-300' : 'border-gray-200'}`}
                >
                  <Image src={src} alt={`${product.title} thumbnail ${i + 1}`} layout="fill" objectFit="cover" />
                </button>
              ))}
            </div>
          </section>

          {/* Product details */}
          <section className="md:w-1/2 p-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">{product.title}</h1>
            <div className="mt-2 flex items-center gap-3">
              <span className="inline-block bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-sm">{product.category}</span>
              <div className="flex items-center gap-1" aria-label={`Average rating ${averageRating()} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} filled={i < Math.round(averageRating())} title={`${i + 1} star`} />
                ))}
                <span className="ml-2 text-sm text-gray-600">{averageRating()} ({reviews.length})</span>
              </div>
            </div>

            <p className="mt-4 text-gray-700 whitespace-pre-line">{product.shortDescription}</p>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <div>
                <div className="text-3xl font-bold">{product.currency} {product.price.toFixed(2)}</div>
                <div className="text-sm text-gray-500">{product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</div>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="quantity" className="sr-only">Quantity</label>
                <input
                  id="quantity"
                  type="number"
                  min={1}
                  max={product.stock}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                  className="w-20 border rounded p-2 text-center"
                  aria-label="Quantity"
                />

                <button
                  onClick={handleAddToCart}
                  disabled={adding || product.stock === 0}
                  className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50"
                >
                  {adding ? 'Adding...' : 'Add to cart'}
                </button>

                <button
                  title="Add to wishlist"
                  aria-label="Add to wishlist"
                  className="px-3 py-2 border rounded text-gray-700 bg-white"
                >
                  ♥
                </button>
              </div>
            </div>

            {message && <p className="mt-2 text-sm text-green-700">{message}</p>}

            <hr className="my-6" />

            <div className="prose max-w-none text-gray-800">
              <h3>Product details</h3>
              <p className="whitespace-pre-line">{product.description}</p>
              <ul>
                <li><strong>Dimensions:</strong> {product.dimensions}</li>
                <li><strong>Weight:</strong> {product.weight}</li>
                <li><strong>Materials:</strong> {product.materials.join(', ')}</li>
                <li><strong>Production time:</strong> {product.productionTime}</li>
              </ul>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <Image src={product.seller.avatar} alt={`${product.seller.name} avatar`} width={64} height={64} className="rounded-full" />
              <div>
                <div className="font-semibold">{product.seller.name}</div>
                <div className="text-sm text-gray-600">{product.seller.bio}</div>
                <a href={`/sellers/${product.seller.id}`} className="text-indigo-600 text-sm mt-1 inline-block">View seller profile</a>
              </div>
            </div>
          </section>
        </div>

        {/* Reviews & Add review */}
        <section className="p-6 border-t">
          <h2 className="text-xl font-semibold">Reviews</h2>

          <form onSubmit={submitReview} className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="sr-only">Write a review</label>
            <div className="md:col-span-2">
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview((s) => ({ ...s, rating: Number(e.target.value) }))}
                aria-label="Rating"
                className="border rounded p-2 mb-2"
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
                className="w-full border rounded p-2"
                aria-label="Write your review"
              />
            </div>

            <div className="flex flex-col gap-2">
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Submit review</button>
              <div className="text-sm text-gray-500">Reviews help others discover artisanal makers.</div>
            </div>
          </form>

          <div className="mt-6 space-y-4">
            {reviews.length === 0 && <div className="text-sm text-gray-600">No reviews yet.</div>}
            {reviews.map((r) => (
              <article key={r.id} className="p-4 border rounded-md">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{r.user}</div>
                  <div className="text-sm text-gray-600">{r.rating} / 5</div>
                </div>
                <p className="mt-2 text-gray-700">{r.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Related products (simple placeholder) */}
        <section className="p-6 border-t">
          <h3 className="font-semibold">Related products</h3>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {/* Example placeholders; connect to recommendation API for dynamic content */}
            <div className="bg-gray-50 rounded p-3 text-center">Product A</div>
            <div className="bg-gray-50 rounded p-3 text-center">Product B</div>
            <div className="bg-gray-50 rounded p-3 text-center">Product C</div>
            <div className="bg-gray-50 rounded p-3 text-center">Product D</div>
          </div>
        </section>

      </main>

    </div>
  )
}
