import { describe, expect, it } from 'vitest';

import { tryCatch } from '../utils/try-catch';

describe('tryCatch', () => {
  const MAGIC_NUMBER = 42;

  // Success:

  it('should return the result of a successful function execution', () => {
    const fn = () => JSON.parse('{"key": "value"}') as { key: string };
    const result = tryCatch<{ key: string }>(fn);

    expect(result).toEqual([null, { key: 'value' }]);
  });

  it('should handle functions that return primitive values', () => {
    const fn = () => MAGIC_NUMBER;
    const result = tryCatch<number>(fn);

    expect(result).toEqual([null, MAGIC_NUMBER]);
  });

  it('should work with non-pure functions (e.g., functions with side effects)', () => {
    let counter = 0;
    const fn = () => {
      counter++;

      return counter;
    };

    const result = tryCatch<number>(fn);

    expect(result).toEqual([null, 1]);
    expect(counter).toBe(1);
  });

  it('should return the correct type when the function returns null', () => {
    const fn = () => null;
    const result = tryCatch<null>(fn);

    expect(result).toEqual([null, null]);
  });

  it('should handle empty functions (functions that return undefined)', () => {
    const fn = () => {
      // void function
    };
    const result = tryCatch(fn);

    expect(result).toEqual([null, undefined]);
  });

  // Error catch:

  it('should return an error if the function throws an exception', () => {
    const fn = () => {
      // @ts-expect-error: lets test error
      return JSON.parse([MAGIC_NUMBER, MAGIC_NUMBER]) as Array<number>;
    };
    const result = tryCatch(fn);

    expect(result[0]).toBeInstanceOf(Error);
    expect(result[1]).toBeNull();
  });

  it('should handle synchronous errors correctly', () => {
    const fn = () => {
      throw new Error('Test Error');
    };

    const result = tryCatch(fn);

    expect(result[0]).toBeInstanceOf(Error);
    expect(result[0]?.message).toBe('Test Error');
    expect(result[1]).toBeNull();
  });

  it('should handle synchronous errors correctly', () => {
    const fn = () => {
      throw new Error('Ups');
    };
    const result = tryCatch(fn);

    expect(result).toEqual([new Error('Ups'), null]);
  });
});
