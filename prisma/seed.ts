/* eslint-disable no-console */
const { PrismaClient, UserRole } = require('@prisma/client');
const bcrypt = require('bcrypt');

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
    },
  });
  console.log('Normal kullanıcı oluşturuldu:', user.email);

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

  // Ürünler oluştur
  const products = [
    {
      name: 'Akıllı Telefon',
      slug: 'akilli-telefon',
      description: 'Yüksek performanslı akıllı telefon, 6.5 inç ekran, 128GB depolama, 8GB RAM.',
      price: 8999.99,
      stock: 50,
      image: '/images/products/smartphone.jpg',
      categoryId: elektronik.id,
      featured: true,
    },
    {
      name: 'Dizüstü Bilgisayar',
      slug: 'dizustu-bilgisayar',
      description: 'Güçlü işlemci, 16GB RAM, 512GB SSD, 15.6 inç ekran.',
      price: 15999.99,
      stock: 25,
      image: '/images/products/laptop.jpg',
      categoryId: elektronik.id,
      featured: true,
    },
    {
      name: 'Kablosuz Kulaklık',
      slug: 'kablosuz-kulaklik',
      description: 'Gürültü önleyici, 30 saat pil ömrü, Bluetooth 5.0.',
      price: 1299.99,
      stock: 100,
      image: '/images/products/headphones.jpg',
      categoryId: elektronik.id,
      featured: false,
    },
    {
      name: 'Erkek T-Shirt',
      slug: 'erkek-tshirt',
      description: '100% pamuk, rahat kesim, çeşitli renklerde.',
      price: 199.99,
      stock: 200,
      image: '/images/products/tshirt.jpg',
      categoryId: giyim.id,
      featured: false,
    },
    {
      name: 'Kadın Elbise',
      slug: 'kadin-elbise',
      description: 'Şık tasarım, rahat kumaş, günlük kullanım için ideal.',
      price: 349.99,
      stock: 75,
      image: '/images/products/dress.jpg',
      categoryId: giyim.id,
      featured: true,
    },
    {
      name: 'Spor Ayakkabı',
      slug: 'spor-ayakkabi',
      description: 'Hafif, esnek, koşu ve günlük kullanım için uygun.',
      price: 799.99,
      stock: 120,
      image: '/images/products/shoes.jpg',
      categoryId: spor.id,
      featured: true,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log('Ürünler oluşturuldu');

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
