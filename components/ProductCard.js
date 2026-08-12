import Link from 'next/link';
import Photo from './Photo';
import { formatIDR } from '../lib/whatsapp';

export default function ProductCard({ product }) {
  return (
    <Link href={`/produk/${product.slug}`} className="card">
      <Photo tone={product.tone} image={product.image} />
      <span className="cat">{product.category}</span>
      <h4>{product.name}</h4>
      <div className="price">{formatIDR(product.price)}</div>
    </Link>
  );
}

export { formatIDR };
