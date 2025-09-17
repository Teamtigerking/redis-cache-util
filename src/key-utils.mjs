// key-utils.mjs
import { defaultPrefix } from './config.mjs';

/**
 * Build a namespaced Redis key.
 * @param {...string} parts - Segments of the key.
 * @param {string} [prefix=defaultPrefix] - Optional override prefix
 * @returns {string}
 */
export function buildKey(...parts) {
  return [defaultPrefix, ...parts].join(':');
}

/**
 * Encode query or dynamic data safely for Redis key.
 * @param {string} input
 * @returns {string}
 */
export function safeEncode(input) {
  return encodeURIComponent(input.toLowerCase().replace(/\s+/g, '-'));
}

export function productKey(productId) {
  return buildKey('product', productId);
}

export function categoryPageKey(categorySlug, page = 1) {
  return buildKey('category', safeEncode(categorySlug), 'page', String(page));
}

export function sessionKey(userId) {
  return buildKey('session', 'user', userId);
}

export function searchKey(query, page = 1) {
  return buildKey('search', safeEncode(query), 'page', String(page));
}

export function stockKey(productId) {
  return buildKey('stock', productId);
}
