'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BlogPost, BlogCategory } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type BlogFormProps = {
  post?: BlogPost & { categories: BlogCategory[] };
  categories: (BlogCategory & { _count?: { blogPosts: number } })[];
  onSubmit: (formData: FormData) => Promise<void>;
};

export default function BlogForm({ post, categories, onSubmit }: BlogFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form gönderimi
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Başlık
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            defaultValue={post?.title || ''}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="excerpt"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Özet
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={3}
            defaultValue={post?.excerpt || ''}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          ></textarea>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Yazının kısa bir özeti. Boş bırakılırsa içerikten otomatik oluşturulur.
          </p>
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            İçerik
          </label>
          <textarea
            id="content"
            name="content"
            rows={12}
            required
            defaultValue={post?.content || ''}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="coverImage"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Kapak Görseli URL
          </label>
          <input
            type="text"
            id="coverImage"
            name="coverImage"
            defaultValue={post?.coverImage || ''}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Kapak görseli için URL. Boş bırakılabilir.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Kategoriler
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {categories.map(category => (
              <div key={category.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${category.id}`}
                  name="categories"
                  value={category.id}
                  defaultChecked={post?.categories.some(c => c.id === category.id)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`category-${category.id}`}
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Yayın Durumu
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="draft"
                name="published"
                value="false"
                defaultChecked={post ? !post.published : true}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <label
                htmlFor="draft"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Taslak
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="published"
                name="published"
                value="true"
                defaultChecked={post?.published || false}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <label
                htmlFor="published"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Yayınla
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Link href="/admin/blogs">
            <Button type="button" variant="outline">
              İptal
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              'Kaydet'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
