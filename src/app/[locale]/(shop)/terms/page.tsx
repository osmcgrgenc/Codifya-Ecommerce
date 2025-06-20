export default async function TermsPage() {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'Şirket Adı';
  const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'info@example.com';
  const companyAddress = process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'Şirket Adresi';
  const companyPhone = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+90 123 456 7890';
  const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://example.com';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Kullanım Koşulları</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Genel Hükümler</h2>
          <p>
            Bu web sitesini kullanarak, aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız. 
            {companyName} olarak, bu koşulları herhangi bir zamanda değiştirme hakkını saklı tutarız.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Hesap Oluşturma ve Güvenlik</h2>
          <p>Hesap oluştururken ve kullanırken aşağıdaki kurallara uymanız gerekmektedir:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Doğru ve güncel bilgiler sağlamak</li>
            <li>Hesap güvenliğinizi korumak</li>
            <li>Hesap bilgilerinizi başkalarıyla paylaşmamak</li>
            <li>Şüpheli aktiviteleri bize bildirmek</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Sipariş ve Ödeme Koşulları</h2>
          <p>Sipariş ve ödeme işlemlerinde aşağıdaki koşullar geçerlidir:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Ürün fiyatları ve stok durumu değişiklik gösterebilir</li>
            <li>Ödeme işlemleri güvenli ödeme sistemleri üzerinden yapılır</li>
            <li>Siparişler onaylandıktan sonra iptal edilemeyebilir</li>
            <li>Kargo ücretleri ve teslimat süreleri değişiklik gösterebilir</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Fikri Mülkiyet Hakları</h2>
          <p>
            Web sitemizdeki tüm içerikler (metin, görsel, logo, tasarım vb.) {companyName}&apos;nin 
            fikri mülkiyetidir. Bu içeriklerin izinsiz kullanımı, kopyalanması veya dağıtılması 
            yasaktır.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Sorumluluk Reddi</h2>
          <p>
            Web sitemizde sunulan bilgilerin doğruluğunu sağlamak için çaba gösteriyoruz, ancak 
            hatalar veya eksiklikler olabilir. {companyName}, bu tür hatalardan kaynaklanan 
            zararlardan sorumlu tutulamaz.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. İade ve İptal Politikası</h2>
          <p>
            Ürün iade ve iptal koşulları şu şekildedir:
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>Ürünler teslim alındıktan sonra 14 gün içinde iade edilebilir</li>
            <li>İade edilecek ürünler orijinal ambalajında ve kullanılmamış olmalıdır</li>
            <li>İade kargo ücretleri müşteriye aittir</li>
            <li>Özel üretim ürünlerde iade hakkı bulunmamaktadır</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. İletişim</h2>
          <p>
            Kullanım koşulları hakkında sorularınız veya endişeleriniz varsa, lütfen bizimle iletişime geçin:
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
          <h2 className="text-2xl font-semibold mb-4">8. Yürürlük</h2>
          <p>
            Bu kullanım koşulları, web sitemizi kullandığınız andan itibaren yürürlüğe girer. 
            Koşullarda yapılan değişiklikler, web sitemizde yayınlandığı tarihte geçerli olur.
          </p>
          <p className="mt-4">
            <strong>Son güncelleme tarihi:</strong> {new Date().toLocaleDateString('tr-TR')}
          </p>
        </section>
      </div>
    </div>
  );
} 