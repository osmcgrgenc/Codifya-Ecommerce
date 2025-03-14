import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { CartSkeleton } from './cart-skeleton';

// CartContent bileşenini dinamik olarak yüklüyoruz
const CartContent = dynamic(() => import('./cart-content'), {
  loading: () => <CartSkeleton />,
  ssr: false, // Client tarafında render edilecek
});

export const metadata: Metadata = {
  title: 'Sepetim | Codifya E-Ticaret',
  description: 'Sepetinizdeki ürünleri görüntüleyin ve düzenleyin.',
};

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Sepetim</h1>
      <Suspense fallback={<CartSkeleton />}>
        <CartContent />
      </Suspense>
    </div>
  );
}
