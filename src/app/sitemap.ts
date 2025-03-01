import { MetadataRoute } from 'next';
import { categoryService, productService } from '@/services';

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Ana sayfalar
  const staticPages = [
    {
      url: 'https://codifya-ecommerce.com',
      lastModified: new Date(),
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 1.0,
    },
    {
      url: 'https://codifya-ecommerce.com/shop',
      lastModified: new Date(),
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 0.9,
    },
    {
      url: 'https://codifya-ecommerce.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.7,
    },
    {
      url: 'https://codifya-ecommerce.com/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.7,
    },
    {
      url: 'https://codifya-ecommerce.com/privacy',
      lastModified: new Date(),
      changeFrequency: 'yearly' as ChangeFrequency,
      priority: 0.5,
    },
    {
      url: 'https://codifya-ecommerce.com/terms',
      lastModified: new Date(),
      changeFrequency: 'yearly' as ChangeFrequency,
      priority: 0.5,
    },
  ];

  // Kategorileri çek
  const categories = await categoryService.getAllCategories();
  const categoryUrls = categories.map(category => ({
    url: `https://codifya-ecommerce.com/shop/category/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: 'weekly' as ChangeFrequency,
    priority: 0.8,
  }));

  // Ürünleri çek
  const products = await productService.getAllProducts();
  const productUrls = products.map(product => ({
    url: `https://codifya-ecommerce.com/shop/product/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as ChangeFrequency,
    priority: 0.7,
  }));

  // Tüm URL'leri birleştir
  return [...staticPages, ...categoryUrls, ...productUrls];
}
