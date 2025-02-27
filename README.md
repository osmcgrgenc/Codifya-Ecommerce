# Codifya E-Ticaret Uygulaması

Bu proje, Next.js 14 kullanılarak geliştirilmiş modern bir e-ticaret uygulamasıdır.

## Proje Özellikleri

- **Next.js 14**: Server-side rendering (SSR) ile optimize edilmiş performans
- **TypeScript**: Tip güvenliği ve daha iyi kod kalitesi
- **Prisma ORM**: Veritabanı işlemleri için
- **NextAuth.js**: Kimlik doğrulama ve oturum yönetimi
- **Tailwind CSS**: Responsive ve modern UI tasarımı
- **Zod**: Form doğrulama ve veri validasyonu

## Proje Yapısı

```
codifya-ecommerce-v5/
├── src/
│   ├── app/                    # Next.js 14 App Router yapısı
│   │   ├── api/                # API rotaları
│   │   ├── admin/              # Admin paneli sayfaları
│   │   ├── shop/               # Mağaza sayfaları
│   │   ├── auth/               # Kimlik doğrulama sayfaları
│   │   └── (site)/             # Ana site sayfaları
│   ├── components/             # Yeniden kullanılabilir bileşenler
│   │   ├── ui/                 # Temel UI bileşenleri
│   │   ├── forms/              # Form bileşenleri
│   │   ├── layout/             # Layout bileşenleri
│   │   └── shared/             # Paylaşılan bileşenler
│   ├── lib/                    # Yardımcı fonksiyonlar ve kütüphaneler
│   └── types/                  # TypeScript tip tanımlamaları
├── prisma/                     # Veritabanı şeması ve migrasyonlar
└── public/                     # Statik dosyalar
```

## Kullanıcı Tipleri

- **Müşteri**: Normal alışveriş yapan kullanıcılar
- **Müşteri Temsilcisi**: Müşteri hizmetleri ve sipariş yönetimi
- **Yönetici**: Tam yetkili sistem yöneticisi

## Özellikler

- **SSR Sayfaları**: Tüm sayfalar Server-Side Rendering ile çalışır
- **Mega Menü**: Kategoriler ve alt kategoriler için gelişmiş mega menü
- **Sepet Yönetimi**: Kullanıcı girişi olmadan sepete ürün ekleme
- **Tek Giriş Sistemi**: Tüm kullanıcı tipleri için tek bir login/register sistemi
- **Yetkilendirme**: Rol tabanlı erişim kontrolü
- **Responsive Tasarım**: Tüm cihazlarda uyumlu çalışan arayüz

## Kurulum

```bash
# Bağımlılıkları yükleyin
npm install

# Veritabanını hazırlayın
npx prisma generate
npx prisma db push

# Geliştirme sunucusunu başlatın
npm run dev
```

## Katkıda Bulunma

Projeye katkıda bulunmak için lütfen bir issue açın veya pull request gönderin.

## Lisans

MIT
