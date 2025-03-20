import { z } from 'zod';
import { BaseModel, createApiClient } from './base';

export const pageSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  status: z.enum(['draft', 'published']),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Page = z.infer<typeof pageSchema>;

export const pagesApi = createApiClient<Page>('/api/pages');

export async function getPages() {
  const response = await pagesApi.getAll();
  return response.data;
}

export async function createPage(page: Omit<Page, keyof BaseModel>) {
  return pagesApi.create(page);
}

export async function updatePage(page: Omit<Page, 'createdAt' | 'updatedAt'>) {
  return pagesApi.update(page.id, page);
}

export async function deletePage(id: string) {
  return pagesApi.delete(id);
}
