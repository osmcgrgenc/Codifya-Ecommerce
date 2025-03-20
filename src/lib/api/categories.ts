import { z } from 'zod';
import { BaseModel, createApiClient } from './base';

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  slug: z.string(),
  parentId: z.string().nullable(),
  image: z.string().nullable(),
  status: z.enum(['active', 'inactive']),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Category = z.infer<typeof categorySchema>;

export const categoriesApi = createApiClient<Category>('/api/categories');

export async function getCategories() {
  const response = await categoriesApi.getAll();
  return response.data;
}

export async function createCategory(category: Omit<Category, keyof BaseModel>) {
  return categoriesApi.create(category);
}

export async function updateCategory(category: Omit<Category, 'createdAt' | 'updatedAt'>) {
  return categoriesApi.update(category.id, category);
}

export async function deleteCategory(id: string) {
  return categoriesApi.delete(id);
} 