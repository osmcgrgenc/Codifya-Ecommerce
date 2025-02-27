"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormLabel,
  FormError,
  useZodForm,
} from "@/components/forms/form";

const registerSchema = z
  .object({
    name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
    email: z.string().email("Geçerli bir e-posta adresi giriniz"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Kayıt sırasında bir hata oluştu");
        return;
      }

      // Kayıt başarılı, giriş yap
      await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      router.refresh();
      router.push("/");
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
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

      <FormField form={form} name="name">
        <FormLabel>İsim</FormLabel>
        <Input
          {...form.register("name")}
          placeholder="Adınız Soyadınız"
          disabled={isLoading}
        />
        <FormError error={form.formState.errors.name?.message} />
      </FormField>

      <FormField form={form} name="email">
        <FormLabel>E-posta</FormLabel>
        <Input
          {...form.register("email")}
          type="email"
          placeholder="ornek@mail.com"
          disabled={isLoading}
        />
        <FormError error={form.formState.errors.email?.message} />
      </FormField>

      <FormField form={form} name="password">
        <FormLabel>Şifre</FormLabel>
        <Input
          {...form.register("password")}
          type="password"
          placeholder="******"
          disabled={isLoading}
        />
        <FormError error={form.formState.errors.password?.message} />
      </FormField>

      <FormField form={form} name="confirmPassword">
        <FormLabel>Şifre Tekrar</FormLabel>
        <Input
          {...form.register("confirmPassword")}
          type="password"
          placeholder="******"
          disabled={isLoading}
        />
        <FormError error={form.formState.errors.confirmPassword?.message} />
      </FormField>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
      </Button>
    </Form>
  );
} 