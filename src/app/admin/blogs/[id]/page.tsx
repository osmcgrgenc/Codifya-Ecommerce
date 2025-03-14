import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAllBlogCategories, getBlogPostById, updateBlogPost } from '@/services/blog-service';
import BlogForm from '../_components/blog-form';

export const metadata: Metadata = {
  title: 'Blog Yazısı Düzenle - Admin Paneli',
  description: 'Blog yazısını düzenleyin',
};

interface BlogEditPageProps {
  params: {
    id: string;
  };
}

export default async function BlogEditPage({ params }: BlogEditPageProps) {
  const session = await getServerSession(authOptions);
  const [post, categories] = await Promise.all([
    getBlogPostById(params.id),
    getAllBlogCategories(),
  ]);

  if (!post) {
    notFound();
  }

  // Form işleme fonksiyonu
  async function handleUpdateBlog(formData: FormData) {
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

    await updateBlogPost(params.id, {
      title,
      content,
      excerpt: excerpt || undefined,
      coverImage: coverImage || undefined,
      published,
      categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
    });

    redirect('/admin/blogs');
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Blog Yazısı Düzenle</h1>
      <BlogForm post={post} categories={categories} onSubmit={handleUpdateBlog} />
    </div>
  );
}
