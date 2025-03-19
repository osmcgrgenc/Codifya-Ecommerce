'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { usePages } from '@/hooks/use-pages';
import { PageDialog } from './page-dialog';

export default function PagesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: pages, isLoading, error } = usePages();

  if (error) {
    return <div>Sayfalar yüklenirken bir hata oluştu.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sayfa Yönetimi</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Sayfa
        </Button>
      </div>

      {isLoading ? (
        <div>Yükleniyor...</div>
      ) : (
        <DataTable columns={columns} data={pages || []} />
      )}

      <PageDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
} 