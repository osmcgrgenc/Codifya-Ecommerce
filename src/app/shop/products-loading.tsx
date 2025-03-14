import { ProductCardSkeleton } from './product-card-skeleton';

export default function ProductsLoading() {
  // Yükleme durumunda gösterilecek iskelet (skeleton) bileşenleri
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
