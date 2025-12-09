"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import "../globals.css";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/profiles", label: "Sellers" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  return (
    <header className="h-header">
      <div className="h-container">

        {/* Logo */}
        <Link href="/" className="h-logo">
          <Image src="/images/logo.svg" alt="Handcrafted Haven" width={40} height={40} />
          <span>Handcrafted Haven</span>
        </Link>

        {/* Navigation */}
        <nav className="h-nav">
          {navLinks.map(link => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="h-actions">
          <Link href="/cart" className="h-cart-btn">🛒</Link>
          <Link href="/account" className="h-account">Account</Link>
        </div>

        {/* Mobile hamburger */}
        <button className="hamburger" onClick={toggleMenu}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile nav overlay */}
        {mobileMenuOpen && (
          <nav className="nav-mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

      </div>
    </header>
  );
}
