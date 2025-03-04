import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { productService } from '@/services';
import ProductDetail from './product-detail';
import { Product, Category } from '@prisma/client';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await productService.getProductById(params.id);

  if (!product) {
    return {
      title: 'Ürün Bulunamadı',
    };
  }

  return {
    title: `${product.name} | Codifya E-Ticaret`,
    description: product.description || 'Ürün detayları',
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await productService.getProductById(params.id);

  if (!product) {
    return notFound();
  }

  return (
    <ProductDetail
      product={
        product as Product & {
          category: Category | null;
          images: { url: string; isMain: boolean }[];
        }
      }
    />
  );
}
