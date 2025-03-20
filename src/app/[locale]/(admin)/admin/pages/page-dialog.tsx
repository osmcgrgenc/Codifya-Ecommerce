'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PageForm } from './page-form';
import { Page } from '@/lib/api/pages';

interface PageDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  page?: Page;
}

export function PageDialog({ open: controlledOpen, onOpenChange: controlledOnOpenChange, page }: PageDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const isControlled = controlledOpen !== undefined && controlledOnOpenChange !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setUncontrolledOpen;

  return (
    <>
      {!isControlled && (
        <Button onClick={() => onOpenChange(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Sayfa
        </Button>
      )}

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{page ? 'Sayfayı Düzenle' : 'Yeni Sayfa'}</DialogTitle>
          </DialogHeader>
          <PageForm onSuccess={() => onOpenChange(false)} page={page} />
        </DialogContent>
      </Dialog>
    </>
  );
} 