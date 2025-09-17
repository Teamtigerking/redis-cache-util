# @teamtigerking/redis-cache-util

Redis caching utility with distributed lock and stampede protection for microservices.

## 🚀 Features

- ✅ Prevents cache stampede
- ✅ Distributed locking with auto-expiry
- ✅ Configurable retry, TTL, and lock timeout
- ✅ Safe unlock using Redis Lua scripting

## 📦 Installation

```bash
npm install @teamtigerking/redis-cache-util


## 🛠 Usage

```js
import { createClient } from 'redis';
import CacheService from '@teamtigerking/redis-cache-util';

const redisClient = createClient();
await redisClient.connect();

const cache = new CacheService(redisClient);

const data = await cache.get('product:123', async () => {
  return await db.products.findById(123);
});
```

### Basic Cache Access

```js
import { createClient } from 'redis';
import CacheService from '@teamtigerking/redis-cache-util';

const redisClient = createClient();
await redisClient.connect();

const cache = new CacheService(redisClient);

const data = await cache.get('product:123', async () => {
  return await db.products.findById(123);
});
```

### 🧱 Using Key Utilities

```js
import { productKey } from '@teamtigerking/redis-cache-util/src/key-utils.mjs';

const key = productKey(123); // cache:product:123
await cache.get(key, async () => fetchProduct(123));
```

### ⏱ TTL Map

```js
import { ttlMap } from '@teamtigerking/redis-cache-util/src/ttl-map.mjs';

const ttl = ttlMap['product'] || ttlMap['default'];
await cache.set('product:123', productData, ttl);
```

### 🌐 Configurable Prefix

```js
// src/config.mjs
export const defaultPrefix = process.env.REDIS_KEY_PREFIX || 'cache';
```

Set the environment variable to change prefix globally:
```bash
export REDIS_KEY_PREFIX=prod
```

## 📖 License

MIT