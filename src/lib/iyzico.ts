import Iyzipay from 'iyzipay';

// İyzico yapılandırması
const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY || '',
  secretKey: process.env.IYZICO_SECRET_KEY || '',
  uri: process.env.IYZICO_URI || 'https://sandbox-api.iyzipay.com',
});

// Tip tanımlamaları
interface IyzipayResult {
  status: string;
  locale: string;
  systemTime: number;
  conversationId: string;
  token?: string;
  checkoutFormContent?: string;
  tokenExpireTime?: number;
  paymentPageUrl?: string;
  paymentId?: string;
  [key: string]: any;
}

/**
 * İyzico ödeme formu oluşturur
 * @param paymentData Ödeme verileri
 * @returns Ödeme formu sonucu
 */
export const createPaymentForm = (paymentData: {
  locale?: string;
  conversationId: string;
  price: string;
  paidPrice: string;
  currency: string;
  basketId: string;
  paymentGroup?: string;
  callbackUrl: string;
  enabledInstallments?: number[];
  buyer: {
    id: string;
    name: string;
    surname: string;
    identityNumber: string;
    email: string;
    gsmNumber: string;
    registrationAddress: string;
    city: string;
    country: string;
    ip: string;
    zipCode?: string;
  };
  shippingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
    zipCode: string;
  };
  billingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
    zipCode: string;
  };
  basketItems: Array<{
    id: string;
    name: string;
    category1: string;
    itemType: string;
    price: string;
  }>;
}) => {
  return new Promise<{ status: string; paymentPageUrl?: string; token?: string }>(
    (resolve, reject) => {
      iyzipay.checkoutFormInitialize.create(paymentData as any, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          if (result && result.status === 'success') {
            resolve({
              status: 'success',
              paymentPageUrl: result.paymentPageUrl,
              token: result.token,
            });
          } else {
            // eslint-disable-next-line no-console
            console.error('İyzico ödeme formu oluşturma başarısız:', result?.errorMessage);
            resolve({
              status: 'error',
              paymentPageUrl: undefined,
              token: undefined,
            });
          }
        }
      });
    }
  );
};

/**
 * İyzico ödeme sonucunu alır
 * @param token Ödeme token'ı
 * @returns Ödeme sonucu
 */
export const retrievePaymentResult = (token: string) => {
  return new Promise<any>((resolve, reject) => {
    iyzipay.checkoutForm.retrieve(
      {
        locale: 'tr',
        token: token,
      },
      (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};
