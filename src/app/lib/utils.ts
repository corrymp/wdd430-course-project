/**
 * formatDateToLocale, formatCurrency, and generatePagination from Next.js
 * https://github.com/vercel/next-learn/blob/main/dashboard/final-example/app/lib/utils.ts
 */

/**
 * @param {string|number|Date} date - the date to format
 * @param {string} locale - the locale to format to
 * @returns {string} date string in the requested locale
 */
export const formatDateToLocal = (date: string | number | Date, locale: string = 'en-US'): string => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date));

/**
 * @param {number} amount - the amount in cents to format
 * @returns {string} amount formated to USD
 */
export const formatCurrency = (amount: number): string => (amount / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

/**
 * @param {number} currentPage - current page in pagination
 * @param {number} totalPages - total pages to paginate
 * @returns {(number|string)[]}
 */
export const generatePagination = (currentPage: number, totalPages: number): (number | string)[] => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (currentPage <= 3) return [1, 2, 3, '...', totalPages - 1, totalPages];
  if (currentPage >= totalPages - 2) return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};

export const date = () => new Date().toISOString().split('T')[0];

export const dateFrom = (d: string | number | Date | undefined) => d === undefined ? null : new Date(d).toISOString().split('T')[0];

export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(fn: F, ms: number, id?: number | NodeJS.Timeout | undefined, res?: ReturnType<F>) => (...args: Parameters<F>) => (id = (clearTimeout(id), setTimeout(() => res = fn(...args), ms)), res);

/**
 * @param first - number that will begin the array
 * @param last - number that will end the array
 * @param increment - step between numbers. May be negative
 * @returns {Array<number>} array of numbers from `start` up to and including `last`
 * @throws {RangeError} if `last` is unreachable from `first` using `increment`
 */
export const range = (first: number, last: number, increment: number): Array<number> => {
  if (first === last) return [first];
  if (increment < 0 && last > first || increment > 0 && last < first) throw new RangeError('Invalid values passed', {
    cause: `${first} + ${increment} will never reach ${last}. Did you mean ${-increment}?`
  });

  let isReversed = false;
  let abort = 0;
  const abortThreshold = Math.max(1, Math.abs(first + 1) + Math.abs(last + 1) * Math.abs(increment + 1)) || 1;

  if (last < first) {
    isReversed = true;
    increment = -increment;
    // "So the last shall be first, and the first last" - Mathew 20:16
    [last, first] = [first, last];
  }

  const arr = [];
  while (first <= last) {
    arr.push(first);
    first += increment;
    if (++abort > abortThreshold)
      throw RangeError(`Aborted after ${abort} iterations`, {
        cause: `Call should have finished by now. first: ${first}, last: ${last}, increment: ${increment}, abort at: ${abortThreshold}`
      });
  }

  if (isReversed) arr.reverse();
  return arr;
};

/**
 * @description wraps a function in a try-catch block.
 *  Calling the wrapped function returns an array with either: 
 *  - undefined and the result of the call
 *  - an error thrown by the call and undefined
 * @param {Function} fn - function to wrap
 * @returns {(...v: Array<any>) => ([undefined, ReturnType<typeof fn>] | [Error, undefined])} wrapped function
 */
export function t<Args, Returns>(fn: (...v: Args[]) => Returns): (...v: Array<Args>) => ([undefined, ReturnType<typeof fn>] | [Error, undefined]) {
  return function(...v) {
    try {
      return [undefined, fn(...v)];
    } catch (e) {
      return [e as Error, undefined];
    }
  };
};
