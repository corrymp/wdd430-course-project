"use client";

import { useState } from "react";
import Link from "next/link";
import { PlaceholderImage } from "../lib/mock-data";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/sellers", label: "Sellers" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="header">
      <div className="logo">
        <PlaceholderImage width={66} height={66} />
        <p>Handcrafted Haven</p>
      </div>

      {/* Desktop nav */}
      <nav className="nav-desktop">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>

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
    </header>
  );
}
