const storageTypes = {
  local: localStorage,
  session: sessionStorage,
};

type StorageType = keyof typeof storageTypes;

export const webStorage = (storageType: StorageType) => {
  const selectedStorage = storageTypes[storageType];

  const _parserToString = (value: unknown) => {
    return typeof value === 'string' ? value : JSON.stringify(value);
  };

  const has = (key: string) => selectedStorage.getItem(key) !== null;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  const get = <T = string>(key: string): T | null => {
    const value = selectedStorage.getItem(key);

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
      return value as any;
    }
  };

  const getRetry = async <T>(key: string, { retry = 3, timeout = 200 }) => {
    return new Promise<T | null>(resolve => {
      const intervalId = setInterval(() => {
        const value = get<T>(key);

        if (value) {
          console.log(11, 'if value', { intervalId, value });
          clearInterval(intervalId);
          resolve(value);

          return;
        }
        retry--;
        if (retry === 0) {
          clearInterval(intervalId);
          resolve(null);
        }
      }, timeout);
    });
  };

  const set = (key: string, value: unknown) => {
    selectedStorage.setItem(key, _parserToString(value));
  };

  const remove = (key: string | Array<string>) => {
    if (Array.isArray(key)) {
      key.forEach(k => {
        selectedStorage.removeItem(k);
      });

      return;
    }

    selectedStorage.removeItem(key);
  };

  return {
    get,
    getRetry,
    has,
    remove,
    set,
  };
};
