'use client'
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { dateFrom, debounce } from "@/app/lib/utils";

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
    <div className='search profile-search'>
      <label htmlFor="search" className="sr-only">Search</label>
      <input
        type="text"
        name="search"
        id="search"
        placeholder={placeholder}
        onChange={e => handleSearch(e.target.value, 'query')}
        defaultValue={searchParams.get('query')?.toString()}
      />

      <label htmlFor="before">
        Joined before{' '}
        <input 
          id="before" 
          type="date"
          name="range-before"
          defaultValue={searchParams.get('joinedAfter')?.toString()}
          min={'2010-01-01'}
          max={dateFrom(new Date)!}
          onChange={e => handleSearch(e.target.value, 'joinedAfter')} 
        />
      </label>
  
      <label htmlFor="after">
        Joined after{' '}
        <input 
          id="after" 
          type="date"
          name="range-after"
          defaultValue={searchParams.get('joinedBefore')?.toString()}
          min={'2010-01-01'}
          max={dateFrom(new Date)!}
          onChange={e => handleSearch(e.target.value, 'joinedBefore')}
        />
      </label>
    </div>
  );
}