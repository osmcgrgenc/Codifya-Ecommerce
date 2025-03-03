/* eslint-disable no-console */
import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Global prisma değişkenini kontrol et ve yeniden tanımlama
const prisma = new PrismaClient();

async function main() {
  console.log('Seed başlatılıyor...');

  // Admin kullanıcısı oluştur
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@codifya.com' },
    update: {},
    create: {
      email: 'admin@codifya.com',
      name: 'Admin Kullanıcı',
      password: adminPassword,
      role: UserRole.ADMIN,
      phone: '1234567890',
      emailVerified: new Date(),
    },
  });
  console.log('Admin kullanıcısı oluşturuldu:', admin.email);

  // Normal kullanıcı oluştur
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@codifya.com' },
    update: {},
    create: {
      email: 'user@codifya.com',
      name: 'Test Kullanıcı',
      password: userPassword,
      role: UserRole.CUSTOMER,
      phone: '1112223333',
    },
  });
  console.log('Normal kullanıcı oluşturuldu:', user.email);

  // Müşteri Temsilcisi kullanıcı oluştur
  const customerServiceUserPassword = await bcrypt.hash('agent123', 10);
  const customerServiceUser = await prisma.user.upsert({
    where: { email: 'agent@codifya.com' },
    update: {},
    create: {
      name: 'Customer Service',
      email: 'support@codifya.com',
      password: customerServiceUserPassword,
      role: UserRole.CUSTOMER_SERVICE,
      phone: '0987654321',
    },
  });
  console.log('Müşteri temsilcisi kullanıcı oluşturuldu:', customerServiceUser.email);

  // Satıcı oluşturuluyor
  const sellerUserPassword = await bcrypt.hash('seller123', 10);
  const sellerUser = await prisma.user.create({
    data: {
      name: 'Trusted Seller',
      email: 'seller@codifya.com',
      password: sellerUserPassword,
      role: UserRole.CUSTOMER,
      phone: '5556667777',
    },
  });
  console.log('Satıcı kullanıcı oluşturuldu:', sellerUser.email);

  // Markalar oluşturuluyor
  const brand1 = await prisma.brand.create({
    data: {
      name: 'TechMaster',
      slug: 'techmaster',
      description: 'Advanced technology products',
    },
  });

  const brand2 = await prisma.brand.create({
    data: {
      name: 'EcoLiving',
      slug: 'ecoliving',
      description: 'Eco-friendly and sustainable products',
    },
  });

  // Kategoriler oluştur
  const elektronik = await prisma.category.upsert({
    where: { slug: 'elektronik' },
    update: {},
    create: {
      name: 'Elektronik',
      slug: 'elektronik',
      description: 'Elektronik ürünler',
      image: '/images/categories/electronics.jpg',
    },
  });
  const elektronikBilgisayar = await prisma.category.upsert({
    where: { slug: 'elektronik-bilgisayar' },
    update: {},
    create: {
      name: 'Bilgisayar',
      slug: 'elektronik-bilgisayar',
      description: 'Bilgisayar ve aksesuarları',
      image: '/images/categories/computers.jpg',
      parentId: elektronik.id,
    },
  });
  const elektronikTelefon = await prisma.category.upsert({
    where: { slug: 'elektronik-telefon' },
    update: {},
    create: {
      name: 'Telefon',
      slug: 'elektronik-telefon',
      description: 'Telefon ve aksesuarları',
      image: '/images/categories/telefon.jpg',
      parentId: elektronik.id,
    },
  });
  const giyim = await prisma.category.upsert({
    where: { slug: 'giyim' },
    update: {},
    create: {
      name: 'Giyim',
      slug: 'giyim',
      description: 'Giyim ürünleri',
      image: '/images/categories/clothing.jpg',
    },
  });

  const spor = await prisma.category.upsert({
    where: { slug: 'spor' },
    update: {},
    create: {
      name: 'Spor',
      slug: 'spor',
      description: 'Spor ürünleri',
      image: '/images/categories/sports.jpg',
    },
  });

  console.log('Kategoriler oluşturuldu');

  // Varyasyon tipleri oluşturuluyor
  const sizeOptionType = await prisma.optionType.create({
    data: {
      name: 'Size',
    },
  });

  const colorOptionType = await prisma.optionType.create({
    data: {
      name: 'Color',
    },
  });

  console.log('Varyasyon tipleri oluşturuldu');

  // Ürünler oluştur
  const products = [
    {
      name: 'Akıllı Telefon',
      slug: 'akilli-telefon',
      description: 'Yüksek performanslı akıllı telefon, 6.5 inç ekran, 128GB depolama, 8GB RAM.',
      price: 8999.99,
      stock: 50,
      categoryId: elektronikTelefon.id,
      featured: true,
      brandId: brand1.id,
      metaTitle: 'Akıllı Telefon | En İyi Fiyatlarla',
      metaDescription: 'Yüksek performanslı akıllı telefon modellerini uygun fiyatlarla satın alın.',
      seller: {
        create: {
          sellerId: sellerUser.id,
          price: 8999.99,
          stock: 20,
          rating: 4.5,
        }
      },
      images: {
        create: [{
          url: '/images/products/smartphone.jpg',
          isMain: true
        }]
      },
      variations: {
        create: [
          {
            sku: 'PHONE-BLK-128',
            price: 8999.99,
            stock: 30,
            VariationOption: {
              create: [
                {
                  optionTypeId: colorOptionType.id,
                  value: 'Siyah'
                },
                {
                  optionTypeId: sizeOptionType.id,
                  value: '128GB'
                }
              ]
            }
          },
          {
            sku: 'PHONE-WHT-256',
            price: 9999.99,
            stock: 20,
            VariationOption: {
              create: [
                {
                  optionTypeId: colorOptionType.id,
                  value: 'Beyaz'
                },
                {
                  optionTypeId: sizeOptionType.id,
                  value: '256GB'
                }
              ]
            }
          }
        ]
      }
    },
    {
      name: 'Dizüstü Bilgisayar',
      slug: 'dizustu-bilgisayar',
      description: 'Güçlü işlemci, 16GB RAM, 512GB SSD, 15.6 inç ekran.',
      price: 15999.99,
      stock: 25,
      categoryId: elektronikBilgisayar.id,
      featured: true,
      brandId: brand1.id,
      metaTitle: 'Dizüstü Bilgisayar | Güçlü Performans',
      metaDescription: 'Yüksek performanslı dizüstü bilgisayarlar uygun fiyatlarla.',
      seller: {
        create: {
          sellerId: sellerUser.id,
          price: 1000,
          stock: 20,
          rating: 3.3,
        }
      },
      images: {
        create: [{
          url: '/images/products/laptop.jpg', isMain: true
        }]
      },
      variations: {
        create: [
          {
            sku: 'LAPTOP-i5',
            price: 15999.99,
            stock: 15,
            VariationOption: {
              create: [
                {
                  optionTypeId: sizeOptionType.id,
                  value: '15.6"'
                }
              ]
            }
          }
        ]
      }
    },
    {
      name: 'Kablosuz Kulaklık',
      slug: 'kablosuz-kulaklik',
      description: 'Gürültü önleyici, 30 saat pil ömrü, Bluetooth 5.0.',
      price: 1299.99,
      stock: 100,
      categoryId: elektronikTelefon.id,
      featured: false,
      brandId: brand1.id,
      seller: {
        create: {
          sellerId: sellerUser.id,
          price: 1000,
          stock: 20,
          rating: 3.3,
        }
      },
      images: {
        create: [{
          url: '/images/products/headphones.jpg', isMain: true
        }]
      }
    },
    {
      name: 'Erkek T-Shirt',
      slug: 'erkek-tshirt',
      description: '100% pamuk, rahat kesim, çeşitli renklerde.',
      price: 199.99,
      stock: 200,
      categoryId: giyim.id,
      featured: false,
      brandId: brand2.id,
      seller: {
        create: {
          sellerId: sellerUser.id,
          price: 1000,
          stock: 20,
          rating: 3.3,
        }
      },
      images: {
        create: [{
          url: '/images/products/tshirt.jpg', isMain: true
        }]
      }
    },
    {
      name: 'Kadın Elbise',
      slug: 'kadin-elbise',
      description: 'Şık tasarım, rahat kumaş, günlük kullanım için ideal.',
      price: 349.99,
      stock: 75,
      categoryId: giyim.id,
      featured: true,
      brandId: brand2.id,
      seller: {
        create: {
          sellerId: sellerUser.id,
          price: 1000,
          stock: 20,
          rating: 3.3,
        }
      },
      images: {
        create: [{
          url: '/images/products/dress.jpg', isMain: true
        }]
      }
    },
    {
      name: 'Spor Ayakkabı',
      slug: 'spor-ayakkabi',
      description: 'Hafif, esnek, koşu ve günlük kullanım için uygun.',
      price: 799.99,
      stock: 120,
      categoryId: spor.id,
      featured: true,
      brandId: brand2.id,
      seller: {
        create: {
          sellerId: sellerUser.id,
          price: 1000,
          stock: 20,
          rating: 3.3,
        }
      },
      images: {
        create: [{
          url: '/images/products/shoes.jpg', isMain: true
        }]
      }
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  // Örnek sipariş ve ödeme oluştur
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      totalAmount: 8999.99,
      status: 'PENDING',
      shippingAddress: 'Test Adres 1',
      billingAddress: 'Test Adres 1',
      items: {
        create: [
          {
            productId: (await prisma.product.findUnique({ where: { slug: 'akilli-telefon' } }))!.id,
            quantity: 1,
            price: 8999.99,
            subtotal: 8999.99
          }
        ]
      },
      payment: {
        create: {
          method: 'Kredi Kartı',
          status: 'PENDING',
          provider: 'Stripe',
          transactionId: 'test_transaction'
        }
      }
    }
  });

  console.log('Örnek sipariş oluşturuldu:', order.id);

  console.log('Seed tamamlandı!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
