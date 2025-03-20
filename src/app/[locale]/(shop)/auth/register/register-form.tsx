'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormLabel, FormMessage, useZodForm } from '@/components/forms/form';

const registerSchema = z
  .object({
    name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
    email: z.string().email('Geçerli bir e-posta adresi giriniz'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Şifreler eşleşmiyor',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useZodForm(registerSchema);

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Kayıt sırasında bir hata oluştu');
        return;
      }

      // Kayıt başarılı, giriş yap
      await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      router.refresh();
      router.push('/');
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <div className="space-y-2">
            <FormLabel>İsim</FormLabel>
            <Input {...field} placeholder="Adınız Soyadınız" disabled={isLoading} />
            <FormMessage>{form.formState.errors.name?.message}</FormMessage>
          </div>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <div className="space-y-2">
            <FormLabel>E-posta</FormLabel>
            <Input
              {...field}
              type="email"
              placeholder="ornek@mail.com"
              disabled={isLoading}
            />
            <FormMessage>{form.formState.errors.email?.message}</FormMessage>
          </div>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <div className="space-y-2">
            <FormLabel>Şifre</FormLabel>
            <Input
              {...field}
              type="password"
              placeholder="******"
              disabled={isLoading}
            />
            <FormMessage>{form.formState.errors.password?.message}</FormMessage>
          </div>
        )}
      />

      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <div className="space-y-2">
            <FormLabel>Şifre Tekrar</FormLabel>
            <Input
              {...field}
              type="password"
              placeholder="******"
              disabled={isLoading}
            />
            <FormMessage>{form.formState.errors.confirmPassword?.message}</FormMessage>
          </div>
        )}
      />

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
      </Button>
    </Form>
  );
}
