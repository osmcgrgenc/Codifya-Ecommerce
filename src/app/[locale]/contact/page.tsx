import { Metadata } from 'next';
import { ContactForm } from '@/components/contact/contact-form';
import { Container } from '@/components/ui/container';

export const metadata: Metadata = {
  title: 'İletişim - Codifya E-Ticaret',
  description: 'Sorularınız, önerileriniz veya şikayetleriniz için bizimle iletişime geçin.',
};

export default function ContactPage() {
  return (
    <Container className="py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Bizimle İletişime Geçin</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">İletişim Bilgilerimiz</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Adres</h3>
                <p className="text-muted-foreground">
                  Codifya Plaza, Teknoloji Caddesi No:123
                  <br />
                  Dijital Mahallesi, 34000
                  <br />
                  İstanbul, Türkiye
                </p>
              </div>

              <div>
                <h3 className="font-medium">Telefon</h3>
                <p className="text-muted-foreground">+90 (212) 123 45 67</p>
              </div>

              <div>
                <h3 className="font-medium">E-posta</h3>
                <p className="text-muted-foreground">info@codifya-ecommerce.com</p>
              </div>

              <div>
                <h3 className="font-medium">Çalışma Saatleri</h3>
                <p className="text-muted-foreground">
                  Pazartesi - Cuma: 09:00 - 18:00
                  <br />
                  Cumartesi: 10:00 - 15:00
                  <br />
                  Pazar: Kapalı
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Mesaj Gönderin</h2>
            <ContactForm />
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Konum</h2>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Harita burada görüntülenecek</p>
          </div>
        </div>
      </div>
    </Container>
  );
}
