import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WifiOff } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Çevrimdışı | Codifya E-Ticaret',
  description: 'İnternet bağlantınız kesildi.',
};

export default function OfflinePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center mb-6">
          <WifiOff className="h-16 w-16 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Çevrimdışısınız</h1>
        <p className="text-gray-600 mb-8">
          İnternet bağlantınız kesildi. Lütfen bağlantınızı kontrol edin ve tekrar deneyin.
        </p>
        <Button asChild>
          <Link href="/">Ana Sayfaya Dön</Link>
        </Button>
      </div>
    </div>
  );
} 