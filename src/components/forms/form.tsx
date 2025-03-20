'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import {
  useForm,
  UseFormReturn,
  SubmitHandler,
  UseFormProps,
  FieldValues,
  Control,
  Path,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
  className?: string;
}

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  render: (props: { field: any }) => ReactNode;
  className?: string;
}

interface FormItemProps {
  children: ReactNode;
  className?: string;
}

interface FormLabelProps {
  children: ReactNode;
  className?: string;
}

interface FormControlProps {
  children: ReactNode;
  className?: string;
}

interface FormMessageProps {
  children: ReactNode;
  className?: string;
}

export function Form<T extends FieldValues>({ form, onSubmit, children, className }: FormProps<T>) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-4', className)}>
      {children}
    </form>
  );
}

export function FormField<T extends FieldValues>({
  control,
  name,
  render,
  className,
}: FormFieldProps<T>) {
  return (
    <div className={cn('space-y-2', className)}>{render({ field: control.register(name) })}</div>
  );
}

export function FormItem({ children, className }: FormItemProps) {
  return <div className={cn('space-y-1', className)}>{children}</div>;
}

export function FormLabel({ children, className }: FormLabelProps) {
  return (
    <label
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
    >
      {children}
    </label>
  );
}

export function FormControl({ children, className }: FormControlProps) {
  return <div className={cn('relative', className)}>{children}</div>;
}

export function FormMessage({ children, className }: FormMessageProps) {
  return <p className={cn('text-sm font-medium text-red-500', className)}>{children}</p>;
}

export function useZodForm<T extends z.ZodType>(
  schema: T,
  options?: Omit<UseFormProps<z.infer<T>>, 'resolver'>
) {
  return useForm<z.infer<T>>({
    ...options,
    resolver: zodResolver(schema),
  });
}
