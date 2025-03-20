import { MetadataRoute } from 'next';
import { categoryService, productService } from '@/services';

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Ana sayfalar from .env
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codifya-ecommerce.com';
  const staticPages = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 1.0,
    },
    {
      url: `${siteUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as ChangeFrequency,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as ChangeFrequency,
      priority: 0.5,
    },
  ];

  // Kategorileri çek
  const categories = await categoryService.getAllCategories();
  const categoryUrls = categories.map(category => ({
    url: `${siteUrl}/shop/category/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: 'weekly' as ChangeFrequency,
    priority: 0.8,
  }));

  // Ürünleri çek
  const products = await productService.getAllProducts();
  const productUrls = products.map(product => ({
    url: `${siteUrl}/shop/product/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as ChangeFrequency,
    priority: 0.7,
  }));

  // Tüm URL'leri birleştir
  return [...staticPages, ...categoryUrls, ...productUrls];
}
