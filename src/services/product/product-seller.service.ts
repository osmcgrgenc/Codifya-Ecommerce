import { db } from '@/lib/db';
import { ProductSeller } from '@prisma/client';
import { ProductSellerData, UpdateProductSellerData } from './types';
import { ensureServer, handleServiceError } from './utils';

/**
 * Ürün satıcıları servisi
 * Ürün satıcılarının eklenmesi, güncellenmesi ve silinmesi işlemlerini yönetir
 */
export const productSellerService = {
  /**
   * Ürün satıcısı ekler
   * @param data - Satıcı verileri
   * @returns Eklenen satıcı
   */
  async addProductSeller(data: ProductSellerData): Promise<ProductSeller> {
    ensureServer();
    
    try {
      return await db.productSeller.create({
        data,
      });
    } catch (error) {
      return handleServiceError(error, 'Ürün satıcısı eklenirken hata oluştu');
    }
  },

  /**
   * Ürün satıcısı günceller
   * @param productId - Ürün ID'si
   * @param sellerId - Satıcı ID'si
   * @param data - Güncellenecek veriler
   * @returns Güncellenen satıcı
   */
  async updateProductSeller(
    productId: string,
    sellerId: string,
    data: UpdateProductSellerData
  ): Promise<ProductSeller> {
    ensureServer();
    
    try {
      return await db.productSeller.update({
        where: {
          productId_sellerId: {
            productId,
            sellerId,
          },
        },
        data,
      });
    } catch (error) {
      return handleServiceError(error, 'Ürün satıcısı güncellenirken hata oluştu');
    }
  },

  /**
   * Ürün satıcısı siler
   * @param productId - Ürün ID'si
   * @param sellerId - Satıcı ID'si
   * @returns Silinen satıcı
   */
  async deleteProductSeller(productId: string, sellerId: string): Promise<ProductSeller> {
    ensureServer();
    
    try {
      return await db.productSeller.delete({
        where: {
          productId_sellerId: {
            productId,
            sellerId,
          },
        },
      });
    } catch (error) {
      return handleServiceError(error, 'Ürün satıcısı silinirken hata oluştu');
    }
  },
  
  /**
   * Ürüne ait tüm satıcıları getirir
   * @param productId - Ürün ID'si
   * @returns Satıcılar listesi
   */
  async getProductSellers(productId: string): Promise<ProductSeller[]> {
    try {
      return await db.productSeller.findMany({
        where: { productId },
        orderBy: { price: 'asc' },
      });
    } catch (error) {
      console.error('Ürün satıcıları getirilirken hata oluştu:', error);
      return [];
    }
  },
  
  /**
   * Satıcıya ait tüm ürünleri getirir
   * @param sellerId - Satıcı ID'si
   * @returns Satıcı ürünleri listesi
   */
  async getSellerProducts(sellerId: string): Promise<ProductSeller[]> {
    try {
      return await db.productSeller.findMany({
        where: { sellerId },
        include: {
          product: {
            include: {
              images: {
                where: { isMain: true },
                take: 1,
              },
              category: true,
            },
          },
        },
        orderBy: { price: 'asc' },
      });
    } catch (error) {
      console.error('Satıcı ürünleri getirilirken hata oluştu:', error);
      return [];
    }
  },
  
  /**
   * En iyi fiyatlı satıcıyı getirir
   * @param productId - Ürün ID'si
   * @returns En iyi fiyatlı satıcı veya null
   */
  async getBestPriceSeller(productId: string): Promise<ProductSeller | null> {
    try {
      return await db.productSeller.findFirst({
        where: { 
          productId,
          stock: { gt: 0 } // Stokta olan satıcılar
        },
        orderBy: { price: 'asc' },
      });
    } catch (error) {
      console.error('En iyi fiyatlı satıcı getirilirken hata oluştu:', error);
      return null;
    }
  }
}; 