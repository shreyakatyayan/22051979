const cache = new Map();

export async function fetchWithCache(url) {
  if (cache.has(url)) {
    return cache.get(url);
  }
  const res = await fetch(url);
  const data = await res.json();
  cache.set(url, data);
  return data;
}
