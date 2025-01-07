// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
export const hasValue = (v: unknown) => ![null, undefined, NaN, ''].includes(v as any);

export const isObject = (value: unknown): value is object =>
  Object.prototype.toString.call(value) === '[object Object]';

export const isEmptyObj = (obj: unknown) => {
  if (!isObject(obj)) {
    return true;
  }

  return !Object.keys(obj).length;
};
