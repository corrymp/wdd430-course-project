'use client';

import Link from 'next/link';
import { generatePagination } from '@/app/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';
import '@/app/ui/pagination.css';

function PaginationNumber({ page, href, isActive, position }: { page: number | string; href: string; position?: 'first' | 'last' | 'middle' | 'single'; isActive: boolean; }) {
  const className = `pag-crumb ${position} ${isActive ? 'active' : 'inactive'}`;

  return isActive || position === 'middle' ?
    (<div className={className}>{page}</div>) :
    (<Link href={href} className={className}>{page}</Link>);
};

function PaginationArrow({ href, direction, isDisabled }: { href: string; direction: 'left' | 'right'; isDisabled?: boolean; }) {
  const className = `pag-arr ${direction} ${(isDisabled ? 'disabled' : 'enabled')}`;
  const icon = direction === 'left' ? '<' : '>';
  return isDisabled ?
    (<div className={className}>{icon}</div>) :
    (<Link className={className} href={href}>{icon}</Link>);
};

export default function Pagination({ totalPages }: { totalPages: number; }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const allPages = generatePagination(currentPage, totalPages);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="pag">
      <PaginationArrow direction="left" href={createPageURL(currentPage - 1)} isDisabled={currentPage <= 1} />

      <div className="crumbs">
        {allPages.map((page, index) => {

          let position: 'first' | 'last' | 'single' | 'middle' | undefined;

          if (allPages.length === 1) position = 'single';
          else if (page === '...') position = 'middle';
          else if (index === 0) position = 'first';
          else if (index === allPages.length - 1) position = 'last';

          return (<PaginationNumber key={`${page}-${index}`} href={createPageURL(page)} page={page} position={position} isActive={currentPage === page} />);
        })}
      </div>

      <PaginationArrow direction="right" href={createPageURL(currentPage + 1)} isDisabled={currentPage >= totalPages} />
    </div>
  );
};
