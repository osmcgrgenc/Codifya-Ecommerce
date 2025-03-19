'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Page } from '@/types/page';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePages } from '@/hooks/use-pages';

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
        <span className={`px-2 py-1 rounded-full text-xs ${
          status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
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
      const { deletePage } = usePages();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Menüyü aç</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" />
              Düzenle
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => deletePage(page.id)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Sil
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]; 