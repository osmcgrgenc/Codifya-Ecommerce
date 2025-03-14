import { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/container';

export const metadata: Metadata = {
  title: 'Hakkımızda - Codifya E-Ticaret',
  description: 'Codifya E-Ticaret hakkında bilgi edinin. Vizyonumuz, misyonumuz ve değerlerimiz.',
};

// Bu fonksiyon sunucu tarafında çalışacak
async function getCompanyStats() {
  // Gerçek bir API çağrısı yapılabilir
  // const res = await fetch('https://api.example.com/stats');
  // return res.json();

  // Simüle edilmiş veri
  await new Promise(resolve => setTimeout(resolve, 100)); // Simüle edilmiş gecikme

  return {
    foundedYear: 2015,
    customers: 50000,
    products: 5000,
    countries: 25,
    teamMembers: 120,
  };
}

export default async function AboutPage() {
  // Sunucu tarafında veri çekme
  const stats = await getCompanyStats();

  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Hakkımızda</h1>

        {/* Şirket Tanıtımı */}
        <section className="mb-12">
          <div className="prose max-w-none">
            <p className="text-lg mb-4">
              Codifya E-Ticaret, 2015 yılında teknoloji tutkunları tarafından kurulmuş, müşteri
              memnuniyetini ön planda tutan bir e-ticaret platformudur. Amacımız, kullanıcılarımıza
              en kaliteli ürünleri en uygun fiyatlarla sunmak ve alışveriş deneyimini en üst
              seviyeye çıkarmaktır.
            </p>
            <p className="mb-4">
              Geniş ürün yelpazemiz, güvenilir teslimat ağımız ve müşteri odaklı hizmet
              anlayışımızla sektörde fark yaratıyoruz. Teknolojik gelişmeleri yakından takip ederek
              platformumuzu sürekli geliştiriyor, müşterilerimize en iyi alışveriş deneyimini sunmak
              için çalışıyoruz.
            </p>
          </div>
        </section>

        {/* İstatistikler */}
        <section className="mb-12 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center">Rakamlarla Codifya</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-indigo-600">{stats.foundedYear}</p>
              <p className="text-sm text-gray-600">Kuruluş Yılı</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-indigo-600">
                {stats.customers.toLocaleString('tr-TR')}
              </p>
              <p className="text-sm text-gray-600">Mutlu Müşteri</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-indigo-600">
                {stats.products.toLocaleString('tr-TR')}
              </p>
              <p className="text-sm text-gray-600">Ürün Çeşidi</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-indigo-600">{stats.countries}</p>
              <p className="text-sm text-gray-600">Ülke</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-indigo-600">{stats.teamMembers}</p>
              <p className="text-sm text-gray-600">Takım Üyesi</p>
            </div>
          </div>
        </section>

        {/* Misyon ve Vizyon */}
        <section className="mb-12 grid md:grid-cols-2 gap-8">
          <div className="bg-indigo-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Misyonumuz</h2>
            <p>
              Müşterilerimize güvenilir, hızlı ve keyifli bir alışveriş deneyimi sunmak. Kaliteli
              ürünleri uygun fiyatlarla ulaştırarak, teknoloji ile geleneksel alışveriş anlayışını
              birleştirmek ve e-ticaret sektöründe öncü olmak.
            </p>
          </div>
          <div className="bg-indigo-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Vizyonumuz</h2>
            <p>
              Türkiye&apos;nin ve dünyanın önde gelen e-ticaret platformlarından biri olmak.
              Yenilikçi çözümler ve müşteri odaklı yaklaşımımızla sektöre yön veren, güvenilir ve
              tercih edilen bir marka haline gelmek.
            </p>
          </div>
        </section>

        {/* Ekip */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Yönetim Ekibimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative w-40 h-40 mx-auto mb-4 overflow-hidden rounded-full">
                <Image
                  src="/images/team/ceo.jpg"
                  alt="CEO"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className="font-medium">Ahmet Yılmaz</h3>
              <p className="text-sm text-gray-600">CEO & Kurucu</p>
            </div>
            <div className="text-center">
              <div className="relative w-40 h-40 mx-auto mb-4 overflow-hidden rounded-full">
                <Image
                  src="/images/team/cto.jpg"
                  alt="CTO"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className="font-medium">Mehmet Kaya</h3>
              <p className="text-sm text-gray-600">CTO</p>
            </div>
            <div className="text-center">
              <div className="relative w-40 h-40 mx-auto mb-4 overflow-hidden rounded-full">
                <Image
                  src="/images/team/cmo.jpg"
                  alt="CMO"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className="font-medium">Ayşe Demir</h3>
              <p className="text-sm text-gray-600">CMO</p>
            </div>
          </div>
        </section>

        {/* Değerlerimiz */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Değerlerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-full mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium mb-1">Güvenilirlik</h3>
                <p className="text-sm text-gray-600">
                  Müşterilerimizin güvenini kazanmak ve korumak en önemli önceliğimizdir.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-full mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium mb-1">Yenilikçilik</h3>
                <p className="text-sm text-gray-600">
                  Sürekli gelişim ve yenilikçi çözümlerle sektöre öncülük ediyoruz.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-full mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium mb-1">Müşteri Odaklılık</h3>
                <p className="text-sm text-gray-600">
                  Her kararımızda müşteri memnuniyetini ön planda tutuyoruz.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-full mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.5"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium mb-1">Sürdürülebilirlik</h3>
                <p className="text-sm text-gray-600">
                  Çevreye duyarlı iş süreçleri ve sosyal sorumluluk projeleriyle geleceğe yatırım
                  yapıyoruz.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Container>
  );
}
