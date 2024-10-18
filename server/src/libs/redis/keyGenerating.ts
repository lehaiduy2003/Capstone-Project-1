import { Request } from "express";

/**
 * format cache key for preventing NoSQL injection
 * @param {Request} req
 * @returns {string} url|param1:value1|param2:value2|...
 */
export function generateCacheKey(req: Request) {
  const { originalUrl, params, query } = req;
  const keyParts = [originalUrl];

  for (const [key, value] of Object.entries(params)) {
    keyParts.push(`${key}:${value}`);
  }

  for (const [key, value] of Object.entries(query)) {
    keyParts.push(`${key}:${value}`);
  }

  return keyParts.join("|");
}
