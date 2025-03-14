// Ürün formu için arayüz
export interface ProductFormData {
  name: string;
  price: number;
  image: string;
  categoryId: string;
  description: string;
  stock: number;
  featured?: boolean;
  brandId?: string;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
}

// Checkbox onCheckedChange için tip tanımı
export type CheckedState = boolean | 'indeterminate';

// Ürün ekleme/düzenleme adımları
export enum ProductFormStep {
  BASIC_INFO = 'Temel Bilgiler',
  IMAGES = 'Ürün Görselleri',
  SEO = 'SEO Bilgileri',
  VARIANTS = 'Varyasyonlar',
  REVIEW = 'Önizleme',
} 