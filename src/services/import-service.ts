import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import { slugify } from '@/lib/utils';

const prisma = new PrismaClient();

export interface ImportResult {
  success: boolean;
  message: string;
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  errors: string[];
}

// İçe aktarma tipleri
export type ImportType = 'products' | 'categories' | 'brands' | 'variants';

export class ImportService {
  /**
   * Excel dosyasını okur ve JSON verisine dönüştürür
   */
  private async readExcelFile(file: File): Promise<any[]> {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(worksheet);
  }

  /**
   * Boş sonuç nesnesi oluşturur
   */
  private createEmptyResult(dataLength: number): ImportResult {
    return {
      success: true,
      message: 'İçe aktarma başarılı',
      totalProcessed: dataLength,
      successCount: 0,
      errorCount: 0,
      errors: [],
    };
  }

  /**
   * Hata sonucu oluşturur
   */
  private createErrorResult(error: Error): ImportResult {
    return {
      success: false,
      message: `İçe aktarma başarısız: ${error.message}`,
      totalProcessed: 0,
      successCount: 0,
      errorCount: 1,
      errors: [error.message],
    };
  }

  /**
   * Sonuç mesajını günceller
   */
  private finalizeResult(result: ImportResult): ImportResult {
    if (result.errorCount > 0) {
      result.message = `İçe aktarma tamamlandı, ${result.errorCount} hata oluştu.`;
    }
    return result;
  }

  /**
   * Ürünleri Excel dosyasından içe aktarır
   */
  async importProducts(file: File): Promise<ImportResult> {
    try {
      const data = await this.readExcelFile(file);
      const result = this.createEmptyResult(data.length);

      for (let index = 0; index < data.length; index++) {
        const row = data[index];
        try {
          const product = row as any;
          const rowNumber = index + 2; // Excel satır numarası (başlık satırı + 1)

          // Zorunlu alanları kontrol et
          this.validateRequiredFields(product, rowNumber, ['name', 'price']);

          // Slug oluştur
          const slug = product.slug || slugify(product.name);

          // Kategori kontrolü
          const categoryId = await this.findOrCreateCategory(product, rowNumber);

          // Marka kontrolü
          const brandId = await this.findOrCreateBrand(product, rowNumber);

          // Ürünü oluştur veya güncelle
          await this.createOrUpdateProduct(product, slug, categoryId, brandId, rowNumber);

          result.successCount++;
        } catch (error: any) {
          this.handleRowError(result, error);
        }
      }

      return this.finalizeResult(result);
    } catch (error: any) {
      return this.createErrorResult(error);
    }
  }

  /**
   * Zorunlu alanları kontrol eder
   */
  private validateRequiredFields(row: any, rowNumber: number, fields: string[]): void {
    for (const field of fields) {
      if (!row[field]) {
        throw new Error(`Satır ${rowNumber}: ${field} alanı eksik`);
      }
    }
  }

  /**
   * Kategoriyi bulur veya oluşturur
   */
  private async findOrCreateCategory(product: any, rowNumber: number): Promise<string | null> {
    if (!product.categoryName) return null;

    const category = await prisma.category.findFirst({
      where: { name: product.categoryName },
    });

    if (!category && product.createCategoryIfNotExists) {
      // Kategori yoksa ve oluşturulması isteniyorsa oluştur
      const newCategory = await prisma.category.create({
        data: {
          name: product.categoryName,
          slug: slugify(product.categoryName),
          description: product.categoryDescription || '',
        },
      });
      return newCategory.id;
    } else if (category) {
      return category.id;
    }

    return null;
  }

  /**
   * Markayı bulur veya oluşturur
   */
  private async findOrCreateBrand(product: any, rowNumber: number): Promise<string | null> {
    if (!product.brandName) return null;

    const brand = await prisma.brand.findFirst({
      where: { name: product.brandName },
    });

    if (!brand && product.createBrandIfNotExists) {
      // Marka yoksa ve oluşturulması isteniyorsa oluştur
      const newBrand = await prisma.brand.create({
        data: {
          name: product.brandName,
          slug: slugify(product.brandName),
          description: product.brandDescription || '',
        },
      });
      return newBrand.id;
    } else if (brand) {
      return brand.id;
    }

    return null;
  }

