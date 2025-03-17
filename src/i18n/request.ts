import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }: { locale: string }) => ({
  locale,
  messages: (await import(`../../messages/${locale}/index.json`)).default,
  timeZone: 'Europe/Istanbul',
}));
