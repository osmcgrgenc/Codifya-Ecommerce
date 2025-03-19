# Codifya E-Ticaret

Modern ve kullanıcı dostu bir e-ticaret platformu.

## Özellikler

### Mevcut Özellikler
- Ürün listeleme ve detay sayfaları
- Gelişmiş ürün filtreleme ve arama
- Sepet yönetimi
- Ödeme işlemleri (Kredi kartı ve banka havalesi)
- Kullanıcı hesapları ve profil yönetimi
- Admin paneli
  - Ürün yönetimi
  - Sipariş yönetimi
  - Kullanıcı yönetimi
  - Site ayarları
- Çoklu dil desteği (TR/EN)
- Responsive tasarım
- SEO optimizasyonu
- Performans optimizasyonu
- Güvenlik önlemleri (XSS, CSRF koruması)

### Planlanan Özellikler
- Mobil uygulama (React Native)
- Gelişmiş analitik dashboard
- Otomatik stok takibi
- E-posta pazarlama entegrasyonu
- Sosyal medya entegrasyonu
- Gelişmiş ürün varyasyonları
- Çoklu satıcı desteği
- Gelişmiş raporlama sistemi
- API marketplace
- Otomatik yedekleme sistemi

## Teknolojiler

- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Tip güvenliği
- [Tailwind CSS](https://tailwindcss.com/) - Stil
- [Prisma](https://www.prisma.io/) - ORM
- [NextAuth.js](https://next-auth.js.org/) - Kimlik doğrulama
- [Iyzipay](https://www.iyzico.com/) - Ödeme entegrasyonu
- [Redis](https://redis.io/) - Önbellek ve oturum yönetimi
- [Docker](https://www.docker.com/) - Konteynerizasyon
- [Jest](https://jestjs.io/) - Test framework
- [Cypress](https://www.cypress.io/) - E2E testleri

## Başlangıç

### Gereksinimler

- Node.js 18.x veya üzeri
- npm veya yarn
- Docker (opsiyonel)
- Redis (opsiyonel)

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
   REDIS_URL="redis://localhost:6379"
   SMTP_HOST="smtp.example.com"
   SMTP_PORT="587"
   SMTP_USER="your-smtp-user"
   SMTP_PASSWORD="your-smtp-password"
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
- `npm run test` - Jest ile testleri çalıştırır
- `npm run test:e2e` - Cypress ile E2E testleri çalıştırır
- `npm run docker:up` - Docker konteynerlerini başlatır
- `npm run docker:down` - Docker konteynerlerini durdurur

## CI/CD

Bu proje GitHub Actions kullanarak CI/CD süreçlerini otomatikleştirir:

- **CI**: Her pull request ve main branch'e push işleminde:
  - Lint kontrolü
  - Build kontrolü
  - Unit testler
  - E2E testler
  - Güvenlik taraması
  - Performans testleri
- **CD**: Main branch'e push işleminde:
  - Vercel'e otomatik deployment
  - Docker image build ve push
  - Veritabanı migration
  - Cache invalidation

## Performans Metrikleri

- Lighthouse skoru: 95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Core Web Vitals: Tüm metrikler "İyi" seviyesinde

## Güvenlik

- Düzenli güvenlik güncellemeleri
- OWASP Top 10 koruması
- Rate limiting
- Input validasyonu
- XSS ve CSRF koruması
- SQL injection koruması
- Güvenli oturum yönetimi

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun
