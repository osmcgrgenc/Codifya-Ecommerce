import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getBlogCategoryById, deleteBlogCategory } from '@/services/blog-service';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Kategori Sil - Admin Paneli',
  description: 'Blog kategorisini silme onayı',
};

interface CategoryDeletePageProps {
  params: {
    id: string;
  };
}

export default async function CategoryDeletePage({ params }: CategoryDeletePageProps) {
  const session = await getServerSession(authOptions);
  const category = await getBlogCategoryById(params.id);

  if (!category) {
    notFound();
  }

  // Silme işlemi
  async function handleDeleteCategory() {
    'use server';

    if (!session?.user?.id) {
      throw new Error('Oturum açmanız gerekiyor');
    }

    await deleteBlogCategory(params.id);
    redirect('/admin/blogs/categories');
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Kategori Silme Onayı</h1>

        <div className="mb-6 text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            <strong>{category.name}</strong> kategorisini silmek istediğinize emin misiniz?
          </p>
          <p className="text-red-600 dark:text-red-400 text-sm">
            Bu işlem geri alınamaz ve bu kategoriye ait tüm blog yazıları kategorisiz kalacaktır.
          </p>
        </div>

        <form action={handleDeleteCategory} className="flex justify-center space-x-4">
          <Link href="/admin/blogs/categories">
            <Button type="button" variant="outline">
              İptal
            </Button>
          </Link>
          <Button type="submit" variant="destructive">
            Evet, Sil
          </Button>
        </form>
      </div>
    </div>
  );
}
