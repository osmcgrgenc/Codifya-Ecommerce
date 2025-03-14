import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * Başarılı API yanıtı oluşturur
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = 200,
  meta?: ApiResponse['meta']
): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    meta,
  };

  return NextResponse.json(response, { status });
}

/**
 * Başarılı sayfalandırılmış API yanıtı oluşturur
 */
export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string
): NextResponse {
  const totalPages = Math.ceil(total / limit);

  const response: ApiResponse<T[]> = {
    success: true,
    data,
    message,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };

  return NextResponse.json(response);
}

/**
 * Hata API yanıtı oluşturur
 */
export function createErrorResponse(
  message: string,
  status: number = 400,
  errors?: string[]
): NextResponse {
  const response: ApiResponse = {
    success: false,
    message,
    errors: errors || [message],
  };

  return NextResponse.json(response, { status });
}

/**
 * Yetkilendirme hatası yanıtı oluşturur
 */
export function createUnauthorizedResponse(
  message: string = 'Bu işlem için yetkiniz bulunmamaktadır'
): NextResponse {
  return createErrorResponse(message, 403);
}

/**
 * Sunucu hatası yanıtı oluşturur
 */
export function createServerErrorResponse(error: unknown): NextResponse {
  const errorMessage =
    error instanceof Error ? error.message : 'Beklenmeyen bir sunucu hatası oluştu';

  return createErrorResponse('Sunucu hatası', 500, [errorMessage]);
}

/**
 * Doğrulama hatası yanıtı oluşturur
 */
export function createValidationErrorResponse(errors: string[]): NextResponse {
  return createErrorResponse('Doğrulama hatası', 400, errors);
}

/**
 * Kaynak bulunamadı hatası yanıtı oluşturur
 */
export function createNotFoundResponse(resource: string = 'Kaynak'): NextResponse {
  return createErrorResponse(`${resource} bulunamadı`, 404);
}

/**
 * Doğrulama sonucunu işler ve hata durumunda uygun yanıtı döndürür
 */
export function handleValidationResult<T>(
  result: { success: true; data: T } | { success: false; errors: string[] }
): { success: true; data: T } | { success: false; response: NextResponse } {
  if (!result.success) {
    return {
      success: false,
      response: createValidationErrorResponse(result.errors),
    };
  }

  return { success: true, data: result.data };
}
