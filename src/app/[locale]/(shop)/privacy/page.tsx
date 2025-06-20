export default async function PrivacyPage() {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'Şirket Adı';
  const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'info@example.com';
  const companyAddress = process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'Şirket Adresi';
  const companyPhone = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+90 123 456 7890';
  const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://example.com';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Gizlilik Politikası</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Giriş</h2>
          <p>
            {companyName} olarak, gizliliğinize saygı duyuyor ve kişisel verilerinizin korunmasına önem veriyoruz. 
            Bu gizlilik politikası, web sitemizi kullanırken kişisel verilerinizin nasıl toplandığını, 
            kullanıldığını ve korunduğunu açıklamaktadır.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Toplanan Bilgiler</h2>
          <p>Web sitemizi kullanırken aşağıdaki bilgileri toplayabiliriz:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Ad, soyad ve iletişim bilgileri</li>
            <li>Ödeme bilgileri</li>
            <li>Sipariş geçmişi</li>
            <li>IP adresi ve tarayıcı bilgileri</li>
            <li>Çerezler aracılığıyla toplanan bilgiler</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Bilgilerin Kullanımı</h2>
          <p>Topladığımız bilgileri aşağıdaki amaçlar için kullanıyoruz:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Siparişlerinizi işlemek ve teslim etmek</li>
            <li>Müşteri hizmetleri sağlamak</li>
            <li>Ürün ve hizmetlerimizi geliştirmek</li>
            <li>Yasal yükümlülüklerimizi yerine getirmek</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Bilgi Güvenliği</h2>
          <p>
            Kişisel verilerinizin güvenliği bizim için önemlidir. Verilerinizi korumak için uygun teknik 
            ve organizasyonel önlemler alıyoruz. Ancak, internet üzerinden hiçbir veri iletiminin 
            %100 güvenli olmadığını unutmayın.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Çerezler</h2>
          <p>
            Web sitemizde çerezler kullanıyoruz. Çerezler, web sitemizi daha iyi bir deneyim sunmak 
            için kullanılan küçük metin dosyalarıdır. Tarayıcı ayarlarınızı değiştirerek çerezleri 
            devre dışı bırakabilirsiniz.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. İletişim</h2>
          <p>
            Gizlilik politikamız hakkında sorularınız veya endişeleriniz varsa, lütfen bizimle iletişime geçin:
          </p>
          <div className="mt-4">
            <p><strong>Şirket:</strong> {companyName}</p>
            <p><strong>E-posta:</strong> {companyEmail}</p>
            <p><strong>Adres:</strong> {companyAddress}</p>
            <p><strong>Telefon:</strong> {companyPhone}</p>
            <p><strong>Web Sitesi:</strong> {websiteUrl}</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Güncellemeler</h2>
          <p>
            Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler olduğunda, 
            web sitemizde bir bildirim yayınlayacağız.
          </p>
          <p className="mt-4">
            <strong>Son güncelleme tarihi:</strong> {new Date().toLocaleDateString('tr-TR')}
          </p>
        </section>
      </div>
    </div>
  );
} 