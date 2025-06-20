# 🛒 Codifya E-Ticaret v5

**Modern, ölçeklenebilir ve kullanıcı dostu bir e-ticaret platformu**

![Next.js](https://img.shields.io/badge/Next.js-14.2.18-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-cyan?style=flat-square&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6.4.1-2D3748?style=flat-square&logo=prisma)
![PWA](https://img.shields.io/badge/PWA-Ready-purple?style=flat-square)

---

## 📋 İçindekiler

- [🚀 Özellikler](#-özellikler)
- [🛠️ Teknoloji Stack'i](#️-teknoloji-stacki)
- [📱 PWA ve Performans](#-pwa-ve-performans)
- [⚡ Hızlı Başlangıç](#-hızlı-başlangıç)
- [🔧 Kurulum](#-kurulum)
- [⚙️ Konfigürasyon](#️-konfigürasyon)
- [📊 Admin Panel](#-admin-panel)
- [🌐 Çok Dilli Destek](#-çok-dilli-destek)
- [💳 Ödeme Sistemi](#-ödeme-sistemi)
- [🗂️ Proje Yapısı](#️-proje-yapısı)
- [🧪 Test ve Kalite](#-test-ve-kalite)
- [🚀 Deployment](#-deployment)
- [📈 Performans Metrikleri](#-performans-metrikleri)
- [🛡️ Güvenlik](#️-güvenlik)
- [🤝 Katkıda Bulunma](#-katkıda-bulunma)

---

## 🚀 Özellikler

### ✅ **Mevcut Özellikler**

#### 🛍️ **E-Ticaret Core**
- ✨ Modern ve responsive ürün kataloğu
- 🔍 Gelişmiş arama ve filtreleme sistemi
- 🛒 Akıllı sepet yönetimi (local storage + context)
- 💳 Çoklu ödeme yöntemleri (İyzico, Banka Havalesi)
- 📦 Sipariş takip sistemi
- 🏷️ Dinamik kategori yapısı
- 📊 Ürün varyasyonları ve görsel yönetimi

#### 👨‍💼 **Admin Panel**
- 📊 **Dashboard**: İstatistikler, grafikler, son siparişler
- 🛒 **Ürün Yönetimi**: CRUD, görsel upload, toplu işlemler
- 📋 **Sipariş Yönetimi**: Durum güncelleme, takip numarası
- 👥 **Kullanıcı Yönetimi**: Roller, profil yönetimi
- 📝 **Blog Sistemi**: İçerik yönetimi, kategoriler
- 📄 **Sayfa Yönetimi**: Dinamik sayfa oluşturma
- 📧 **İletişim Mesajları**: Müşteri sorularını yönetme
- 📁 **Toplu İçe Aktarma**: Excel ile ürün import
- ⚙️ **Site Ayarları**: Genel konfigürasyon

#### 🔐 **Authentication & Authorization**
- 🔑 NextAuth.js ile güvenli authentication
- 📧 E-posta/şifre ile kayıt/giriş
- 👤 Kullanıcı profil yönetimi
- 🛡️ Role-based access control (RBAC)
- 🔒 Session yönetimi

#### 🌐 **Çok Dilli & PWA**
- 🇹🇷 Türkçe / 🇬🇧 İngilizce dil desteği
- 📱 Progressive Web App (PWA) ready
- 📲 Offline çalışma desteği
- 🔔 Push notification hazır
- 📥 App store benzeri kurulum

#### 🎨 **UI/UX**
- 🎯 Modern ve minimalist tasarım
- 📱 Tamamen responsive (mobile-first)
- 🌙 Dark/Light mode hazır altyapısı
- ♿ Accessibility (WCAG 2.1 AA)
- ⚡ Smooth animasyonlar ve transitions

#### 🔧 **Teknik Özellikler**
- 🚀 Server-side rendering (SSR)
- 📊 Static site generation (SSG)
- 🔄 Incremental static regeneration (ISR)
- 🎯 SEO optimizasyonu
- 📈 Performance monitoring
- 🛡️ Security best practices

### 🔮 **Planlanan Özellikler (Roadmap)**

#### 📱 **Mobil & Entegrasyonlar**
- [ ] React Native mobile app
- [ ] Social media login (Google, Facebook)
- [ ] WhatsApp Business entegrasyonu
- [ ] SMS notifications

#### 📊 **Analytics & Marketing**
- [ ] Google Analytics 4 entegrasyonu
- [ ] Facebook Pixel tracking
- [ ] Email marketing sistemi (Mailchimp/SendGrid)
- [ ] Kupon ve indirim kodu sistemi
- [ ] Wishlist / Favori ürünler

#### 🔧 **Advanced E-commerce**
- [ ] Multi-vendor marketplace
- [ ] Subscription/recurring payments
- [ ] Digital product downloads
- [ ] Review & rating sistemi
- [ ] Live chat support
- [ ] Inventory management
- [ ] Shipping calculator

---

## 🛠️ Teknoloji Stack'i

### **Frontend**
- **[Next.js 14](https://nextjs.org/)** - React framework (App Router)
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI components
- **[Lucide React](https://lucide.dev/)** - Modern icon library
- **[React Hook Form](https://react-hook-form.com/)** - Form management
- **[Zod](https://zod.dev/)** - Schema validation

### **Backend & Database**
- **[Prisma](https://www.prisma.io/)** - Type-safe ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Primary database
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication
- **[Bcrypt](https://www.npmjs.com/package/bcrypt)** - Password hashing

### **Internationalization & PWA**
- **[next-intl](https://next-intl-docs.vercel.app/)** - i18n support
- **[next-pwa](https://github.com/shadowwalker/next-pwa)** - PWA capabilities
- **[Sharp](https://sharp.pixelplumbing.com/)** - Image optimization

### **Payment & External Services**
- **[İyzico](https://www.iyzico.com/)** - Payment gateway
- **Bank Transfer** - Alternative payment method

### **Development & Quality**
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[TypeScript](https://www.typescriptlang.org/)** - Static type checking

---

## 📱 PWA ve Performans

### **Progressive Web App Özellikleri**
- 📱 **Uygulama Benzeri Deneyim**: Standalone mode, splash screen
- 📶 **Offline Support**: Service worker ile offline çalışma
- 🔄 **Auto-update**: Yeni sürümlerde otomatik güncelleme
- 📥 **Installable**: "Ana ekrana ekle" özelliği
- 🚀 **Fast Loading**: Precaching ve optimizasyon

### **Performance Optimizasyonları**
- ⚡ **Next.js Image Optimization**: Otomatik resim optimizasyonu
- 🎯 **Code Splitting**: Route-based ve component-based
- 📦 **Bundle Optimization**: Tree shaking ve minification
- 🔄 **Caching Strategy**: Browser ve CDN caching
- 📊 **Core Web Vitals**: LCP, FID, CLS optimizasyonu

---

## ⚡ Hızlı Başlangıç

```bash
# Repoyu klonlayın
git clone https://github.com/kullaniciadi/codifya-ecommerce-v5.git
cd codifya-ecommerce-v5

# Bağımlılıkları yükleyin
npm install

# Veritabanını setup edin
npx prisma migrate dev
npx prisma db seed

# Development server'ı başlatın
npm run dev
```

🎉 **Tebrikler!** Siteniz [http://localhost:3000](http://localhost:3000) adresinde çalışıyor.

---

## 🔧 Kurulum

### **Gereksinimler**
- Node.js 18.x veya üzeri
- npm 9.x veya yarn 1.22.x
- PostgreSQL 14+ (veya Docker)
- Git

### **1. Proje Kurulumu**

```bash
# Repository'yi klonlayın
git clone https://github.com/kullaniciadi/codifya-ecommerce-v5.git
cd codifya-ecommerce-v5

# Bağımlılıkları yükleyin
npm install

# Veya yarn kullanarak
yarn install
```

### **2. Veritabanı Kurulumu**

#### **Seçenek A: Docker ile (Önerilen)**
```bash
# Docker compose ile PostgreSQL başlatın
docker-compose up -d db

# Veritabanı bağlantısını test edin
npx prisma db push
```

#### **Seçenek B: Yerel PostgreSQL**
```bash
# PostgreSQL'de veritabanı oluşturun
createdb codifya_ecommerce

# Connection string'i .env.local'e ekleyin
DATABASE_URL="postgresql://username:password@localhost:5432/codifya_ecommerce"
```

### **3. Veritabanı Schema ve Seed**

```bash
# Prisma migration'ları çalıştırın
npx prisma migrate dev

# Seed data'yı yükleyin (demo ürünler, kategoriler vs.)
npx prisma db seed

# Prisma Studio'yu açarak verileri görüntüleyin (opsiyonel)
npx prisma studio
```

---

## ⚙️ Konfigürasyon

### **Ortam Değişkenleri**

`.env.local` dosyası oluşturun:

```bash
# Veritabanı
DATABASE_URL="postgresql://username:password@localhost:5432/codifya_ecommerce"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"

# İyzico Payment Gateway
IYZICO_API_KEY="your-iyzico-api-key"
IYZICO_SECRET_KEY="your-iyzico-secret-key"
IYZICO_URI="https://sandbox-api.iyzipay.com"  # Production: https://api.iyzipay.com

# Site Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_COMPANY_NAME="Codifya E-Ticaret"
NEXT_PUBLIC_COMPANY_EMAIL="info@codifya.com"
NEXT_PUBLIC_COMPANY_ADDRESS="İstanbul, Türkiye"
NEXT_PUBLIC_COMPANY_PHONE="+90 212 XXX XX XX"

# Email (Gelecek sürümlerde)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# Redis (Opsiyonel - cache için)
REDIS_URL="redis://localhost:6379"
```

### **Önemli Güvenlik Notları**
- 🔐 Production'da mutlaka güçlü `NEXTAUTH_SECRET` kullanın
- 🔒 `.env.local` dosyasını asla git'e commit etmeyin
- 🛡️ İyzico Production credentials'ları sadece production ortamında kullanın

---

## 📊 Admin Panel

### **Admin Hesabı Oluşturma**

```bash
# Prisma Studio'yu açın
npx prisma studio

# Users tablosunda bir kullanıcı oluşturun
# Role'ü "ADMIN" olarak ayarlayın
```

### **Admin Panel URL'leri**
- 🏠 **Dashboard**: `/admin`
- 🛒 **Ürünler**: `/admin/products`
- 📋 **Siparişler**: `/admin/orders`
- 👥 **Kullanıcılar**: `/admin/users`
- 📝 **Bloglar**: `/admin/blogs`
- 📄 **Sayfalar**: `/admin/pages`
- 📧 **İletişim**: `/admin/contact`
- 📁 **İçe Aktarma**: `/admin/import`
- ⚙️ **Ayarlar**: `/admin/settings`

### **Admin Panel Özellikleri**

#### **📊 Dashboard**
- Satış istatistikleri ve grafikler
- Son siparişler listesi
- Popüler ürünler
- Kullanıcı aktiviteleri
- Performans metrikleri

#### **🛒 Ürün Yönetimi**
- CRUD işlemleri (Create, Read, Update, Delete)
- Çoklu görsel upload
- Kategori ve marka yönetimi
- Stok takibi
- SEO ayarları (meta title, description)
- Toplu işlemler (excel import/export)

#### **📋 Sipariş Yönetimi**
- Sipariş durumu güncelleme
- Kargo takip numarası ekleme
- Tahmini teslimat tarihi
- Sipariş notları
- Ödeme bilgileri görüntüleme

---

## 🌐 Çok Dilli Destek

### **Desteklenen Diller**
- 🇹🇷 **Türkçe** (tr): Ana dil
- 🇬🇧 **İngilizce** (en): İkincil dil

### **URL Yapısı**
```
https://yoursite.com/tr    -> Türkçe
https://yoursite.com/en    -> İngilizce
```

### **Çeviri Dosyaları**
```
src/messages/
├── tr.json    # Türkçe çeviriler
└── en.json    # İngilizce çeviriler
```

### **Yeni Dil Ekleme**

1. **Çeviri dosyası oluşturun**:
```bash
# Örnek: Almanca ekleme
cp src/messages/en.json src/messages/de.json
```

2. **next-intl konfigürasyonunu güncelleyin**:
```typescript
// src/config/next-intl.config.ts
export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../messages/${locale}.json`)).default
}));
```

3. **Middleware'i güncelleyin**:
```typescript
// src/middleware.ts
export default createMiddleware({
  locales: ['tr', 'en', 'de'],
  defaultLocale: 'tr'
});
```

---

## 💳 Ödeme Sistemi

### **Desteklenen Ödeme Yöntemleri**

#### **1. İyzico (Kredi/Banka Kartı)**
- 💳 Visa, Mastercard, Amex support
- 🔒 3D Secure entegrasyonu
- 💰 Taksit seçenekleri
- 🔄 Otomatik webhook işleme
- 📱 Mobil uyumlu ödeme sayfası

#### **2. Banka Havalesi**
- 🏦 Manuel banka transferi
- 📧 Otomatik referans kodu
- 📋 Havale talimatları
- ✅ Manuel onaylama sistemi

### **İyzico Konfigürasyonu**

```javascript
// Test Environment
IYZICO_API_KEY="sandbox-api-key"
IYZICO_SECRET_KEY="sandbox-secret-key"
IYZICO_URI="https://sandbox-api.iyzipay.com"

// Production Environment
IYZICO_API_KEY="live-api-key"
IYZICO_SECRET_KEY="live-secret-key"
IYZICO_URI="https://api.iyzipay.com"
```

### **Ödeme Akışı**
```
1. Sepet → 2. Checkout → 3. Ödeme → 4. Webhook → 5. Onay → 6. Teslimat
```

---

## 🗂️ Proje Yapısı

```
codifya-ecommerce-v5/
├── 📁 prisma/                 # Database schema & migrations
│   ├── schema.prisma          # Prisma schema file
│   ├── seed.ts               # Database seeding
│   └── migrations/           # Database migrations
├── 📁 public/                # Static files
│   ├── images/               # Product & site images
│   ├── icons/                # PWA icons
│   ├── manifest.json         # PWA manifest
│   └── sw.js                 # Service worker
├── 📁 src/
│   ├── 📁 app/               # Next.js App Router
│   │   ├── [locale]/         # Internationalized routes
│   │   │   ├── (admin)/      # Admin panel routes
│   │   │   └── (shop)/       # E-commerce routes
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── admin/        # Admin API endpoints
│   │   │   ├── payment/      # Payment processing
│   │   │   └── ...
│   │   └── globals.css       # Global styles
│   ├── 📁 components/        # Reusable components
│   │   ├── ui/               # Base UI components
│   │   ├── layout/           # Layout components
│   │   ├── admin/            # Admin-specific components
│   │   └── shared/           # Shared components
│   ├── 📁 lib/               # Utilities & configurations
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── db.ts             # Database connection
│   │   ├── utils.ts          # Utility functions
│   │   └── hooks/            # Custom React hooks
│   ├── 📁 services/          # Business logic & API calls
│   │   ├── product/          # Product service
│   │   ├── order-service.ts  # Order management
│   │   └── ...
│   ├── 📁 types/             # TypeScript type definitions
│   ├── 📁 messages/          # i18n translation files
│   │   ├── tr.json           # Turkish translations
│   │   └── en.json           # English translations
│   └── middleware.ts         # Next.js middleware
├── 📄 next.config.mjs        # Next.js configuration
├── 📄 tailwind.config.ts     # Tailwind CSS config
├── 📄 tsconfig.json          # TypeScript config
├── 📄 package.json           # Dependencies
└── 📄 docker-compose.yml     # Docker configuration
```

### **Key Directories Açıklaması**

- **`app/[locale]/`**: Çok dilli route yapısı
- **`app/(admin)/`**: Admin panel sayfaları (role-protected)
- **`app/(shop)/`**: E-ticaret müşteri sayfaları
- **`components/ui/`**: Radix UI tabanlı temel bileşenler
- **`services/`**: İş mantığı ve API çağrıları
- **`lib/hooks/`**: Custom React hooks (useCart, useAuth vs.)

---

## 🧪 Test ve Kalite

### **Kod Kalitesi**

```bash
# Linting
npm run lint          # ESLint kontrolü
npm run lint:fix      # Otomatik düzeltme

# Formatting
npm run format        # Prettier ile formatla
npm run format:check  # Format kontrolü

# Type checking
npx tsc --noEmit      # TypeScript tip kontrolü
```

### **Build & Development**

```bash
# Development
npm run dev           # Development server (hot reload)

# Production Build
npm run build         # Production build
npm run start         # Production server

# Database
npm run db:push       # Schema'yı DB'ye push et
npm run db:seed       # Test verilerini yükle
npm run db:studio     # Prisma Studio'yu aç
```

### **Performance Testing**

```bash
# Lighthouse CI (planlı)
npm run lighthouse

# Bundle Analyzer (planlı)
npm run analyze
```

---

## 🚀 Deployment

### **Vercel (Önerilen)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kullaniciadi/codifya-ecommerce-v5)

1. **GitHub'a push edin**
2. **Vercel'e import edin**
3. **Environment variables'ları ayarlayın**
4. **Deploy!**

### **Docker**

```bash
# Docker image build
docker build -t codifya-ecommerce .

# Docker compose ile çalıştır
docker-compose up -d

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

### **Environment Variables (Production)**

```bash
# Production değişkenleri
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="production-secret-key"
IYZICO_URI="https://api.iyzipay.com"  # Production İyzico
```

---

## 📈 Performans Metrikleri

### **Target Metrics**
- 🚀 **Lighthouse Score**: 95+
- ⚡ **First Contentful Paint**: < 1.2s
- 🎯 **Time to Interactive**: < 2.5s
- 📊 **Core Web Vitals**: All "Good"
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1

### **Optimization Techniques**
- ✅ Image optimization with Next.js Image
- ✅ Code splitting (route & component level)
- ✅ Bundle optimization & tree shaking
- ✅ Critical CSS inlining
- ✅ Service worker caching
- ✅ CDN integration ready

---

## 🛡️ Güvenlik

### **Güvenlik Önlemleri**
- 🔒 **Authentication**: NextAuth.js secure sessions
- 🛡️ **Authorization**: Role-based access control
- 🔐 **Password Security**: Bcrypt hashing
- 🚫 **XSS Protection**: Input sanitization
- 🛑 **CSRF Protection**: Built-in Next.js protection
- 🔍 **SQL Injection**: Prisma ORM protection
- 📊 **Rate Limiting**: API endpoint protection (planlı)
- 🔑 **Environment Security**: Secure env var handling

### **Security Headers**
```typescript
// next.config.mjs
{
  headers: [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        }
      ]
    }
  ]
}
```

---

## 📚 API Documentation

### **Authentication Endpoints**
```
POST /api/auth/register     # Kullanıcı kaydı
POST /api/auth/signin       # Giriş
POST /api/auth/signout      # Çıkış
```

### **Product Endpoints**
```
GET    /api/products           # Ürün listesi
GET    /api/products/[id]      # Ürün detayı
POST   /api/admin/products     # Ürün oluştur (Admin)
PUT    /api/admin/products/[id] # Ürün güncelle (Admin)
DELETE /api/admin/products/[id] # Ürün sil (Admin)
```

### **Order Endpoints**
```
GET  /api/orders              # Kullanıcı siparişleri
POST /api/orders/create       # Sipariş oluştur
GET  /api/admin/orders        # Tüm siparişler (Admin)
PUT  /api/admin/orders/[id]   # Sipariş güncelle (Admin)
```

### **Payment Endpoints**
```
POST /api/payment/iyzico      # İyzico ödeme başlat
POST /api/payment/iyzico/callback # İyzico webhook
POST /api/payment/bank-transfer   # Banka havalesi
```

---

## 🤝 Katkıda Bulunma

### **Development Workflow**

1. **Fork & Clone**
```bash
git clone https://github.com/your-username/codifya-ecommerce-v5.git
```

2. **Feature Branch**
```bash
git checkout -b feature/amazing-feature
```

3. **Development**
```bash
npm run dev  # Development server
# Code your feature...
```

4. **Quality Checks**
```bash
npm run lint      # Lint kontrolü
npm run format    # Format kontrolü
npm run build     # Build kontrolü
```

5. **Commit & Push**
```bash
git commit -m "feat: Add amazing feature"
git push origin feature/amazing-feature
```

6. **Pull Request**
- Detaylı açıklama yazın
- Screenshots ekleyin (UI değişiklikleri için)
- Testing notes ekleyin

### **Commit Convention**
```
feat: yeni özellik
fix: bug düzeltmesi
docs: dokümantasyon
style: formatting
refactor: kod düzenleme
test: test ekleme
chore: build/config değişiklikleri
```

### **Code Style Guidelines**
- TypeScript kullanın
- ESLint kurallarına uyun
- Prettier ile formatını
- Meaningful commit messages
- Component'leri dokümante edin

---

## 📞 Destek ve İletişim

- 📧 **Email**: support@codifya.com
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/kullaniciadi/codifya-ecommerce-v5/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/kullaniciadi/codifya-ecommerce-v5/discussions)
- 📖 **Documentation**: [Wiki](https://github.com/kullaniciadi/codifya-ecommerce-v5/wiki)

---

## 📄 Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 🙏 Teşekkürler

Bu projeyi mümkün kılan harika açık kaynak projelerine teşekkürler:

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Radix UI](https://www.radix-ui.com/) - UI components
- [NextAuth.js](https://next-auth.js.org/) - Authentication

---

<div align="center">

**[⬆ Başa Dön](#-codifya-e-ticaret-v5)**

Made with ❤️ by [Codifya Team](https://github.com/kullaniciadi)

![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)
![GitHub](https://img.shields.io/github/license/kullaniciadi/codifya-ecommerce-v5?style=flat-square)
![GitHub stars](https://img.shields.io/github/stars/kullaniciadi/codifya-ecommerce-v5?style=flat-square)

</div>
