'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface CheckoutContentProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

interface AddressForm {
  contactName: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
}

export default function CheckoutContent({ user }: CheckoutContentProps) {
  const router = useRouter();
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('iyzico');
  const [shippingAddress, setShippingAddress] = useState<AddressForm>({
    contactName: user.name || '',
    address: '',
    city: '',
    country: 'Türkiye',
    zipCode: '',
  });
  const [billingAddress, setBillingAddress] = useState<AddressForm>({
    contactName: user.name || '',
    address: '',
    city: '',
    country: 'Türkiye',
    zipCode: '',
  });
  const [sameAsShipping, setSameAsShipping] = useState(true);

  // Sepet boşsa ana sayfaya yönlendir
  if (totalItems === 0) {
    router.push('/');
    return null;
  }

  // Adres formunu güncelle
  const handleShippingAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));

    // Fatura adresi aynıysa, onu da güncelle
    if (sameAsShipping) {
      setBillingAddress(prev => ({ ...prev, [name]: value }));
    }
  };

  // Fatura adresi formunu güncelle
  const handleBillingAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingAddress(prev => ({ ...prev, [name]: value }));
  };

  // Fatura adresi aynı mı değişikliğini işle
  const handleSameAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSameAsShipping(checked);

    if (checked) {
      setBillingAddress(shippingAddress);
    }
  };

  // Ödeme işlemini başlat
  const handlePayment = async () => {
    // Form doğrulama
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Ödeme yöntemine göre API endpoint'i belirle
      const endpoint =
        paymentMethod === 'iyzico' ? '/api/payment/iyzico' : '/api/payment/bank-transfer';

      // Ödeme isteği gönder
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          totalAmount: totalPrice,
          shippingAddress,
          billingAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ödeme işlemi başlatılırken bir hata oluştu.');
      }

      // İyzico ödeme sayfasına yönlendir
      if (paymentMethod === 'iyzico' && data.paymentPageUrl) {
        router.push(data.paymentPageUrl);
        return;
      }

      // Banka transferi için başarı sayfasına yönlendir
      if (paymentMethod === 'bank-transfer') {
        // Sepeti temizle
        clearCart();

        // Başarı sayfasına yönlendir
        router.push(
          `/orders/bank-transfer?orderId=${data.orderId}&referenceCode=${data.referenceCode}`
        );
      }
    } catch (error) {
      console.error('Ödeme işlemi hatası:', error);
      toast.error('Ödeme işlemi başlatılırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  // Form doğrulama
  const validateForm = () => {
    // Teslimat adresi doğrulama
    if (!shippingAddress.contactName || !shippingAddress.address || !shippingAddress.city) {
      toast.error('Lütfen teslimat adresini eksiksiz doldurun.');
      return false;
    }

    // Fatura adresi doğrulama (farklıysa)
    if (
      !sameAsShipping &&
      (!billingAddress.contactName || !billingAddress.address || !billingAddress.city)
    ) {
      toast.error('Lütfen fatura adresini eksiksiz doldurun.');
      return false;
    }

    return true;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Sol taraf - Adres ve Ödeme Bilgileri */}
      <div className="md:col-span-2 space-y-6">
        {/* Teslimat Adresi */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Teslimat Adresi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="shipping-contactName">Ad Soyad</Label>
              <Input
                id="shipping-contactName"
                name="contactName"
                value={shippingAddress.contactName}
                onChange={handleShippingAddressChange}
                placeholder="Ad Soyad"
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="shipping-address">Adres</Label>
              <Input
                id="shipping-address"
                name="address"
                value={shippingAddress.address}
                onChange={handleShippingAddressChange}
                placeholder="Adres"
                required
              />
            </div>
            <div>
              <Label htmlFor="shipping-city">Şehir</Label>
              <Input
                id="shipping-city"
                name="city"
                value={shippingAddress.city}
                onChange={handleShippingAddressChange}
                placeholder="Şehir"
                required
              />
            </div>
            <div>
              <Label htmlFor="shipping-zipCode">Posta Kodu</Label>
              <Input
                id="shipping-zipCode"
                name="zipCode"
                value={shippingAddress.zipCode}
                onChange={handleShippingAddressChange}
                placeholder="Posta Kodu"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="shipping-country">Ülke</Label>
              <Input
                id="shipping-country"
                name="country"
                value={shippingAddress.country}
                onChange={handleShippingAddressChange}
                placeholder="Ülke"
                required
              />
            </div>
          </div>
        </div>

        {/* Fatura Adresi */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Fatura Adresi</h2>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="same-address"
                checked={sameAsShipping}
                onChange={handleSameAddressChange}
                className="mr-2"
              />
              <Label htmlFor="same-address" className="text-sm cursor-pointer">
                Teslimat adresi ile aynı
              </Label>
            </div>
          </div>

          {!sameAsShipping && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="billing-contactName">Ad Soyad</Label>
                <Input
                  id="billing-contactName"
                  name="contactName"
                  value={billingAddress.contactName}
                  onChange={handleBillingAddressChange}
                  placeholder="Ad Soyad"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="billing-address">Adres</Label>
                <Input
                  id="billing-address"
                  name="address"
                  value={billingAddress.address}
                  onChange={handleBillingAddressChange}
                  placeholder="Adres"
                  required
                />
              </div>
              <div>
                <Label htmlFor="billing-city">Şehir</Label>
                <Input
                  id="billing-city"
                  name="city"
                  value={billingAddress.city}
                  onChange={handleBillingAddressChange}
                  placeholder="Şehir"
                  required
                />
              </div>
              <div>
                <Label htmlFor="billing-zipCode">Posta Kodu</Label>
                <Input
                  id="billing-zipCode"
                  name="zipCode"
                  value={billingAddress.zipCode}
                  onChange={handleBillingAddressChange}
                  placeholder="Posta Kodu"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="billing-country">Ülke</Label>
                <Input
                  id="billing-country"
                  name="country"
                  value={billingAddress.country}
                  onChange={handleBillingAddressChange}
                  placeholder="Ülke"
                  required
                />
              </div>
            </div>
          )}
        </div>

        {/* Ödeme Yöntemi */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Ödeme Yöntemi</h2>
          <Tabs defaultValue="iyzico" onValueChange={setPaymentMethod}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="iyzico">Kredi Kartı (İyzico)</TabsTrigger>
              <TabsTrigger value="bank-transfer">Banka Transferi / EFT</TabsTrigger>
            </TabsList>
            <TabsContent value="iyzico" className="mt-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  İyzico güvenli ödeme altyapısı ile kredi kartı bilgileriniz güvenle işlenecektir.
                  Ödeme onayından sonra, kredi kartı bilgilerinizi girmeniz için İyzico ödeme
                  sayfasına yönlendirileceksiniz.
                </p>
                <div className="mt-4 flex items-center space-x-2">
                  <img src="/images/visa.svg" alt="Visa" className="h-8" />
                  <img src="/images/mastercard.svg" alt="Mastercard" className="h-8" />
                  <img src="/images/amex.svg" alt="American Express" className="h-8" />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="bank-transfer" className="mt-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  Banka havalesi veya EFT ile ödeme yapmayı seçtiniz. Siparişiniz onaylandıktan
                  sonra, size özel bir referans kodu ve banka hesap bilgileri verilecektir.
                  Ödemenizi yaparken bu referans kodunu belirtmeyi unutmayın.
                </p>
                <div className="mt-4">
                  <p className="text-sm font-medium">Banka Bilgileri:</p>
                  <p className="text-sm">Türkiye İş Bankası</p>
                  <p className="text-sm">Codifya E-Ticaret A.Ş.</p>
                  <p className="text-sm">IBAN: TR12 3456 7890 1234 5678 9012 34</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Sağ taraf - Sipariş Özeti */}
      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-4">
          <h2 className="text-xl font-semibold mb-4">Sipariş Özeti</h2>

          {/* Ürünler */}
          <div className="space-y-3 mb-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span className="font-medium">
                  {(item.price * item.quantity).toLocaleString('tr-TR', {
                    style: 'currency',
                    currency: 'TRY',
                  })}
                </span>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Toplam */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Ara Toplam</span>
              <span className="font-medium">
                {totalPrice.toLocaleString('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Kargo</span>
              <span className="font-medium">Ücretsiz</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Toplam</span>
              <span>
                {totalPrice.toLocaleString('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                })}
              </span>
            </div>
          </div>

          {/* Ödeme Butonu */}
          <Button className="w-full mt-6" size="lg" onClick={handlePayment} disabled={isLoading}>
            {isLoading ? 'İşleniyor...' : 'Ödemeyi Tamamla'}
          </Button>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Ödemeyi tamamlayarak, Satış Sözleşmesi ve Gizlilik Politikası&apos;nı kabul etmiş
            olursunuz.
          </p>
        </div>
      </div>
    </div>
  );
}
