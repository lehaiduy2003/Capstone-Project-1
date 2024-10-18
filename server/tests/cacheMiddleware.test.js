const { generateCacheKey } = require("../middlewares/cacheMiddleware");

test("should generate a cache key with only the original URL if params and query are empty", () => {
  const req = {
    originalUrl: "/products",
    params: {},
    query: {},
  };

  const expectedKey = "/products";
  const cacheKey = generateCacheKey(req);

  expect(cacheKey).toBe(expectedKey);
});

test("should generate a cache key with params only", () => {
  const req = {
    originalUrl: "/products",
    params: { id: "123" },
    query: {},
  };

  const expectedKey = "/products|id:123";
  const cacheKey = generateCacheKey(req);

  expect(cacheKey).toBe(expectedKey);
});

test("should generate a cache key with query only", () => {
  const req = {
    originalUrl: "/products/search",
    params: {},
    query: { name: "test", sort: "createdAt", orderBy: "-1", limit: "10" },
  };

  const expectedKey =
    "/products/search|name:test|sort:createdAt|orderBy:-1|limit:10";
  const cacheKey = generateCacheKey(req);
});
test("should generate a cache key with only the original URL if params and query are empty", () => {
  const req = {
    originalUrl: "/products",
    params: {},
    query: {},
  };

  const expectedKey = "/products";
  const cacheKey = generateCacheKey(req);

  expect(cacheKey).toBe(expectedKey);
});

test("should generate a cache key with params only", () => {
  const req = {
    originalUrl: "/products",
    params: { id: "123" },
    query: {},
  };

  const expectedKey = "/products|id:123";
  const cacheKey = generateCacheKey(req);

  expect(cacheKey).toBe(expectedKey);
});

test("should generate a cache key with query only", () => {
  const req = {
    originalUrl: "/products/search",
    params: {},
    query: { name: "test", sort: "createdAt", orderBy: "-1", limit: "10" },
  };

  const expectedKey =
    "/products/search|name:test|sort:createdAt|orderBy:-1|limit:10";
  const cacheKey = generateCacheKey(req);

  expect(cacheKey).toBe(expectedKey);
});

test("should generate a cache key with both params and query", () => {
  const req = {
    originalUrl: "/products/search",
    params: { id: "123" },
    query: { name: "test", sort: "createdAt", orderBy: "-1", limit: "10" },
  };

  const expectedKey =
    "/products/search|id:123|name:test|sort:createdAt|orderBy:-1|limit:10";
  const cacheKey = generateCacheKey(req);

  expect(cacheKey).toBe(expectedKey);
});

test("should generate a cache key with special characters in params and query", () => {
  const req = {
    originalUrl: "/products/search",
    params: { id: "123@#$" },
    query: { name: "test!@#", sort: "createdAt", orderBy: "-1", limit: "10" },
  };

  const expectedKey =
    "/products/search|id:123@#$|name:test!@#|sort:createdAt|orderBy:-1|limit:10";
  const cacheKey = generateCacheKey(req);

  expect(cacheKey).toBe(expectedKey);
});

test("should generate a cache key with empty values in params and query", () => {
  const req = {
    originalUrl: "/products/search",
    params: { id: "" },
    query: { name: "", sort: "createdAt", orderBy: "-1", limit: "10" },
  };

  const expectedKey =
    "/products/search|id:|name:|sort:createdAt|orderBy:-1|limit:10";
  const cacheKey = generateCacheKey(req);

  expect(cacheKey).toBe(expectedKey);
});

test("should generate a cache key with mixed types of params and query", () => {
  const req = {
    originalUrl: "/products/search",
    params: { id: "123", category: "electronics" },
    query: { name: "test", sort: "createdAt", orderBy: "-1", limit: "10" },
  };

  const expectedKey =
    "/products/search|id:123|category:electronics|name:test|sort:createdAt|orderBy:-1|limit:10";
  const cacheKey = generateCacheKey(req);

  expect(cacheKey).toBe(expectedKey);
});

test("should generate a cache key with numeric values in params and query", () => {
  const req = {
    originalUrl: "/products/search",
    params: { id: "123" },
    query: { name: "test", sort: "createdAt", orderBy: "-1", limit: 10 },
  };

  const expectedKey =
    "/products/search|id:123|name:test|sort:createdAt|orderBy:-1|limit:10";
  const cacheKey = generateCacheKey(req);

  expect(cacheKey).toBe(expectedKey);
});

test("should generate a cache key with boolean values in query", () => {
  const req = {
    originalUrl: "/products/search",
    params: { id: "123" },
    query: { name: "test", sort: "createdAt", orderBy: "-1", inStock: true },
  };

  const expectedKey =
    "/products/search|id:123|name:test|sort:createdAt|orderBy:-1|inStock:true";
  const cacheKey = generateCacheKey(req);

  expect(cacheKey).toBe(expectedKey);
});
