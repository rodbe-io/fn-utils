import { isObject } from './predicates';

export type ToAwaited<Res, Err = Error> = [(Err & Error) | null, Res | null];

export const to = async <Response, Err extends Record<string, unknown> = Record<string, unknown>>(
  promise: Promise<Response>,
  errInfo?: Err
): Promise<ToAwaited<Response, Err>> => {
  try {
    const res = await promise;

    return [null, res];
  } catch (err) {
    if (isObject(errInfo) && err instanceof Error) {
      Object.assign(err, errInfo);
    }

    return [err as Error & Err, null];
  }
};
