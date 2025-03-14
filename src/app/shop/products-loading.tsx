export default function ProductsLoading() {
  // Yükleme durumunda gösterilecek iskelet (skeleton) bileşenleri
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3 mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
