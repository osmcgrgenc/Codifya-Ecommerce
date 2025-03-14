'use client';

import { useCart } from '@/lib/hooks/use-cart';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { memo, useCallback } from 'react';

// Sepet öğesi bileşeni
const CartItem = memo(
  ({
    item,
    onRemove,
    onUpdateQuantity,
  }: {
    item: any;
    onRemove: (id: string) => void;
    onUpdateQuantity: (id: string, quantity: number) => void;
  }) => {
    return (
      <li className="py-6 flex">
        <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            className="w-full h-full object-center object-cover"
            width={96}
            height={96}
            loading="lazy" // Lazy loading ekledik
            sizes="96px" // Boyut belirttik
          />
        </div>

        <div className="ml-4 flex-1 flex flex-col">
          <div>
            <div className="flex justify-between text-base font-medium text-gray-900">
              <h3>{item.name}</h3>
              <p className="ml-4">
                {item.price.toLocaleString('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                })}
              </p>
            </div>
          </div>
          <div className="flex-1 flex items-end justify-between text-sm">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                className="text-gray-500 focus:outline-none focus:text-gray-600 p-1"
                aria-label="Azalt"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M20 12H4"></path>
                </svg>
              </button>
              <span className="text-gray-700">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="text-gray-500 focus:outline-none focus:text-gray-600 p-1"
                aria-label="Artır"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 4v16m8-8H4"></path>
                </svg>
              </button>
            </div>

            <div className="flex">
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="font-medium text-indigo-600 hover:text-indigo-500"
                aria-label="Kaldır"
              >
                Kaldır
              </button>
            </div>
          </div>
        </div>
      </li>
    );
  }
);

CartItem.displayName = 'CartItem';

// Boş sepet bileşeni
const EmptyCart = memo(() => (
  <div className="text-center py-12">
    <h2 className="text-xl font-medium mb-4">Sepetiniz boş</h2>
    <p className="text-gray-500 mb-8">Sepetinizde henüz ürün bulunmamaktadır.</p>
    <Link
      href="/shop"
      className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
    >
      Alışverişe Başla
    </Link>
  </div>
));

EmptyCart.displayName = 'EmptyCart';

// Ana sepet içeriği bileşeni
function CartContent() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();
  const router = useRouter();

  // Callback fonksiyonları
  const handleRemoveItem = useCallback(
    (id: string) => {
      removeItem(id);
    },
    [removeItem]
  );

  const handleUpdateQuantity = useCallback(
    (id: string, quantity: number) => {
      updateQuantity(id, quantity);
    },
    [updateQuantity]
  );

  const handleCheckout = useCallback(() => {
    router.push('/checkout');
  }, [router]);

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="rounded-lg shadow-md p-6">
      <div className="flow-root">
        <ul className="-my-6 divide-y divide-gray-200">
          {items.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={handleRemoveItem}
              onUpdateQuantity={handleUpdateQuantity}
            />
          ))}
        </ul>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
          <p>Toplam ({totalItems} ürün)</p>
          <p>
            {totalPrice.toLocaleString('tr-TR', {
              style: 'currency',
              currency: 'TRY',
            })}
          </p>
        </div>
        <div className="mt-6">
          <Button className="w-full" onClick={handleCheckout}>
            Ödemeye Geç
          </Button>
        </div>
        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
          <p>
            veya{' '}
            <Link href="/shop" className="font-medium text-indigo-600 hover:text-indigo-500">
              Alışverişe Devam Et
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default memo(CartContent);
