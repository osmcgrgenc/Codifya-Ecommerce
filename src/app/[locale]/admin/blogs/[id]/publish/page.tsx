import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getBlogPostById, publishBlogPost } from '@/services/blog-service';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Blog Yazısı Yayınla - Admin Paneli',
  description: 'Blog yazısını yayınlama onayı',
};

interface BlogPublishPageProps {
  params: {
    id: string;
  };
}

export default async function BlogPublishPage({ params }: BlogPublishPageProps) {
  const session = await getServerSession(authOptions);
  const post = await getBlogPostById(params.id);

  if (!post) {
    notFound();
  }

  if (post.published) {
    redirect(`/admin/blogs/${params.id}`);
  }

  // Yayınlama işlemi
  async function handlePublishBlog() {
    'use server';

    if (!session?.user?.id) {
      throw new Error('Oturum açmanız gerekiyor');
    }

    await publishBlogPost(params.id);
    redirect('/admin/blogs');
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Blog Yazısı Yayınlama Onayı</h1>

        <div className="mb-6 text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            <strong>{post.title}</strong> başlıklı blog yazısını yayınlamak istediğinize emin
            misiniz?
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Yazı yayınlandıktan sonra herkes tarafından görüntülenebilir olacaktır.
          </p>
        </div>

        <form action={handlePublishBlog} className="flex justify-center space-x-4">
          <Link href="/admin/blogs">
            <Button type="button" variant="outline">
              İptal
            </Button>
          </Link>
          <Button type="submit" variant="default">
            Evet, Yayınla
          </Button>
        </form>
      </div>
    </div>
  );
}
