import { Option, Question, Quiz } from "@prisma/client";

type Cache = Quiz & { questions: (Question & { options: Option[] })[] };

type CacheItem = {
  data: Cache;
  expiresAt: number;
};

let cache: CacheItem[] = [];

export const setCache = (data: Cache, ttlMin: number) => {
  const expiresAt = Date.now() + ttlMin * 60 * 1000;

  cache = cache.filter((c) => c.data.id !== data.id);

  cache.push({ data, expiresAt });
};

export const getCache = () => {
  const now = Date.now();

  cache = cache.filter((c) => c.expiresAt > now);

  return cache.map((c) => c.data);
};

export const getCacheById = (id: string) => {
  const now = Date.now();

  const item = cache.find((c) => c.data.id === id && c.expiresAt > now);

  console.log(JSON.stringify(item));
  if (!item) return null;
  return item.data;
};
