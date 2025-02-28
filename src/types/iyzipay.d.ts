declare module 'iyzipay' {
  export interface IyzipayConfig {
    apiKey: string;
    secretKey: string;
    uri: string;
  }

  export interface Address {
    contactName: string;
    city: string;
    country: string;
    address: string;
    zipCode?: string;
  }

  export interface Buyer {
    id: string;
    name: string;
    surname: string;
    identityNumber: string;
    email: string;
    gsmNumber?: string;
    registrationDate?: string;
    lastLoginDate?: string;
    registrationAddress?: string;
    city?: string;
    country?: string;
    zipCode?: string;
    ip: string;
  }

  export interface BasketItem {
    id: string;
    name: string;
    category1: string;
    category2?: string;
    itemType: string;
    price: number;
    subMerchantKey?: string;
    subMerchantPrice?: number;
  }

  export interface CheckoutFormInitializeRequest {
    locale?: string;
    conversationId?: string;
    price: string;
    paidPrice: string;
    currency: string;
    basketId: string;
    paymentGroup?: string;
    callbackUrl: string;
    enabledInstallments?: number[];
    buyer: Buyer;
    shippingAddress: Address;
    billingAddress: Address;
    basketItems: BasketItem[];
  }

  export interface CheckoutFormRetrieveRequest {
    locale?: string;
    conversationId?: string;
    token: string;
  }

  export interface IyzipayError {
    status: string;
    errorCode: string;
    errorMessage: string;
    errorGroup: string;
    locale: string;
    systemTime: number;
    conversationId: string;
  }

  export interface IyzipayResult {
    status: string;
    locale: string;
    systemTime: number;
    conversationId: string;
    token: string;
    checkoutFormContent: string;
    tokenExpireTime: number;
    paymentPageUrl: string;
    [key: string]: string | number | boolean | null | undefined;
  }

  export default class Iyzipay {
    constructor(config: IyzipayConfig);

    static readonly LOCALE: {
      TR: string;
      EN: string;
    };

    static readonly CURRENCY: {
      TRY: string;
      EUR: string;
      USD: string;
      GBP: string;
    };

    static readonly PAYMENT_GROUP: {
      PRODUCT: string;
      LISTING: string;
      SUBSCRIPTION: string;
    };

    static readonly BASKET_ITEM_TYPE: {
      PHYSICAL: string;
      VIRTUAL: string;
    };

    checkoutFormInitialize: {
      create: (
        data: CheckoutFormInitializeRequest,
        callback: (err: IyzipayError | null, result: IyzipayResult | null) => void
      ) => void;
    };

    checkoutForm: {
      retrieve: (
        data: CheckoutFormRetrieveRequest,
        callback: (err: IyzipayError | null, result: IyzipayResult | null) => void
      ) => void;
    };
  }
}
