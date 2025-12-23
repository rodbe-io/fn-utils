import type { Func } from '@/types';

export const pipe = <FirstFunc extends Func, LastFunc extends Func>(
  ...fns: [FirstFunc, ...Array<Func>, LastFunc]
): ((...rootArgs: Parameters<FirstFunc>) => ReturnType<LastFunc>) =>
  fns.reduce(
    (acc, currentFunc) =>
      (...args: [...Parameters<FirstFunc>]) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        currentFunc(acc(...args))
  );

export const compose = <FirstFunc extends Func, LastFunc extends Func>(
  ...fns: [FirstFunc, ...Array<Func>, LastFunc]
): ((...rootArgs: Parameters<LastFunc>) => ReturnType<FirstFunc>) =>
  fns.reduceRight(
    (acc, currentFunc) =>
      (...args: [...Parameters<LastFunc>]) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        currentFunc(acc(...args))
  );
