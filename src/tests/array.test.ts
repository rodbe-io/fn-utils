import { describe, expect, it } from 'vitest';

import { purge } from '../utils/array';

describe('purge', () => {
  it('should purge array', () => {
    const array = [1, '', 2, 3, null, undefined, 4, NaN, 5];
    const result = purge(array);

    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should purge array with empty array', () => {
    const array: Array<unknown> = [];
    const result = purge(array);

    expect(result).toEqual([]);
  });
});
