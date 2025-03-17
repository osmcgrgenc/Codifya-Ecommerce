import { Metadata } from 'next';
import Link from 'next/link';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { getAllBlogPosts } from '@/services/blog-service';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash, Eye, EyeOff, Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog Yönetimi - Admin Paneli',
  description: 'Blog yazılarını yönetin',
};

export default async function BlogsPage() {
  const blogPosts = await getAllBlogPosts();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Yazıları</h1>
        <div className="flex space-x-2">
          <Link href="/admin/blogs/categories">
            <Button variant="outline" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Kategoriler
            </Button>
          </Link>
          <Link href="/admin/blogs/new">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Yeni Blog Yazısı
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Başlık
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Yazar
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Durum
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Oluşturulma Tarihi
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Yayınlanma Tarihi
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {blogPosts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    Henüz blog yazısı bulunmuyor.
                  </td>
                </tr>
              ) : (
                blogPosts.map(post => (
                  <tr key={post.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {post.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {post.author.name || 'İsimsiz Yazar'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.published
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                        }`}
                      >
                        {post.published ? 'Yayında' : 'Taslak'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(post.createdAt), 'dd MMMM yyyy', { locale: tr })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {post.publishedAt
                        ? format(new Date(post.publishedAt), 'dd MMMM yyyy', { locale: tr })
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/admin/blogs/${post.id}`}>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Edit className="h-3 w-3" />
                            Düzenle
                          </Button>
                        </Link>
                        <Link href={`/admin/blogs/${post.id}/delete`}>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Trash className="h-3 w-3" />
                            Sil
                          </Button>
                        </Link>
                        <Link
                          href={`/admin/blogs/${post.id}/${post.published ? 'unpublish' : 'publish'}`}
                        >
                          <Button
                            variant={post.published ? 'outline' : 'default'}
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            {post.published ? (
                              <>
                                <EyeOff className="h-3 w-3" />
                                Yayından Kaldır
                              </>
                            ) : (
                              <>
                                <Eye className="h-3 w-3" />
                                Yayınla
                              </>
                            )}
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
