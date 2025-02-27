import Iyzipay from "iyzipay";

// İyzico yapılandırması
const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY || "",
  secretKey: process.env.IYZICO_SECRET_KEY || "",
  uri: process.env.IYZICO_URI || "https://sandbox-api.iyzipay.com",
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
    phone: string;
    registrationAddress: string;
    city: string;
    country: string;
    ip: string;
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
    category2?: string;
    itemType: string;
    price: string;
  }>;
}): Promise<IyzipayResult> => {
  return new Promise((resolve, reject) => {
    const request = {
      locale: paymentData.locale || Iyzipay.LOCALE.TR,
      conversationId: paymentData.conversationId,
      price: paymentData.price,
      paidPrice: paymentData.paidPrice,
      currency: paymentData.currency || Iyzipay.CURRENCY.TRY,
      basketId: paymentData.basketId,
      paymentGroup: paymentData.paymentGroup || Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: paymentData.callbackUrl,
      enabledInstallments: paymentData.enabledInstallments || [1, 2, 3, 6, 9],
      buyer: paymentData.buyer,
      shippingAddress: paymentData.shippingAddress,
      billingAddress: paymentData.billingAddress,
      basketItems: paymentData.basketItems,
    };

    iyzipay.checkoutFormInitialize.create(request, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result as IyzipayResult);
      }
    });
  });
};

/**
 * İyzico ödeme sonucunu alır
 * @param token Ödeme token'ı
 * @returns Ödeme sonucu
 */
export const retrievePaymentResult = (token: string): Promise<IyzipayResult> => {
  return new Promise((resolve, reject) => {
    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: new Date().getTime().toString(),
      token: token,
    };

    iyzipay.checkoutForm.retrieve(request, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result as IyzipayResult);
      }
    });
  });
}; 