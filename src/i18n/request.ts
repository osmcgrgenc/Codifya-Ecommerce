import { getRequestConfig } from 'next-intl/server';
import type { GetRequestConfigParams } from 'next-intl/server';

export default getRequestConfig(async ({ locale }: GetRequestConfigParams) => ({
  defaultLocale: 'tr',
  locale: locale!,
  messages: (await import(`../../messages/${locale}/index.json`)).default,
  timeZone: 'Europe/Istanbul',
}));
