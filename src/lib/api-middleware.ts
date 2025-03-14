import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createUnauthorizedResponse, createServerErrorResponse } from './api-response';

export type ApiHandler = (
  req: NextRequest,
  context: any,
  session?: any
) => Promise<NextResponse> | NextResponse;

/**
 * Yetkilendirme kontrolü yapan middleware
 */
export function withAuth(handler: ApiHandler, requiredRole?: string): ApiHandler {
  return async (req: NextRequest, context: any) => {
    try {
      const session = await getServerSession(authOptions);

      if (!session) {
        return createUnauthorizedResponse('Oturum açmanız gerekmektedir');
      }

      if (requiredRole && session.user.role !== requiredRole) {
        return createUnauthorizedResponse();
      }

      return handler(req, context, session);
    } catch (error) {
      return createServerErrorResponse(error);
    }
  };
}

/**
 * Hata yakalama middleware'i
 */
export function withErrorHandling(handler: ApiHandler): ApiHandler {
  return async (req: NextRequest, context: any, session?: any) => {
    try {
      return await handler(req, context, session);
    } catch (error) {
      return createServerErrorResponse(error);
    }
  };
}

/**
 * Tüm middleware'leri birleştiren fonksiyon
 */
export function withMiddleware(
  handler: ApiHandler,
  options?: { requiredRole?: string }
): ApiHandler {
  // İçten dışa doğru middleware'leri uygula
  let enhancedHandler = withErrorHandling(handler);

  if (options?.requiredRole) {
    enhancedHandler = withAuth(enhancedHandler, options.requiredRole);
  }

  return enhancedHandler;
}
