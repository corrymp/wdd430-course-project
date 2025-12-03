"use client"
import Link from "next/link"
import Image from "next/image"
import "../globals.css"

export default function Header() {
  return (
    <header className="h-header">
      <div className="h-container">

        {/* Logo */}
        <Link href="/" className="h-logo">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          <span>Handcrafted Haven</span>
        </Link>

        {/* Navigation */}
        <nav className="h-nav">
          <Link href="/products">Products</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/sellers">Sellers</Link>
          <Link href="/about">About</Link>
        </nav>

        {/* Actions */}
        <div className="h-actions">
          <Link href="/cart" className="h-cart-btn">🛒</Link>
          <Link href="/account" className="h-account">Account</Link>
        </div>

      </div>
    </header>
  )
}
