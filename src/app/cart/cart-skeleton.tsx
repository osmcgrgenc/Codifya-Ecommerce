export function CartSkeleton() {
  return (
    <div className="rounded-lg shadow-md p-6 animate-pulse">
      {/* Sepet öğeleri iskeleti */}
      <div className="flow-root">
        <ul className="-my-6 divide-y divide-gray-200">
          {Array.from({ length: 3 }).map((_, index) => (
            <li key={index} className="py-6 flex">
              <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md"></div>
              <div className="ml-4 flex-1 flex flex-col">
                <div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
                <div className="flex-1 flex items-end justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Toplam ve butonlar iskeleti */}
      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="flex justify-between mb-4">
          <div className="h-5 bg-gray-200 rounded w-32"></div>
          <div className="h-5 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="mt-6">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="mt-6 flex justify-center">
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
    </div>
  );
}
