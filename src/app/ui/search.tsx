'use client'
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { debounce } from "@/app/lib/utils";
export default function Search({ placeholder }: { placeholder: string; }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = debounce(
    (term: string, type: string) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', '1');
      if(term) params.set(type, term);
      else params.delete(type);
      replace(`${pathname}?${params.toString()}`);
    },
    500
  );

  return (
    <div>
      <label htmlFor="search" className="sr-only">Search</label>
      <input
        type="text"
        name="search"
        id="search"
        placeholder={placeholder}
        onChange={e => handleSearch(e.target.value, 'query')}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <label htmlFor="lo">Price Range (low)</label>
      <input 
        id="lo" 
        type="number"
        name="range-lo"
        defaultValue={searchParams.get('priceRangeLo')?.toString()}
        min={0}
        max={999}
        onChange={e => handleSearch(e.target.value, 'priceRangeLo')} 
      />
      <label htmlFor="hi">Price Range (high)</label>
      <input 
        id="hi" 
        type="number"
        name="range-hi"
        defaultValue={searchParams.get('priceRangeHi')?.toString()}
        min={1}
        max={9999}
        onChange={e => handleSearch(e.target.value, 'priceRangeHi')}
      />
    </div>
  );
}