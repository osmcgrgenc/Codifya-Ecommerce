import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductDetail from './product-detail';
import {
  Product,
  Category,
  Brand,
  ProductImage,
  Variation,
  VariationOption,
  OptionType,
} from '@prisma/client';

// Varyasyon tipi
type VariationWithOptions = Variation & {
  options: (VariationOption & {
    optionType: OptionType;
  })[];
};

// Ürün tipi
type ProductWithRelations = Product & {
  category: Category | null;
  brand: Brand | null;
  images: ProductImage[];
  variations: VariationWithOptions[];
};

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductWithDetails(params.id);

  if (!product) {
    return {
      title: 'Ürün Bulunamadı',
    };
  }

  return {
    title: `${product.name} | Codifya E-Ticaret`,
    description: product.metaDescription || product.description || 'Ürün detayları',
    openGraph: {
      title: product.metaTitle || product.name,
      description: product.metaDescription || product.description || 'Ürün detayları',
      images: product.images.length > 0 ? [{ url: product.images[0].url }] : [],
    },
  };
}

// Ürün detaylarını getiren fonksiyon
async function getProductWithDetails(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: true,
        variations: {
          include: {
            VariationOption: {
              include: {
                optionType: true,
              },
            },
          },
        },
      },
    });

    if (!product) return null;

    // Varyasyonları doğru formata dönüştür
    const formattedProduct = {
      ...product,
      variations: product.variations.map(variation => ({
        ...variation,
        options: variation.VariationOption.map(option => ({
          ...option,
          optionType: option.optionType,
        })),
      })),
    };

    return formattedProduct as unknown as ProductWithRelations;
  } catch (error) {
    console.error('Ürün detayları getirilirken hata:', error);
    return null;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductWithDetails(params.id);

  if (!product) {
    return notFound();
  }

  return <ProductDetail product={product} />;
}
