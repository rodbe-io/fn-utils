import type { Func } from '@/types';

export const tryCatch = <T>(fn: Func): [null, T] | [Error, null] => {
  try {
    return [null, fn()];
  } catch (err) {
    return [err as Error, null];
  }
};
