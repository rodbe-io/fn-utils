import { describe, expect, it } from 'vitest';

import { fuzzySearch, getProp } from './object';

const obj1 = {
  age: 30,
  do: {
    re: {
      mi: {
        fa: 123,
      },
    },
  },
  name: 'Kevin',
};

const obj2 = {
  do: {
    re: {
      mi: {
        fa: 'asd',
      },
    },
  },
};

describe('getProp', () => {
  it('should get prop from first level', () => {
    const result = getProp<string>('name')(obj1);

    expect(result).toBe('Kevin');
  });

  it('should get prop from nested level', () => {
    const result = getProp('do.re.mi.fa')(obj1);

    expect(result).toBe(123);
  });

  it('should get obj prop from nested level', () => {
    const result = getProp('do.re.mi')(obj1);

    expect(result).toEqual(obj1.do.re.mi);
  });
});

describe('fuzzySearch', () => {
  it('should fuzzy search return a object', () => {
    const result = fuzzySearch({ items: [obj1], key: 'name', searchText: 'kevin' });

    expect(result).toEqual([obj1]);
  });

  it('should fuzzy search return empty array', () => {
    const result = fuzzySearch({ items: [obj1], key: 'do.re.mi.fa', searchText: 'lorem' });

    expect(result).toEqual([]);
  });

  it('should fuzzy search return nested prop match', () => {
    const result = fuzzySearch({ items: [obj1, obj2], key: 'do.re.mi.fa', searchText: 'asd' });

    expect(result).toEqual([obj2]);
  });
});
