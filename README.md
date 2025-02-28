# Codifya E-Ticaret

Modern ve kullanıcı dostu bir e-ticaret platformu.

## Özellikler

- Ürün listeleme ve detay sayfaları
- Sepet yönetimi
- Ödeme işlemleri (Kredi kartı ve banka havalesi)
- Kullanıcı hesapları ve profil yönetimi
- Admin paneli
  - Ürün yönetimi
  - Sipariş yönetimi
  - Kullanıcı yönetimi
  - Site ayarları

## Teknolojiler

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Tip güvenliği
- [Tailwind CSS](https://tailwindcss.com/) - Stil
- [Prisma](https://www.prisma.io/) - ORM
- [NextAuth.js](https://next-auth.js.org/) - Kimlik doğrulama
- [Iyzipay](https://www.iyzico.com/) - Ödeme entegrasyonu

## Başlangıç

### Gereksinimler

- Node.js 18.x veya üzeri
- npm veya yarn

### Kurulum

1. Repoyu klonlayın:

   ```bash
   git clone https://github.com/kullaniciadi/codifya-ecommerce-v5.git
   cd codifya-ecommerce-v5
   ```

2. Bağımlılıkları yükleyin:

   ```bash
   npm install
   ```

3. Ortam değişkenlerini ayarlayın:
   `.env.local` dosyası oluşturun ve gerekli değişkenleri ekleyin:

   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/codifya"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   IYZIPAY_API_KEY="your-iyzipay-api-key"
   IYZIPAY_SECRET_KEY="your-iyzipay-secret-key"
   ```

4. Veritabanını oluşturun:

   ```bash
   npx prisma migrate dev
   ```

5. Geliştirme sunucusunu başlatın:

   ```bash
   npm run dev
   ```

6. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## Komutlar

- `npm run dev` - Geliştirme sunucusunu başlatır
- `npm run build` - Üretim için derleme yapar
- `npm run start` - Üretim sunucusunu başlatır
- `npm run lint` - ESLint ile kod kontrolü yapar
- `npm run format` - Prettier ile kod formatlaması yapar
- `npm run lint:fix` - ESLint ile hataları düzeltir

## CI/CD

Bu proje GitHub Actions kullanarak CI/CD süreçlerini otomatikleştirir:

- **CI**: Her pull request ve main branch'e push işleminde lint ve build işlemleri çalıştırılır.
- **CD**: Main branch'e push işleminde Vercel'e otomatik deployment yapılır.

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.
