'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { toast } from 'sonner';

// Sepet öğesi tipi
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// Sepet bağlamı tipi
interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// Sepet bağlamı oluşturma
const CartContext = createContext<CartContextType | null>(null);

// Sepet sağlayıcı bileşeni
export function CartProvider({ children }: { children: ReactNode }) {
  // Sepet durumunu yerel depolamadan yükleme
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  // Sayfa yüklendiğinde yerel depolamadan sepeti yükle
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setItems(JSON.parse(storedCart));
      }
    } catch (error) {
      setError(error as Error);
      toast.error('Sepet yüklenirken hata oluştu', {
        description: (error as Error).message,
      });
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sepet değiştiğinde yerel depolamayı güncelle
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isInitialized]);

  // Sepete ürün ekleme
  const addItem = useCallback((item: CartItem) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);

      if (existingItem) {
        // Ürün zaten sepette varsa miktarını artır
        const updatedItems = prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
        toast.success('Ürün miktarı güncellendi');
        return updatedItems;
      } else {
        // Ürün sepette yoksa ekle
        toast.success('Ürün sepete eklendi');
        return [...prevItems, item];
      }
    });
  }, []);

  // Sepetten ürün çıkarma
  const removeItem = useCallback((id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    toast.success('Ürün sepetten çıkarıldı');
  }, []);

  // Ürün miktarını güncelleme
  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems(prevItems => prevItems.map(item => (item.id === id ? { ...item, quantity } : item)));
    toast.success('Ürün miktarı güncellendi');
  }, []);

  // Sepeti temizleme
  const clearCart = useCallback(() => {
    setItems([]);
    toast.success('Sepet temizlendi');
  }, []);

  // Toplam ürün sayısı ve fiyatı hesaplama
  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );

  // Bağlam değerini oluşturma
  const contextValue = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice]
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

// Sepet hook'u
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart hook'u CartProvider içinde kullanılmalıdır");
  }

  return context;
}
