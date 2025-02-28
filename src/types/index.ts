// Ürün veri tipi
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  stock?: number;
}

// Sepet öğesi veri tipi
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
}

// Adres veri tipi
export interface Address {
  contactName: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
}

// Sipariş durumları
export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

// Ödeme yöntemleri
export type PaymentMethod = "CREDIT_CARD" | "BANK_TRANSFER";

// Sipariş veri tipi
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  date: string;
  customerName: string;
  items: CartItem[];
  shippingAddress: Address;
  billingAddress: Address;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  referenceCode?: string;
}

// Kullanıcı rolleri
export type UserRole = "USER" | "ADMIN" | "CUSTOMER_SERVICE";

// Kullanıcı veri tipi
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  orders?: number;
  image?: string;
}

// Site ayarları veri tipi
export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  logo: string;
  currency: string;
  taxRate: number;
  shippingFee: number;
  freeShippingThreshold: number;
  enableRegistration: boolean;
  enableGuestCheckout: boolean;
  maintenanceMode: boolean;
} 