  /**
   * Ürünü oluşturur veya günceller
   */
  private async createOrUpdateProduct(
    product: any,
    slug: string,
    categoryId: string | null,
    brandId: string | null,
    rowNumber: number
  ): Promise<void> {
    // Prisma şemasına uygun olarak alanları eşleştir
    const existingProduct = await prisma.product.findFirst({
      where: {
        OR: [{ slug }],
      },
    });

    if (existingProduct && product.updateIfExists) {
      // Ürün varsa ve güncellenmesi isteniyorsa güncelle
      await prisma.product.update({
        where: { id: existingProduct.id },
        data: {
          name: product.name,
          description: product.description || existingProduct.description,
          price: parseFloat(product.price) || existingProduct.price,
          discount: product.compareAtPrice
            ? parseFloat(product.compareAtPrice)
            : existingProduct.discount,
          stock:
            product.inventory !== undefined ? parseInt(product.inventory) : existingProduct.stock,
          categoryId: categoryId || existingProduct.categoryId,
          brandId: brandId || existingProduct.brandId,
          featured:
            product.isFeatured !== undefined
              ? Boolean(product.isFeatured)
              : existingProduct.featured,
          metaTitle: product.metaTitle || existingProduct.metaTitle,
          metaDescription: product.metaDescription || existingProduct.metaDescription,
        },
      });
    } else if (!existingProduct) {
      // Ürün yoksa oluştur
      await prisma.product.create({
        data: {
          name: product.name,
          slug,
          description: product.description || '',
          price: parseFloat(product.price),
          discount: product.compareAtPrice ? parseFloat(product.compareAtPrice) : null,
          stock: product.inventory !== undefined ? parseInt(product.inventory) : 0,
          categoryId: categoryId || '',
          brandId: brandId || '',
          featured: product.isFeatured !== undefined ? Boolean(product.isFeatured) : false,
          metaTitle: product.metaTitle || null,
          metaDescription: product.metaDescription || null,
        },
      });
    } else {
      // Ürün var ama güncelleme yapılmayacak
      throw new Error(`Satır ${rowNumber}: Ürün zaten mevcut ve güncelleme seçeneği kapalı`);
    }
  }

  /**
   * Satır işleme hatasını yönetir
   */
  private handleRowError(result: ImportResult, error: Error): void {
    result.errorCount++;
    result.errors.push(error.message);
  }

  /**
   * Kategorileri Excel dosyasından içe aktarır
   */
  async importCategories(file: File): Promise<ImportResult> {
    try {
      const data = await this.readExcelFile(file);
      const result = this.createEmptyResult(data.length);

      for (let index = 0; index < data.length; index++) {
        const row = data[index];
        try {
          const category = row as any;
          const rowNumber = index + 2;

          // Zorunlu alanları kontrol et
          this.validateRequiredFields(category, rowNumber, ['name']);

          // Slug oluştur
          const slug = category.slug || slugify(category.name);

          // Üst kategori kontrolü
          const parentId = await this.findOrCreateParentCategory(category, rowNumber);

          // Kategoriyi oluştur veya güncelle
          await this.createOrUpdateCategory(category, slug, parentId, rowNumber);

          result.successCount++;
        } catch (error: any) {
          this.handleRowError(result, error);
        }
      }

      return this.finalizeResult(result);
    } catch (error: any) {
      return this.createErrorResult(error);
    }
  }

  /**
   * Üst kategoriyi bulur veya oluşturur
   */
  private async findOrCreateParentCategory(
    category: any,
    rowNumber: number
  ): Promise<string | null> {
    if (!category.parentName) return null;

    const parentCategory = await prisma.category.findFirst({
      where: { name: category.parentName },
    });

    if (!parentCategory && category.createParentIfNotExists) {
      // Üst kategori yoksa ve oluşturulması isteniyorsa oluştur
      const newParentCategory = await prisma.category.create({
        data: {
          name: category.parentName,
          slug: slugify(category.parentName),
          description: '',
        },
      });
      return newParentCategory.id;
    } else if (parentCategory) {
      return parentCategory.id;
    }

    return null;
  }

  /**
   * Kategoriyi oluşturur veya günceller
   */
  private async createOrUpdateCategory(
    category: any,
    slug: string,
    parentId: string | null,
    rowNumber: number
  ): Promise<void> {
    const existingCategory = await prisma.category.findFirst({
      where: { slug },
    });

    if (existingCategory && category.updateIfExists) {
      // Kategori varsa ve güncellenmesi isteniyorsa güncelle
      await prisma.category.update({
        where: { id: existingCategory.id },
        data: {
          name: category.name,
          description: category.description || existingCategory.description,
          parentId: parentId || existingCategory.parentId,
        },
      });
    } else if (!existingCategory) {
      // Kategori yoksa oluştur
      await prisma.category.create({
        data: {
          name: category.name,
          slug,
          description: category.description || '',
          parentId,
        },
      });
    } else {
      // Kategori var ama güncelleme yapılmayacak
      throw new Error(`Satır ${rowNumber}: Kategori zaten mevcut ve güncelleme seçeneği kapalı`);
    }
  }

