"use client";

import { useCart } from "@/lib/cart";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CartContent() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-4">Sepetiniz boş</h2>
        <p className="text-gray-500 mb-8">
          Sepetinizde henüz ürün bulunmamaktadır.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flow-root">
        <ul className="-my-6 divide-y divide-gray-200">
          {items.map((item) => (
            <li key={item.id} className="py-6 flex">
              <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-center object-cover"
                />
              </div>

              <div className="ml-4 flex-1 flex flex-col">
                <div>
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <h3>{item.name}</h3>
                    <p className="ml-4">
                      {item.price.toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex-1 flex items-end justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      className="text-gray-500 focus:outline-none focus:text-gray-600 p-1"
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
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="text-gray-500 focus:outline-none focus:text-gray-600 p-1"
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
                      onClick={() => removeItem(item.id)}
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Kaldır
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
          <p>Toplam ({totalItems} ürün)</p>
          <p>
            {totalPrice.toLocaleString("tr-TR", {
              style: "currency",
              currency: "TRY",
            })}
          </p>
        </div>
        <div className="mt-6">
          <Button className="w-full">Ödemeye Geç</Button>
        </div>
        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
          <p>
            veya{" "}
            <Link
              href="/shop"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Alışverişe Devam Et
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 