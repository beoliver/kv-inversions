import {
  difference as setDifference,
  intersect as setIntersect,
  symmetricDifference as setSymmetricDifference,
  union as setUnion,
} from "./sets";

export const mapAsync = async <A, B>(
  fn: (x: A) => Promise<B>,
  xs: Iterable<A>
): Promise<Iterable<B>> => Promise.all(Array.from(xs).map(fn));

export const filterAsync = async <A>(
  pred: (x: A) => Promise<boolean>,
  xs: Iterable<A>
): Promise<Iterable<A>> => Promise.all(Array.from(xs).filter(pred));

export const reduceAsync = async <A, B>(
  fn: (acc: B, x: A) => Promise<B>,
  acc: B,
  xs: Iterable<A>
) => {
  let accum = acc;
  for (const x of xs) {
    accum = await fn(accum, x);
  }
  return accum;
};

export const intersect = <T>(...iterables: Iterable<T>[]): Iterable<T> =>
  setIntersect(...iterables.map((x) => new Set(x)));

export const union = <T>(...iterables: Iterable<T>[]): Iterable<T> =>
  setUnion(...iterables.map((x) => new Set(x)));

export const difference = <T>(...iterables: Iterable<T>[]): Iterable<T> =>
  setDifference(...iterables.map((x) => new Set(x)));

export const symmetricDifference = <T>(
  ...iterables: Iterable<T>[]
): Iterable<T> => setSymmetricDifference(...iterables.map((x) => new Set(x)));
