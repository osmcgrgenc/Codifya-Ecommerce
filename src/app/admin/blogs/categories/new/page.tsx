import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createBlogCategory } from '@/services/blog-service';
import CategoryForm from '../_components/category-form';

export const metadata: Metadata = {
  title: 'Yeni Blog Kategorisi - Admin Paneli',
  description: 'Yeni bir blog kategorisi oluşturun',
};

export default async function NewCategoryPage() {
  const session = await getServerSession(authOptions);

  // Form işleme fonksiyonu
  async function handleCreateCategory(formData: FormData) {
    'use server';

    if (!session?.user?.id) {
      throw new Error('Oturum açmanız gerekiyor');
    }

    const name = formData.get('name') as string;

    if (!name) {
      throw new Error('Kategori adı zorunludur');
    }

    await createBlogCategory({ name });
    redirect('/admin/blogs/categories');
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Yeni Blog Kategorisi</h1>
      <CategoryForm onSubmit={handleCreateCategory} />
    </div>
  );
}
