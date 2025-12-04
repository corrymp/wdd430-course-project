import Image from 'next/image';
import { Product } from '@/types/types';

export default function ProductCard({ product }: { product: Product; }) {
  return (
    <div className="product-card">
      <div className="image-wrap" style={{ width: '100%', height: 180, overflow: 'hidden', backgroundColor: '#f5f0e8' }}>
        <Image
          src={product.images[0].path}
          alt={product.name}
          width={800}
          height={180}
          style={{ width: '100%', height: 180, objectFit: 'contain', display: 'block' }}
        />
      </div>
      <h3>{product.name}</h3>
      <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(product.price)}</p>
    </div>
  );
}