export interface FetchErr {
  status: number;
  statusText: string;
}

export const fetcher = async <Res>(url: string, opts: RequestInit): Promise<[FetchErr | Error, null] | [null, Res]> => {
  try {
    const response = await fetch(url, opts);

    if (!response.ok) {
      console.log('Fetcher res-error:', response);

      return [
        {
          status: response.status,
          statusText: response.statusText,
        },
        null,
      ];
    }

    return [null, (await response.json()) as Res];
  } catch (err) {
    console.log('Fetcher error:', err);

    return [err as Error, null];
  }
};

const delay = async (ms: number) => {
  return new Promise<void>(resolve => {
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

export const retryFetch =
  (config: FetcherConfig = defaultRetry) =>
  async <Res>(url: string, options: RequestInit) => {
    const { retries, retryDelay, statusToRetry } = config;

    return new Promise<[FetchErr | Error, null] | [null, Res]>(resolve => {
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
