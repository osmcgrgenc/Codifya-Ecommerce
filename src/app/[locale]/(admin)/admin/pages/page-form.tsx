'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/forms/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createPage, updatePage, Page } from '@/lib/api/pages';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z.string().min(1, 'Başlık gereklidir'),
  slug: z.string().min(1, 'Slug gereklidir'),
  content: z.string().min(1, 'İçerik gereklidir'),
  status: z.enum(['draft', 'published']),
});

type FormValues = z.infer<typeof formSchema>;

interface PageFormProps {
  onSuccess: () => void;
  page?: Page;
}

export function PageForm({ onSuccess, page }: PageFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: page || {
      title: '',
      slug: '',
      content: '',
      status: 'draft',
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      setIsLoading(true);
      if (page) {
        await updatePage({ ...values, id: page.id });
      } else {
        await createPage(values);
      }
      onSuccess();
    } catch (error) {
      toast.error('Sayfa kaydedilirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Başlık</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage>{form.formState.errors.title?.message}</FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="slug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Slug</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage>{form.formState.errors.slug?.message}</FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>İçerik</FormLabel>
            <FormControl>
              <Textarea {...field} className="min-h-[200px]" />
            </FormControl>
            <FormMessage>{form.formState.errors.content?.message}</FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Durum</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Durum seçin" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="draft">Taslak</SelectItem>
                <SelectItem value="published">Yayında</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage>{form.formState.errors.status?.message}</FormMessage>
          </FormItem>
        )}
      />
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          İptal
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </div>
    </Form>
  );
}
