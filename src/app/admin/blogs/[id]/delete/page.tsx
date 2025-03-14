import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getBlogPostById, deleteBlogPost } from '@/services/blog-service';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Blog Yazısı Sil - Admin Paneli',
  description: 'Blog yazısını silme onayı',
};

interface BlogDeletePageProps {
  params: {
    id: string;
  };
}

export default async function BlogDeletePage({ params }: BlogDeletePageProps) {
  const session = await getServerSession(authOptions);
  const post = await getBlogPostById(params.id);

  if (!post) {
    notFound();
  }

  // Silme işlemi
  async function handleDeleteBlog() {
    'use server';

    if (!session?.user?.id) {
      throw new Error('Oturum açmanız gerekiyor');
    }

    await deleteBlogPost(params.id);
    redirect('/admin/blogs');
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Blog Yazısı Silme Onayı</h1>

        <div className="mb-6 text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            <strong>{post.title}</strong> başlıklı blog yazısını silmek istediğinize emin misiniz?
          </p>
          <p className="text-red-600 dark:text-red-400 text-sm">
            Bu işlem geri alınamaz ve tüm veriler kalıcı olarak silinecektir.
          </p>
        </div>

        <form action={handleDeleteBlog} className="flex justify-center space-x-4">
          <Link href="/admin/blogs">
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
