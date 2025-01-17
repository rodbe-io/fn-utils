import { isObject } from './predicates';

export const to = async <Response, E extends Record<string, unknown> = Record<string, unknown>>(
  promise: Promise<Response>,
  errInfo?: E
): Promise<[null, Response] | [Error & E, null]> => {
  try {
    const res = await promise;

    return [null, res];
  } catch (err) {
    if (isObject(errInfo) && err instanceof Error) {
      Object.assign(err, errInfo);
    }

    return [err as Error & E, null];
  }
};
