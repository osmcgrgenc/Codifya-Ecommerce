export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Ürün resmi iskeleti */}
      <div className="aspect-square bg-gray-200"></div>

      <div className="p-4">
        {/* Ürün adı iskeleti */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>

        <div className="flex justify-between items-center mt-4">
          {/* Fiyat iskeleti */}
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>

          {/* Buton iskeleti */}
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
}
