import Link from "next/link";

export default function Hero() {
  return (
    <section className="home-hero">
      <div className="home-hero-overlay" />

      <div className="home-hero-content">
        <h1>
          Where creativity finds <br /> its quiet home
        </h1>

        <p>
          Discover handcrafted pieces made by independent creators who put soul
          into every detail.
        </p>

        <div className="home-hero-ctas">
          <Link href="/products" className="hero-primary">
            Explore products
          </Link>

          <Link href="/sell" className="hero-secondary">
            Become a seller
          </Link>
        </div>
      </div>
    </section>
  );
}
