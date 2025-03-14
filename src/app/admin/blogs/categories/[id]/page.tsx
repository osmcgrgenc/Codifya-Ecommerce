import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getBlogCategoryById, updateBlogCategory } from '@/services/blog-service';
import CategoryForm from '../_components/category-form';

export const metadata: Metadata = {
  title: 'Kategori Düzenle - Admin Paneli',
  description: 'Blog kategorisini düzenleyin',
};

interface CategoryEditPageProps {
  params: {
    id: string;
  };
}

export default async function CategoryEditPage({ params }: CategoryEditPageProps) {
  const session = await getServerSession(authOptions);
  const category = await getBlogCategoryById(params.id);

  if (!category) {
    notFound();
  }

  // Form işleme fonksiyonu
  async function handleUpdateCategory(formData: FormData) {
    'use server';

    if (!session?.user?.id) {
      throw new Error('Oturum açmanız gerekiyor');
    }

    const name = formData.get('name') as string;

    if (!name) {
      throw new Error('Kategori adı zorunludur');
    }

    await updateBlogCategory(params.id, { name });
    redirect('/admin/blogs/categories');
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Kategori Düzenle</h1>
      <CategoryForm category={category} onSubmit={handleUpdateCategory} />
    </div>
  );
}
