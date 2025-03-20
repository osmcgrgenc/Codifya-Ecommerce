import { z } from 'zod';
import { BaseModel, createApiClient } from './base';

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  stock: z.number(),
  categoryId: z.string(),
  images: z.array(z.string()),
  status: z.enum(['active', 'inactive']),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Product = z.infer<typeof productSchema>;

export const productsApi = createApiClient<Product>('/api/products');

export async function getProducts() {
  const response = await productsApi.getAll();
  return response.data;
}

export async function createProduct(product: Omit<Product, keyof BaseModel>) {
  return productsApi.create(product);
}

export async function updateProduct(product: Omit<Product, 'createdAt' | 'updatedAt'>) {
  return productsApi.update(product.id, product);
}

export async function deleteProduct(id: string) {
  return productsApi.delete(id);
} 