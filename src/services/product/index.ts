import { productQueryService } from './product-query.service';
import { productMutationService } from './product-mutation.service';
import { productImageService } from './product-image.service';
import { productSellerService } from './product-seller.service';
import { calculateTotalStock } from './utils';

/**
 * Ürün servisi
 * Tüm ürün işlemlerini tek bir arayüz üzerinden sunar
 */
export const productService = {
  // Ürün sorgulama işlemleri
  getAllProducts: productQueryService.getAllProducts,
  getPaginatedProducts: productQueryService.getPaginatedProducts,
  getFeaturedProducts: productQueryService.getFeaturedProducts,
  getProductsByCategory: productQueryService.getProductsByCategory,
  getProductById: productQueryService.getProductById,
  getProductBySlug: productQueryService.getProductBySlug,
  searchProducts: productQueryService.searchProducts,
  getProductsForListing: productQueryService.getProductsForListing,

  // Ürün mutasyon işlemleri
  createProduct: productMutationService.createProduct,
  updateProduct: productMutationService.updateProduct,
  deleteProduct: productMutationService.deleteProduct,

  // Ürün görselleri işlemleri
  addProductImage: productImageService.addProductImage,
  updateProductImage: productImageService.updateProductImage,
  deleteProductImage: productImageService.deleteProductImage,
  getProductImages: productImageService.getProductImages,
  getMainProductImage: productImageService.getMainProductImage,
  addMultipleProductImages: productImageService.addMultipleProductImages,

  // Ürün satıcıları işlemleri
  addProductSeller: productSellerService.addProductSeller,
  updateProductSeller: productSellerService.updateProductSeller,
  deleteProductSeller: productSellerService.deleteProductSeller,
  getProductSellers: productSellerService.getProductSellers,
  getSellerProducts: productSellerService.getSellerProducts,
  getBestPriceSeller: productSellerService.getBestPriceSeller,

  // Yardımcı fonksiyonlar
  calculateTotalStock,
};

// Tip tanımlamalarını dışa aktar
export * from './types';

// Varsayılan olarak productService'i dışa aktar
export default productService;
