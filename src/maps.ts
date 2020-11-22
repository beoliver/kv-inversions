export const union = <A, B>(
  mergeFn: (acc: B, val: B) => B,
  ...maps: Map<A, B>[]
): Map<A, B> => {
  if (maps.length === 0) {
    return new Map<A, B>();
  }
  if (maps.length === 1) {
    return new Map(maps[0]);
  }
  const union = new Map<A, B>();
  for (const map of maps) {
    for (const [k, v] of map.entries()) {
      if (union.has(k)) {
        union.set(k, mergeFn(union.get(k)!, v));
      } else {
        union.set(k, v);
      }
    }
  }
  return union;
};

export const intersection = <A, B>(
  mergeFn: (acc: B, val: B) => B,
  ...maps: Map<A, B>[]
): Map<A, B> => {
  if (maps.length === 0) {
    return new Map<A, B>();
  }
  if (maps.length === 1) {
    return new Map(maps[0]);
  }
  const sortedMaps = [...maps].sort((a, b) => a.size - b.size);
  let minimal_return_map = sortedMaps[0];
  for (let i = 1; i < sortedMaps.length; i++) {
    const current_map = sortedMaps[i];
    const new_minimal_return_map = new Map<A, B>();
    for (const [k, v] of minimal_return_map.entries()) {
      if (current_map.has(k)) {
        const new_value = mergeFn(v, current_map.get(k)!);
        new_minimal_return_map.set(k, new_value);
      }
    }
    minimal_return_map = new_minimal_return_map;
    if (minimal_return_map.size === 0) {
      return minimal_return_map;
    }
  }
  return minimal_return_map;
};

export const mapKeys = <K1, K2, V>(
  fn: (k: K1) => K2,
  map: Map<K1, V>
): Map<K2, V> => new Map(Array.from(map.entries(), ([k, v]) => [fn(k), v]));

export const mapVals = <K, V1, V2>(
  fn: (v: V1) => V2,
  map: Map<K, V1>
): Map<K, V2> => new Map(Array.from(map.entries(), ([k, v]) => [k, fn(v)]));

export const mapValsAsync = async <K, V1, V2>(
  fn: (v: V1) => Promise<V2>,
  map: Map<K, V1>
): Promise<Map<K, V2>> => {
  const mapped = await Promise.all(
    Array.from(map.entries()).map(
      async ([k, v]): Promise<[K, V2]> => {
        const v2 = await fn(v);
        return [k, v2];
      }
    )
  );
  return new Map(mapped);
};

export const mapEntriesAsync = async <K1, V1, K2, V2>(
  fn: (entry: [K1, V1]) => Promise<[K2, V2]>,
  map: Map<K1, V1>
): Promise<Map<K2, V2>> => {
  const mapped = await Promise.all(
    Array.from(map.entries()).map(
      async (entry): Promise<[K2, V2]> => {
        return fn(entry);
      }
    )
  );
  return new Map(mapped);
};

export const invertOneToOne = <K, V>(mapping: Map<K, V>) => {
  const inversion = new Map<V, K>();
  mapping.forEach(inversion.set);
  return inversion;
};

export const invertManyToOne = <K, V>(mapping: Map<K, V>) => {
  const inversion = new Map<V, K[]>();
  mapping.forEach((v, k) => {
    let xs = inversion.get(v);
    if (xs === undefined) {
      inversion.set(v, [k]);
    } else {
      xs.push(k);
    }
  });
  return inversion;
};

export const invertOneToMany = <K, V>(
  mapping: Map<K, Iterable<V>>
): Map<V, K> => {
  const inversion = new Map<V, K>();
  mapping.forEach((vals, k) => {
    for (let v of vals) {
      inversion.set(v, k);
    }
  });
  return inversion;
};

export const invertManyToMany = <K, V>(mapping: Map<K, Iterable<V>>) => {
  const inversion = new Map<V, K[]>();
  mapping.forEach((vals, k) => {
    for (let v of vals) {
      let xs = inversion.get(v);
      if (xs === undefined) {
        inversion.set(v, [k]);
      } else {
        xs.push(k);
      }
    }
  });
  return inversion;
};
