import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import ProfileContent from './profile-content';

export const metadata: Metadata = {
  title: 'Profilim | ' + process.env.NEXT_PUBLIC_SITE_NAME,
  description: 'Hesap bilgilerinizi ve siparişlerinizi yönetin',
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Hesabım</h1>
      <ProfileContent
        user={{
          ...session.user,
          phone: null,
          emailVerified: null,
        }}
      />
    </div>
  );
}
