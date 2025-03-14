import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createValidationErrorResponse } from '@/lib/api-response';

/**
 * API isteklerinden form verilerini çıkarır ve doğrular
 */
export async function parseFormData<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; errors: string[] }> {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

    // Zod ile doğrulama yap
    const result = schema.safeParse(data);

    if (!result.success) {
      const errors = result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }

    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      errors: ['Form verisi işlenirken bir hata oluştu'],
    };
  }
}

/**
 * API isteklerinden JSON verilerini çıkarır ve doğrular
 */
export async function parseJsonData<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; errors: string[] }> {
  try {
    const data = await request.json();

    // Zod ile doğrulama yap
    const result = schema.safeParse(data);

    if (!result.success) {
      const errors = result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }

    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      errors: ['JSON verisi işlenirken bir hata oluştu'],
    };
  }
}

/**
 * URL parametrelerini çıkarır ve doğrular
 */
export function parseQueryParams<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const searchParams = request.nextUrl.searchParams;
    const data = Object.fromEntries(searchParams.entries());

    // Zod ile doğrulama yap
    const result = schema.safeParse(data);

    if (!result.success) {
      const errors = result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }

    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      errors: ['Sorgu parametreleri işlenirken bir hata oluştu'],
    };
  }
}