  /**
   * Markaları Excel dosyasından içe aktarır
   */
  async importBrands(file: File): Promise<ImportResult> {
    try {
      const data = await this.readExcelFile(file);
      const result = this.createEmptyResult(data.length);

      for (let index = 0; index < data.length; index++) {
        const row = data[index];
        try {
          const brand = row as any;
          const rowNumber = index + 2;

          // Zorunlu alanları kontrol et
          this.validateRequiredFields(brand, rowNumber, ['name']);

          // Slug oluştur
          const slug = brand.slug || slugify(brand.name);

          // Markayı oluştur veya güncelle
          await this.createOrUpdateBrand(brand, slug, rowNumber);

          result.successCount++;
        } catch (error: any) {
          this.handleRowError(result, error);
        }
      }

      return this.finalizeResult(result);
    } catch (error: any) {
      return this.createErrorResult(error);
    }
  }

  /**
   * Markayı oluşturur veya günceller
   */
  private async createOrUpdateBrand(brand: any, slug: string, rowNumber: number): Promise<void> {
    const existingBrand = await prisma.brand.findFirst({
      where: { slug },
    });

    if (existingBrand && brand.updateIfExists) {
      // Marka varsa ve güncellenmesi isteniyorsa güncelle
      await prisma.brand.update({
        where: { id: existingBrand.id },
        data: {
          name: brand.name,
          description: brand.description || existingBrand.description,
          logo: brand.logo || existingBrand.logo,
          country: brand.country || existingBrand.country,
        },
      });
    } else if (!existingBrand) {
      // Marka yoksa oluştur
      await prisma.brand.create({
        data: {
          name: brand.name,
          slug,
          description: brand.description || '',
          logo: brand.logo || null,
          country: brand.country || null,
        },
      });
    } else {
      // Marka var ama güncelleme yapılmayacak
      throw new Error(`Satır ${rowNumber}: Marka zaten mevcut ve güncelleme seçeneği kapalı`);
    }
  }

  /**
   * Varyantları Excel dosyasından içe aktarır
   */
  async importVariants(file: File): Promise<ImportResult> {
    try {
      const data = await this.readExcelFile(file);
      const result = this.createEmptyResult(data.length);

      for (let index = 0; index < data.length; index++) {
        const row = data[index];
        try {
          const variant = row as any;
          const rowNumber = index + 2;

          // Ürün bilgisi kontrolü
          if (!variant.productId && !variant.productName) {
            throw new Error(`Satır ${rowNumber}: Ürün bilgisi eksik (ID veya isim gerekli)`);
          }

          // Zorunlu alanları kontrol et
          this.validateRequiredFields(variant, rowNumber, ['name', 'sku']);

          // Ürünü bul
          const product = await this.findProduct(variant, rowNumber);

          // Varyant değerlerini hazırla
          const options = this.prepareVariantOptions(variant);

          // Varyantı oluştur veya güncelle
          await this.createOrUpdateVariant(variant, product, options, rowNumber);

          result.successCount++;
        } catch (error: any) {
          this.handleRowError(result, error);
        }
      }

      return this.finalizeResult(result);
    } catch (error: any) {
      return this.createErrorResult(error);
    }
  }

  /**
   * Ürünü bulur
   */
  private async findProduct(variant: any, rowNumber: number) {
    let product;
    if (variant.productId) {
      product = await prisma.product.findUnique({
        where: { id: variant.productId },
      });
    } else if (variant.productName) {
      product = await prisma.product.findFirst({
        where: { name: variant.productName },
      });
    }

    if (!product) {
      throw new Error(`Satır ${rowNumber}: Ürün bulunamadı`);
    }

    return product;
  }

  /**
   * Varyant seçeneklerini hazırlar
   */
  private prepareVariantOptions(variant: any): Record<string, string> {
    const options: Record<string, string> = {};

    // Dinamik olarak option1, option2, option3 gibi alanları işle
    for (let i = 1; i <= 3; i++) {
      const optionName = variant[`optionName${i}`];
      const optionValue = variant[`optionValue${i}`];

      if (optionName && optionValue) {
        options[optionName] = optionValue;
      }
    }

    return options;
  }

