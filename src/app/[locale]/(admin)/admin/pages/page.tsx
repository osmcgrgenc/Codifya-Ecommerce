import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { PageDialog } from './page-dialog';
import { getPages } from '@/lib/api/pages';

export default async function PagesPage() {
  const pages = await getPages();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sayfa Yönetimi</h1>
        <Suspense fallback={<Button disabled>Yükleniyor...</Button>}>
          <PageDialog />
        </Suspense>
      </div>

      <Suspense fallback={<div>Yükleniyor...</div>}>
        <DataTable columns={columns} data={pages || []} />
      </Suspense>
    </div>
  );
} 