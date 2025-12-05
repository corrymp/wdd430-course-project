import Image from 'next/image';
import Link from 'next/link';

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <div className="product-card">
      <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="image-wrap" style={{ width: '100%', height: 180, overflow: 'hidden', backgroundColor: '#f5f0e8', cursor: 'pointer' }}>
          <Image
            src={product.image}
            alt={product.name}
            width={800}
            height={180}
            style={{ width: '100%', height: 180, objectFit: 'contain', display: 'block' }}
          />
        </div>
        <h3>{product.name}</h3>
      </Link>
      <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(product.price)}</p>
    </div>
  );
}