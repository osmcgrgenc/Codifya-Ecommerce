'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormLabel, FormError, useZodForm } from '@/components/forms/form';

const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useZodForm(loginSchema);

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (response?.error) {
        setError('E-posta veya şifre hatalı');
        return;
      }

      router.refresh();
      router.push('/');
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error(err);
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

      <FormField form={form} name="email">
        <FormLabel>E-posta</FormLabel>
        <Input
          {...form.register('email')}
          type="email"
          placeholder="ornek@mail.com"
          disabled={isLoading}
        />
        <FormError error={form.formState.errors.email?.message} />
      </FormField>

      <FormField form={form} name="password">
        <FormLabel>Şifre</FormLabel>
        <Input
          {...form.register('password')}
          type="password"
          placeholder="******"
          disabled={isLoading}
        />
        <FormError error={form.formState.errors.password?.message} />
      </FormField>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
      </Button>
    </Form>
  );
}
