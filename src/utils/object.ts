import { purge } from './array';

export const getProp =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  <Expected, T = object>(key: string) =>
    (obj: T) => {
      const props = purge(key.trim().split('.'));

      if (props.length === 1) {
        return obj[props[0] as keyof T];
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      return props.reduce((acc, prop) => (acc as any)[prop], obj) as Expected | undefined;
    };

interface FuzzySearch<T> {
  items: Array<T>;
  key: string;
  searchText: string;
}
export const fuzzySearch = <T extends object>({ searchText, items, key }: FuzzySearch<T>): Array<T> => {
  const searches = searchText.split(' ');
  let filtered = structuredClone(items);

  searches.forEach(text => {
    const regExp = new RegExp(`(${text.toLowerCase()})`);

    filtered = filtered.filter(item => {
      const matchProp = getProp(key)(item);

      if (typeof matchProp !== 'string') {
        return false;
      }

      return regExp.test(matchProp.toLowerCase());
    });
  });

  return filtered;
};
