export const union = <T>(...sets: Set<T>[]): Set<T> => {
  if (sets.length === 0) {
    return new Set<T>();
  }
  if (sets.length === 1) {
    return new Set<T>(sets[0]);
  }
  const c = new Set<T>();
  for (const set of sets) {
    for (const x of set) {
      c.add(x);
    }
  }
  return c;
};

export const intersect = <T>(...sets: Set<T>[]): Set<T> => {
  if (sets.length === 0) {
    return new Set();
  }
  if (sets.length === 1) {
    // make sure to return a new set
    return new Set(sets[0]);
  }
  const xs = [...sets].sort((a, b) => a.size - b.size);
  let minimal_return_set = xs[0];
  for (let i = 1; i < xs.length; i++) {
    const current_set = xs[i];
    const new_minimal_return_set = new Set<T>();
    for (const x of minimal_return_set) {
      if (current_set.has(x)) {
        new_minimal_return_set.add(x);
      }
    }
    minimal_return_set = new_minimal_return_set;
    if (minimal_return_set.size === 0) {
      return minimal_return_set;
    }
  }
  return minimal_return_set;
};

export const difference = <T>(...sets: Set<T>[]): Set<T> => {
  if (sets.length === 0) {
    return new Set<T>();
  }
  if (sets.length === 1) {
    return new Set(sets[0]);
  }
  let diff = new Set(sets[0]);
  for (let i = 1; i < sets.length; i++) {
    for (const x of sets[i]) {
      diff.delete(x);
    }
  }
  return diff;
};

export const symmetricDifference = <T>(...sets: Set<T>[]): Set<T> =>
  difference(union(...sets), intersect(...sets));
