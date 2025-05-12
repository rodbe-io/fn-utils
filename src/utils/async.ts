import { isObject } from './predicates';

export type ToAwaited<Res, Err = Error> = [Err, null] | [null, Res];

export const to = async <Response, CustomErrorObj = Record<string, unknown>>(
  promise: Promise<Response>,
  customErrorObj?: CustomErrorObj
): Promise<ToAwaited<Response, CustomErrorObj & Error>> => {
  try {
    const res = await promise;

    return [null, res];
  } catch (err) {
    if (isObject(customErrorObj) && err instanceof Error) {
      Object.assign(err, customErrorObj);
    }

    return [err as CustomErrorObj & Error, null];
  }
};
