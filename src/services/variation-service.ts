import { db } from '@/lib/db';
import { Variation, VariationOption, OptionType } from '@prisma/client';

export interface VariationWithOptions extends Variation {
  VariationOption: (VariationOption & {
    optionType: OptionType;
  })[];
}

export const variationService = {
  /**
   * Bir ürüne ait tüm varyasyonları getirir
   */
  async getVariationsByProductId(productId: string): Promise<VariationWithOptions[]> {
    return db.variation.findMany({
      where: { productId },
      include: {
        VariationOption: {
          include: {
            optionType: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  /**
   * Belirli bir varyasyonu ID'ye göre getirir
   */
  async getVariationById(id: string): Promise<VariationWithOptions | null> {
    return db.variation.findUnique({
      where: { id },
      include: {
        VariationOption: {
          include: {
            optionType: true,
          },
        },
      },
    });
  },

  /**
   * Yeni bir varyasyon oluşturur
   */
  async createVariation(data: {
    productId: string;
    name?: string;
    sku: string;
    price: number;
    stock: number;
    options?: { optionType: string; value: string }[];
  }): Promise<VariationWithOptions> {
    // Önce varyasyonu oluştur
    const variation = await db.variation.create({
      data: {
        productId: data.productId,
        name: data.name,
        sku: data.sku,
        price: data.price,
        stock: data.stock,
      },
      include: {
        VariationOption: {
          include: {
            optionType: true,
          },
        },
      },
    });

    // Eğer seçenekler varsa, bunları ekle
    if (data.options && data.options.length > 0) {
      for (const option of data.options) {
        // Önce option type'ı bul veya oluştur
        let optionType = await db.optionType.findFirst({
          where: { name: option.optionType },
        });

        if (!optionType) {
          optionType = await db.optionType.create({
            data: { name: option.optionType },
          });
        }

        // Varyasyon seçeneğini oluştur
        await db.variationOption.create({
          data: {
            variationId: variation.id,
            optionTypeId: optionType.id,
            value: option.value,
          },
        });
      }

      // Güncellenmiş varyasyonu getir
      return this.getVariationById(variation.id) as Promise<VariationWithOptions>;
    }

    return variation;
  },

  /**
   * Varyasyon günceller
   */
  async updateVariation(
    id: string,
    data: {
      name?: string;
      sku?: string;
      price?: number;
      stock?: number;
    }
  ): Promise<VariationWithOptions> {
    return db.variation.update({
      where: { id },
      data,
      include: {
        VariationOption: {
          include: {
            optionType: true,
          },
        },
      },
    });
  },

  /**
   * Varyasyon siler
   */
  async deleteVariation(id: string): Promise<Variation> {
    // Önce varyasyon seçeneklerini sil
    await db.variationOption.deleteMany({
      where: { variationId: id },
    });

    // Sonra varyasyonu sil
    return db.variation.delete({
      where: { id },
    });
  },

  /**
   * Varyasyon seçeneği ekler
   */
  async addVariationOption(data: {
    variationId: string;
    optionType: string;
    value: string;
  }): Promise<VariationOption> {
    // Önce option type'ı bul veya oluştur
    let optionType = await db.optionType.findFirst({
      where: { name: data.optionType },
    });

    if (!optionType) {
      optionType = await db.optionType.create({
        data: { name: data.optionType },
      });
    }

    // Varyasyon seçeneğini oluştur
    return db.variationOption.create({
      data: {
        variationId: data.variationId,
        optionTypeId: optionType.id,
        value: data.value,
      },
    });
  },

  /**
   * Varyasyon seçeneği günceller
   */
  async updateVariationOption(
    id: string,
    data: {
      value?: string;
    }
  ): Promise<VariationOption> {
    return db.variationOption.update({
      where: { id },
      data,
    });
  },

  /**
   * Varyasyon seçeneği siler
   */
  async deleteVariationOption(id: string): Promise<VariationOption> {
    return db.variationOption.delete({
      where: { id },
    });
  },

  /**
   * Tüm seçenek tiplerini getirir
   */
  async getAllOptionTypes(): Promise<OptionType[]> {
    return db.optionType.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  },

  /**
   * Yeni bir seçenek tipi oluşturur
   */
  async createOptionType(name: string): Promise<OptionType> {
    return db.optionType.create({
      data: { name },
    });
  },

  /**
   * Bir ürün için varsayılan varyasyon oluşturur
   */
  async createDefaultVariation(productId: string, price: number): Promise<Variation> {
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { name: true },
    });

    if (!product) {
      throw new Error('Ürün bulunamadı');
    }

    // Ürün adından SKU oluştur
    const sku = product.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    return db.variation.create({
      data: {
        productId,
        name: 'Varsayılan',
        sku: `${sku}-default`,
        price,
        stock: 0,
      },
    });
  },
};
