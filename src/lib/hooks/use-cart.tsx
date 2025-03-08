'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { CartItem } from '@/types';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Sayfa yüklendiğinde local storage'dan sepeti al
  useEffect(() => {
    setMounted(true);
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch (error) {
        toast.error('Sepet verisi çözümlenemedi');
        setItems([]);
      }
    }
  }, []);

  // Sepet değiştiğinde local storage'a kaydet
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, mounted]);

  // Sepete ürün ekle
  const addItem = (item: CartItem) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        // Ürün zaten sepette varsa miktarını artır
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        );
      } else {
        // Ürün sepette yoksa ekle
        return [...prevItems, { ...item, quantity: item.quantity || 1 }];
      }
    });

    toast.success('Ürün sepete eklendi');
  };

  // Sepetten ürün çıkar
  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    toast.info('Ürün sepetten çıkarıldı');
  };

  // Ürün miktarını güncelle
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(prevItems => prevItems.map(item => (item.id === id ? { ...item, quantity } : item)));
    toast.info('Ürün miktarı güncellendi');
  };

  // Sepeti temizle
  const clearCart = () => {
    setItems([]);
    toast.info('Sepet temizlendi');
  };

  // Toplam ürün sayısı
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  // Toplam fiyat
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
