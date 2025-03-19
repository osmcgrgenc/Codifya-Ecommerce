import { useState } from 'react';
import { Page } from '@/types/page';

export function usePages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/pages');
      if (!response.ok) {
        throw new Error('Sayfalar yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      setPages(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Bilinmeyen bir hata oluştu'));
    } finally {
      setIsLoading(false);
    }
  };

  const createPage = async (pageData: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData),
      });
      if (!response.ok) {
        throw new Error('Sayfa oluşturulurken bir hata oluştu');
      }
      const newPage = await response.json();
      setPages((prev) => [...prev, newPage]);
      return newPage;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Bilinmeyen bir hata oluştu'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePage = async (pageData: Partial<Page> & { id: string }) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/pages/${pageData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData),
      });
      if (!response.ok) {
        throw new Error('Sayfa güncellenirken bir hata oluştu');
      }
      const updatedPage = await response.json();
      setPages((prev) =>
        prev.map((page) => (page.id === updatedPage.id ? updatedPage : page))
      );
      return updatedPage;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Bilinmeyen bir hata oluştu'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePage = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/pages/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Sayfa silinirken bir hata oluştu');
      }
      setPages((prev) => prev.filter((page) => page.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Bilinmeyen bir hata oluştu'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data: pages,
    isLoading,
    error,
    fetchPages,
    createPage,
    updatePage,
    deletePage,
  };
} 