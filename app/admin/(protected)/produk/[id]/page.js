import { notFound } from 'next/navigation';
import ProductForm from '../../../../../components/ProductForm';
import { getProductById } from '../../../../../lib/products';

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return (
    <>
      <div className="admin-topbar">
        <h1 className="serif">Edit Produk</h1>
      </div>
      <ProductForm initial={product} />
    </>
  );
}