  /**
   * Varyantı oluşturur veya günceller
   */
  private async createOrUpdateVariant(
    variant: any,
    product: any,
    options: Record<string, string>,
    rowNumber: number
  ): Promise<void> {
    const existingVariant = await prisma.variation.findFirst({
      where: {
        productId: product.id,
        sku: variant.sku,
      },
    });

    if (existingVariant && variant.updateIfExists) {
      // Varyant varsa ve güncellenmesi isteniyorsa güncelle
      await prisma.variation.update({
        where: { id: existingVariant.id },
        data: {
          name: variant.name,
          price: variant.price ? parseFloat(variant.price) : existingVariant.price,
          stock:
            variant.inventory !== undefined ? parseInt(variant.inventory) : existingVariant.stock,
        },
      });

      // Varyant seçeneklerini güncelle
      await this.updateVariationOptions(existingVariant.id, options);
    } else if (!existingVariant) {
      // Varyant yoksa oluştur
      const newVariation = await prisma.variation.create({
        data: {
          productId: product.id,
          name: variant.name,
          sku: variant.sku,
          price: variant.price ? parseFloat(variant.price) : product.price,
          stock: variant.inventory !== undefined ? parseInt(variant.inventory) : 0,
        },
      });

      // Varyant seçeneklerini ekle
      await this.createVariationOptions(newVariation.id, options);
    } else {
      // Varyant var ama güncelleme yapılmayacak
      throw new Error(`Satır ${rowNumber}: Varyant zaten mevcut ve güncelleme seçeneği kapalı`);
    }
  }

  /**
   * Varyant seçeneklerini oluşturur
   */
  private async createVariationOptions(
    variationId: string,
    options: Record<string, string>
  ): Promise<void> {
    for (const [optionName, optionValue] of Object.entries(options)) {
      // Önce option type'ı bul veya oluştur
      let optionType = await prisma.optionType.findFirst({
        where: { name: optionName },
      });

      if (!optionType) {
        optionType = await prisma.optionType.create({
          data: { name: optionName },
        });
      }

      // Varyasyon seçeneğini oluştur
      await prisma.variationOption.create({
        data: {
          variationId,
          optionTypeId: optionType.id,
          value: optionValue,
        },
      });
    }
  }

  /**
   * Varyant seçeneklerini günceller
   */
  private async updateVariationOptions(
    variationId: string,
    options: Record<string, string>
  ): Promise<void> {
    // Mevcut seçenekleri sil
    await prisma.variationOption.deleteMany({
      where: { variationId },
    });

    // Yeni seçenekleri ekle
    await this.createVariationOptions(variationId, options);
  }

  /**
   * Örnek Excel şablonu oluşturur
   */
  createTemplate(type: ImportType): Blob {
    const workbook = XLSX.utils.book_new();
    let data: any[] = [];

    switch (type) {
      case 'products':
        data = this.createProductTemplateData();
        break;
      case 'categories':
        data = this.createCategoryTemplateData();
        break;
      case 'brands':
        data = this.createBrandTemplateData();
        break;
      case 'variants':
        data = this.createVariantTemplateData();
        break;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    return new Blob([XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  }

  /**
   * Ürün şablonu verisi oluşturur
   */
  private createProductTemplateData(): any[] {
    return [
      {
        name: 'Örnek Ürün',
        description: 'Ürün açıklaması',
        price: 199.99,
        compareAtPrice: 249.99,
        inventory: 100,
        categoryName: 'Elektronik',
        brandName: 'Örnek Marka',
        isFeatured: false,
        slug: 'ornek-urun',
        updateIfExists: true,
        createCategoryIfNotExists: true,
        createBrandIfNotExists: true,
        metaTitle: 'Örnek Ürün - SEO Başlığı',
        metaDescription: 'Örnek ürün için SEO açıklaması',
      },
    ];
  }

  /**
   * Kategori şablonu verisi oluşturur
   */
  private createCategoryTemplateData(): any[] {
    return [
      {
        name: 'Elektronik',
        description: 'Elektronik ürünler',
        parentName: 'Ana Kategori',
        slug: 'elektronik',
        updateIfExists: true,
        createParentIfNotExists: true,
      },
    ];
  }

  /**
   * Marka şablonu verisi oluşturur
   */
  private createBrandTemplateData(): any[] {
    return [
      {
        name: 'Örnek Marka',
        description: 'Marka açıklaması',
        logo: 'https://example.com/logo.png',
        country: 'Türkiye',
        slug: 'ornek-marka',
        updateIfExists: true,
      },
    ];
  }

  /**
   * Varyant şablonu verisi oluşturur
   */
  private createVariantTemplateData(): any[] {
    return [
      {
        productName: 'Örnek Ürün',
        name: 'Kırmızı / L',
        sku: 'ORN-RED-L',
        price: 199.99,
        inventory: 50,
        optionName1: 'Renk',
        optionValue1: 'Kırmızı',
        optionName2: 'Beden',
        optionValue2: 'L',
        updateIfExists: true,
      },
    ];
  }
}
