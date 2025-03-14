import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAllBlogCategories, createBlogPost } from '@/services/blog-service';
import BlogForm from '../_components/blog-form';

export const metadata: Metadata = {
  title: 'Yeni Blog Yazısı - Admin Paneli',
  description: 'Yeni bir blog yazısı oluşturun',
};

export default async function NewBlogPage() {
  const session = await getServerSession(authOptions);
  const categories = await getAllBlogCategories();

  // Form işleme fonksiyonu
  async function handleCreateBlog(formData: FormData) {
    'use server';

    if (!session?.user?.id) {
      throw new Error('Oturum açmanız gerekiyor');
    }

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string;
    const coverImage = formData.get('coverImage') as string;
    const published = formData.get('published') === 'true';
    const categoryIds = formData.getAll('categories') as string[];

    if (!title || !content) {
      throw new Error('Başlık ve içerik alanları zorunludur');
    }

    await createBlogPost({
      title,
      content,
      excerpt: excerpt || undefined,
      coverImage: coverImage || undefined,
      published,
      authorId: session.user.id,
      categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
    });

    redirect('/admin/blogs');
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Yeni Blog Yazısı</h1>
      <BlogForm categories={categories} onSubmit={handleCreateBlog} />
    </div>
  );
}
