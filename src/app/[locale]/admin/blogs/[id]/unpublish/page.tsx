import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getBlogPostById, unpublishBlogPost } from '@/services/blog-service';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Blog Yazısı Yayından Kaldır - Admin Paneli',
  description: 'Blog yazısını yayından kaldırma onayı',
};

interface BlogUnpublishPageProps {
  params: {
    id: string;
  };
}

export default async function BlogUnpublishPage({ params }: BlogUnpublishPageProps) {
  const session = await getServerSession(authOptions);
  const post = await getBlogPostById(params.id);

  if (!post) {
    notFound();
  }

  if (!post.published) {
    redirect(`/admin/blogs/${params.id}`);
  }

  // Yayından kaldırma işlemi
  async function handleUnpublishBlog() {
    'use server';

    if (!session?.user?.id) {
      throw new Error('Oturum açmanız gerekiyor');
    }

    await unpublishBlogPost(params.id);
    redirect('/admin/blogs');
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Blog Yazısı Yayından Kaldırma Onayı</h1>

        <div className="mb-6 text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            <strong>{post.title}</strong> başlıklı blog yazısını yayından kaldırmak istediğinize
            emin misiniz?
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Yazı yayından kaldırıldıktan sonra ziyaretçiler tarafından görüntülenemeyecektir.
          </p>
        </div>

        <form action={handleUnpublishBlog} className="flex justify-center space-x-4">
          <Link href="/admin/blogs">
            <Button type="button" variant="outline">
              İptal
            </Button>
          </Link>
          <Button type="submit" variant="default">
            Evet, Yayından Kaldır
          </Button>
        </form>
      </div>
    </div>
  );
}
