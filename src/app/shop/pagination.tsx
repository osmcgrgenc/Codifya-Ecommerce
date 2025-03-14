import Link from 'next/link';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  createHref: (page: number) => string;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  createHref,
}: PaginationProps) {
  // Gösterilecek sayfa numaralarını hesapla
  const pageNumbers: number[] = [];
  const maxVisiblePages = 5;

  // Sayfa numaralarını oluştur
  if (totalPages <= maxVisiblePages) {
    // Toplam sayfa sayısı az ise tüm sayfaları göster
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Toplam sayfa sayısı fazla ise akıllı bir şekilde göster
    if (currentPage <= 3) {
      // Başlangıçtayız
      for (let i = 1; i <= 4; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Sondayız
      pageNumbers.push(1);
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Ortadayız
      pageNumbers.push(1);
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push(totalPages);
    }
  }

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={createHref(currentPage - 1)} />
          </PaginationItem>
        )}

        {pageNumbers.map((page, index) => {
          // Eğer ardışık olmayan sayfa numaraları arasında boşluk varsa "..." göster
          if (index > 0 && pageNumbers[index] - pageNumbers[index - 1] > 1) {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <span className="flex h-9 w-9 items-center justify-center">...</span>
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink href={createHref(page)} isActive={page === currentPage}>
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={createHref(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
} 