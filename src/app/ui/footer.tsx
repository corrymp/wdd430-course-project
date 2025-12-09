import Link from "next/link"
import Image from "next/image"
import "../globals.css"

export default function Footer() {
  return (
    <footer className="f-footer">
      <div className="f-container">

        <div className="f-col">
          <div className="f-logo">
            <Image src="/logo.svg" alt="Logo" width={50} height={50} />
            <h3>Handcrafted Haven</h3>
          </div>
          <p className="f-about">
            Supporting artisans around the world through ethical craftsmanship.
          </p>
        </div>

        <div className="f-col">
          <h4>Explore</h4>
          <Link href="/products">All Products</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/sellers">Meet the Sellers</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <div className="f-col">
          <h4>Support</h4>
          <Link href="/help">Help Center</Link>
          <Link href="/shipping">Shipping</Link>
          <Link href="/returns">Returns</Link>
          <Link href="/privacy">Privacy Policy</Link>
        </div>

        <div className="f-col">
          <h4>Follow us</h4>
          <Link href="https://instagram.com">Instagram</Link>
          <Link href="https://facebook.com">Facebook</Link>
          <Link href="https://tiktok.com">TikTok</Link>
        </div>

      </div>

      <div className="f-bottom">
        &copy; {new Date().getFullYear()} Handcrafted Haven — All rights reserved.
      </div>
    </footer>
  )
}
