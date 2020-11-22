export const delay = <T>(ms: number, fn: () => T): Promise<T> => {
  return new Promise((resolve: (value: T) => void) => {
    setTimeout(() => resolve(fn()), ms);
  });
};
