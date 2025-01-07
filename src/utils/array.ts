import { hasValue } from './predicates';

export const purge = <T>(array: Array<T>): Array<T> => array.filter(hasValue);

export const unique = <T>(arr: Array<T>) => [...new Set(arr)];
