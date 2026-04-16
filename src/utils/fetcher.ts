export interface FetchErr {
  status: number;
  statusText: string;
}

export const fetcher = async <Res>(
  url: string,
  opts: RequestInit & { cbOnError?: (err: Response) => void; responseToJson?: boolean } = {}
): Promise<[FetchErr | Error, null] | [null, Response | Res]> => {
  try {
    const response = await fetch(url, opts);

    if (!response.ok) {
      console.log('Fetcher res-error:', response);
      opts.cbOnError?.(response);

      return [
        {
          status: response.status,
          statusText: response.statusText,
        },
        null,
      ];
    }

    if (opts.responseToJson) {
      return [null, (await response.json()) as Res];
    }

    return [null, response];
  } catch (err) {
    console.log('Fetcher error:', err);

    return [err as Error, null];
  }
};

const delay = async (ms: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

export interface FetcherConfig {
  retries: number;
  retryDelay: number;
  statusToRetry: Array<number>;
}

const defaultRetry = {
  retries: 3,
  retryDelay: 1500,
  statusToRetry: [429, 503, 504],
};

export const retryFetchBuilder =
  (config: FetcherConfig = defaultRetry) =>
  async <Res>(url: string, options: RequestInit) => {
    const { retries, retryDelay, statusToRetry } = config;

    return new Promise<[FetchErr | Error, null] | [null, Response | Res]>((resolve) => {
      const recursiveFetch = async (retry: number) => {
        const [fetchErr, fecthRes] = await fetcher<Res>(url, options);

        if (fetchErr) {
          if ('status' in fetchErr) {
            const canRetry = statusToRetry.includes(fetchErr.status);

            if (!canRetry) {
              resolve([fetchErr, null]);

              return;
            }
            if (retry - 1 > 0) {
              await delay(retryDelay);
              await recursiveFetch(--retry);
            } else {
              resolve([fetchErr, null]);
            }
          } else {
            resolve([fetchErr, null]);
          }
        } else {
          resolve([null, fecthRes]);
        }
      };

      void recursiveFetch(retries);
    });
  };
