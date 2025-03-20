import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale = 'tr' }) => ({
  locale,
  messages: (await import(`../../messages/${locale}/index.json`)).default,
  timeZone: 'Europe/Istanbul',
  now: new Date(),
}));
