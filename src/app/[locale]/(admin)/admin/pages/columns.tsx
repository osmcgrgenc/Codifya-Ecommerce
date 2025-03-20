'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Page } from '@/lib/api/pages';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { PageDialog } from './page-dialog';
import { deletePage } from '@/lib/api/pages';

export const columns: ColumnDef<Page>[] = [
  {
    accessorKey: 'title',
    header: 'Başlık',
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    accessorKey: 'status',
    header: 'Durum',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
          {status === 'published' ? 'Yayında' : 'Taslak'}
        </span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Oluşturulma Tarihi',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return date.toLocaleDateString('tr-TR');
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const page = row.original;
      const [isDialogOpen, setIsDialogOpen] = useState(false);

      async function handleDelete() {
        try {
          await deletePage(page.id);
          window.location.reload();
        } catch (error) {
          console.error('Sayfa silinirken bir hata oluştu:', error);
        }
      }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Menüyü aç</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Düzenle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete}>
                <Trash className="mr-2 h-4 w-4" />
                Sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <PageDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            page={page}
          />
        </>
      );
    },
  },
]; 